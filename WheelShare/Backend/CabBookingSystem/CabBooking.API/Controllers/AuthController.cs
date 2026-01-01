using CabBooking.API.DTOs.Auth;
using CabBooking.API.Models;
using CabBooking.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly EmailService _emailService;
    private readonly IConfiguration _config;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        EmailService emailService,
        IConfiguration config)
    {
        _userManager = userManager;
        _emailService = emailService;
        _config = config;
    }

    // SEND OTP FOR REGISTRATION
    [HttpPost("send-registration-otp")]
    public async Task<IActionResult> SendRegistrationOtp([FromBody] EmailDto emailDto)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(emailDto.Email);
        if (existingUser != null)
            return BadRequest(new { message = "User already exists with this email" });

        // Generate OTP
        var otp = new Random().Next(100000, 999999).ToString();
        
        try
        {
            _emailService.SendOtpEmail(emailDto.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email service error: {ex.Message}");
        }

        // For testing, store OTP in a simple way (use Redis in production)
        var tempUser = await _userManager.FindByEmailAsync($"temp_{emailDto.Email}");
        if (tempUser != null)
        {
            await _userManager.DeleteAsync(tempUser);
        }

        var otpUser = new ApplicationUser
        {
            Email = $"temp_{emailDto.Email}",
            UserName = $"temp_{emailDto.Email}",
            OtpCode = otp,
            OtpExpiry = DateTime.UtcNow.AddMinutes(5)
        };

        await _userManager.CreateAsync(otpUser, "TempPassword123!");

        return Ok(new { message = "OTP sent to email" });
    }

    // VERIFY REGISTRATION OTP
    [HttpPost("verify-registration-otp")]
    public async Task<IActionResult> VerifyRegistrationOtp(VerifyOtpDto dto)
    {
        var tempUser = await _userManager.FindByEmailAsync($"temp_{dto.Email}");
        
        if (tempUser == null)
            return BadRequest(new { message = "OTP not found or expired" });

        if (tempUser.OtpExpiry < DateTime.UtcNow)
        {
            await _userManager.DeleteAsync(tempUser);
            return BadRequest(new { message = "OTP expired" });
        }

        if (tempUser.OtpCode != dto.Otp)
            return BadRequest(new { message = "Invalid OTP" });

        // Clean up temp user
        await _userManager.DeleteAsync(tempUser);

        return Ok(new { message = "Email verified successfully" });
    }

    // REGISTER (after OTP verification)
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = new ApplicationUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role,
            EmailConfirmed = true // Email is already verified via OTP
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok("Registration successful");
    }

    // LOGIN (direct login without OTP)
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Unauthorized("Invalid credentials");

        if (!await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized("Invalid credentials");

        var token = GenerateJwt(user);
        return Ok(new { token });
    }

    private string GenerateJwt(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
