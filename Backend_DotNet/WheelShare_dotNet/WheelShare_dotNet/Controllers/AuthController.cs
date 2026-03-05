using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.DTOs;
using WheelShare_dotNet.Helpers;
using WheelShare_dotNet.Models;
using WheelShare_dotNet.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwt;
        private readonly EmailService _emailService;
        private readonly S3Service _s3Service;

        public AuthController(
            AppDbContext context,
            JwtHelper jwt,
            EmailService emailService,
            S3Service s3Service
        )
        {
            _context = context;
            _jwt = jwt;
            _emailService = emailService;
            _s3Service = s3Service;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            // Create admin user if it doesn't exist
            var adminExists = await _context.Users.AnyAsync(u => u.Role == "ADMIN");
            if (!adminExists)
            {
                var adminUser = new User
                {
                    Name = "Admin",
                    Email = "admin@wheelshare.com",
                    Phone = "0000000000",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "ADMIN",
                    IsActive = true,
                    IsEmailVerified = true,
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();
            }

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already registered");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (dto.Role == "DRIVER")
            {
                _context.Drivers.Add(new Driver
                {
                    DriverId = user.UserId,
                    LicenseNumber = "PENDING"
                });
                await _context.SaveChangesAsync();
            }

            // 1️⃣ Generate OTP ONCE
            var otp = OtpHelper.GenerateOtp();

            // 2️⃣ Save SAME OTP in DB
            _context.EmailOtps.Add(new EmailOtp
            {
                UserId = user.UserId,
                OtpCode = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            });

            await _context.SaveChangesAsync();

            // 3️⃣ Send SAME OTP via email
            await _emailService.SendOtpEmailAsync(user.Email, otp);

            return Ok("OTP sent to registered email");
        }

        // ================= VERIFY OTP =================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return BadRequest("User not found");

            if (user.IsEmailVerified)
                return BadRequest("Email already verified");

            var otpRecord = await _context.EmailOtps
                .Where(o => o.UserId == user.UserId && !o.IsUsed)
                .OrderByDescending(o => o.ExpiresAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                return BadRequest("OTP not found");

            if (otpRecord.ExpiresAt < DateTime.UtcNow)
                return BadRequest("OTP expired");

            if (otpRecord.OtpCode != dto.Otp)
                return BadRequest("Invalid OTP");

            otpRecord.IsUsed = true;
            user.IsEmailVerified = true;

            await _context.SaveChangesAsync();

            return Ok("Email verified successfully. Please login.");
        }

        // ================= RESEND OTP =================
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp(ResendOtpDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return BadRequest("User not found");

            if (user.IsEmailVerified)
                return BadRequest("Email already verified");

            // Invalidate old OTPs
            var oldOtps = await _context.EmailOtps
                .Where(o => o.UserId == user.UserId && !o.IsUsed)
                .ToListAsync();

            foreach (var otp in oldOtps)
                otp.IsUsed = true;

            // Generate new OTP
            var newOtp = OtpHelper.GenerateOtp();

            _context.EmailOtps.Add(new EmailOtp
            {
                UserId = user.UserId,
                OtpCode = newOtp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            });

            await _context.SaveChangesAsync();

            // Send new OTP email
            await _emailService.SendOtpEmailAsync(user.Email, newOtp);

            return Ok("OTP resent successfully");
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            if (!user.IsEmailVerified)
                return Unauthorized("Please verify your email first");

            var token = _jwt.GenerateToken(user.UserId, user.Role);

            return Ok(new
            {
                token,
                userId = user.UserId,
                role = user.Role,
                name = user.Name
            });
        }

        [HttpGet("test-auth")]
        [Authorize]
        public IActionResult TestAuth()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok(new { 
                message = "Auth working", 
                userId = userIdClaim,
                isAuthenticated = User.Identity?.IsAuthenticated,
                claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
            });
        }

        [HttpPost("upload-document")]
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file, [FromForm] string documentType)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int userId;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out userId))
                {
                    // For testing - use hardcoded user ID if no auth
                    userId = 1;
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound($"User not found with ID: {userId}");

                // Validate document type
                var allowedTypes = user.Role == "DRIVER" 
                    ? new[] { "LICENSE", "AADHAR" }
                    : new[] { "AADHAR" };

                if (!allowedTypes.Contains(documentType.ToUpper()))
                    return BadRequest($"Invalid document type '{documentType}' for role {user.Role}");

                // Validate file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest("Only JPG, PNG, PDF files allowed");

                if (file.Length > 10 * 1024 * 1024) // 10MB
                    return BadRequest("File size must be less than 10MB");

                string s3Key;
                try
                {
                    // Try S3 upload first
                    s3Key = await _s3Service.UploadFileAsync(file, userId, user.Role, documentType);
                }
                catch
                {
                    // Fallback to local storage
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                    Directory.CreateDirectory(uploadsPath);
                    
                    var fileName = $"{userId}_{documentType}_{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadsPath, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    s3Key = fileName;
                }

                var existingDoc = await _context.UserDocuments
                    .FirstOrDefaultAsync(d => d.UserId == userId && d.DocumentType == documentType.ToUpper());

                if (existingDoc != null)
                {
                    existingDoc.S3Key = s3Key;
                    existingDoc.VerificationStatus = "PENDING";
                    existingDoc.UploadedAt = DateTime.UtcNow;
                }
                else
                {
                    var document = new UserDocument
                    {
                        UserId = userId,
                        DocumentType = documentType.ToUpper(),
                        S3Key = s3Key,
                        VerificationStatus = "PENDING",
                        UploadedAt = DateTime.UtcNow
                    };
                    _context.UserDocuments.Add(document);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Document uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("documents/test")]
        [AllowAnonymous]
        public IActionResult TestDocuments()
        {
            return Ok(new { message = "Document endpoints are working", timestamp = DateTime.Now });
        }

        [HttpGet("my-documents")]
        public async Task<IActionResult> GetMyDocuments()
        {
            return Ok(new List<object>());
        }
    }
}
