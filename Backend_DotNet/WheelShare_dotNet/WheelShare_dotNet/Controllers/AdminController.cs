using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.Services;
using System.Linq;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly S3Service _s3Service;

        public AdminController(AppDbContext context, S3Service s3Service)
        {
            _context = context;
            _s3Service = s3Service;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string filter = "all")
        {
            try
            {
                var query = _context.Users.Where(u => u.Role != "ADMIN").AsQueryable();

                switch (filter.ToLower())
                {
                    case "verified":
                        query = query.Where(u => u.IsVerified);
                        break;
                    case "pending":
                        query = query.Where(u => !u.IsVerified);
                        break;
                }

                var users = await query.Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.IsVerified,
                    Documents = new List<object>(),
                    VerificationStatus = u.Role == "CUSTOMER" ? "PENDING" : (u.IsVerified ? "VERIFIED" : "REJECTED")
                }).ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("users/{userId}/profile")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound();

                if (user.Role == "DRIVER")
                {
                    var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.DriverId == userId);
                    var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.DriverId == userId);
                    
                    return Ok(new
                    {
                        user.UserId,
                        user.Name,
                        user.Email,
                        user.Role,
                        user.IsVerified,
                        DriverProfile = new
                        {
                            LicenseNumber = driver?.LicenseNumber,
                            VehicleModel = vehicle?.VehicleType,
                            RegistrationNumber = vehicle?.VehicleNumber,
                            IsAvailable = driver?.IsAvailable ?? false,
                            CurrentLatitude = driver?.CurrentLatitude,
                            CurrentLongitude = driver?.CurrentLongitude
                        }
                    });
                }
                
                return Ok(new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.IsVerified
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("documents/{documentId}/approve")]
        public async Task<IActionResult> ApproveDocument(int documentId)
        {
            var document = await _context.UserDocuments.FindAsync(documentId);
            if (document == null) return NotFound();

            document.VerificationStatus = "VERIFIED";
            await _context.SaveChangesAsync();

            // Check if all user documents are verified
            var user = await _context.Users.FindAsync(document.UserId);
            var allDocumentsVerified = await _context.UserDocuments
                .Where(d => d.UserId == document.UserId)
                .AllAsync(d => d.VerificationStatus == "VERIFIED");

            if (allDocumentsVerified && user != null)
            {
                user.IsVerified = true;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("documents/{documentId}/reject")]
        public async Task<IActionResult> RejectDocument(int documentId)
        {
            var document = await _context.UserDocuments.FindAsync(documentId);
            if (document == null) return NotFound();

            document.VerificationStatus = "REJECTED";
            
            // Set user as not verified if any document is rejected
            var user = await _context.Users.FindAsync(document.UserId);
            if (user != null)
            {
                user.IsVerified = false;
            }
            
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("users/{userId}/verify")]
        public async Task<IActionResult> VerifyUser(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound();

                user.IsVerified = true;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("users/{userId}/reject")]
        public async Task<IActionResult> RejectUser(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound();

                user.IsVerified = false;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var drivers = await _context.Users.CountAsync(u => u.Role == "DRIVER");
            var customers = await _context.Users.CountAsync(u => u.Role == "CUSTOMER");
            var totalRides = await _context.Rides.CountAsync();
            var completedRides = await _context.Rides.CountAsync(r => r.RideStatus == "COMPLETED");
            
            return Ok(new { 
                drivers, 
                customers, 
                totalRides, 
                completedRides,
                totalUsers = drivers + customers
            });
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenue()
        {
            try
            {
                var completedRides = await _context.Rides
                    .Where(r => r.RideStatus == "COMPLETED")
                    .ToListAsync();

                decimal totalRevenue = completedRides.Sum(r => r.Fare);
                decimal platformFee = totalRevenue * 0.10m;
                decimal driverEarnings = totalRevenue * 0.90m; 

                var driverRevenue = await _context.Rides
                    .Where(r => r.RideStatus == "COMPLETED" && r.DriverId != null)
                    .GroupBy(r => r.DriverId)
                    .Select(g => new
                    {
                        DriverId = g.Key,
                        DriverName = _context.Users.Where(u => u.UserId == g.Key).Select(u => u.Name).FirstOrDefault(),
                        TotalFare = g.Sum(r => r.Fare),
                        DriverEarning = g.Sum(r => r.Fare) * 0.90m,
                        PlatformFee = g.Sum(r => r.Fare) * 0.10m,
                        RideCount = g.Count()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    totalRevenue = Math.Round(totalRevenue, 2),
                    platformFee = Math.Round(platformFee, 2),
                    driverEarnings = Math.Round(driverEarnings, 2),
                    completedRides = completedRides.Count,
                    driverRevenue = driverRevenue.Select(d => new
                    {
                        d.DriverId,
                        d.DriverName,
                        totalFare = Math.Round(d.TotalFare, 2),
                        driverEarning = Math.Round(d.DriverEarning, 2),
                        platformFee = Math.Round(d.PlatformFee, 2),
                        d.RideCount
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}