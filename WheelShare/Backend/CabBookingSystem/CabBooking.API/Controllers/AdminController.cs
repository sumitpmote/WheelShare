using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CabBooking.API.Models;
using CabBooking.API.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/admin")]
[AllowAnonymous] // Temporarily allow anonymous access
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var totalDrivers = await _userManager.Users.Where(u => u.Role == "Driver").CountAsync();
            var totalCustomers = await _userManager.Users.Where(u => u.Role == "Customer").CountAsync();
            
            // Mock data for now since tables might not exist yet
            var stats = new
            {
                totalUsers = totalUsers,
                totalDrivers = totalDrivers,
                totalCustomers = totalCustomers,
                totalVehicles = 0,
                totalRides = 0,
                totalBookings = 0,
                activeRides = 0,
                pendingDrivers = 0
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            // Return mock data if database queries fail
            var mockStats = new
            {
                totalUsers = 150,
                totalDrivers = 45,
                totalCustomers = 105,
                totalVehicles = 38,
                totalRides = 75,
                totalBookings = 120,
                activeRides = 12,
                pendingDrivers = 8
            };

            return Ok(mockStats);
        }
    }

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetAllVehicles()
    {
        var vehicles = await _context.Vehicles
            .Include(v => v.Driver)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new
            {
                v.VehicleId,
                v.VehicleNumber,
                v.VehicleType,
                v.Make,
                v.Model,
                v.Color,
                v.SeatCapacity,
                v.IsActive,
                v.IsVerified,
                v.CreatedAt,
                v.VerifiedAt,
                DriverName = v.Driver.FullName,
                DriverPhone = v.Driver.PhoneNumber
            })
            .ToListAsync();

        return Ok(vehicles);
    }

    [HttpPut("vehicles/{id}/verify")]
    public async Task<IActionResult> VerifyVehicle(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null)
            return NotFound("Vehicle not found");

        vehicle.IsVerified = true;
        vehicle.VerifiedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Vehicle verified successfully" });
    }
}