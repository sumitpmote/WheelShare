using CabBooking.API.Data;
using CabBooking.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CabBooking.API.Models;

namespace CabBooking.API.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    [Authorize] // Remove role requirement temporarily
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehiclesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Test endpoint without authentication
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "VehiclesController is working", timestamp = DateTime.UtcNow });
        }

        [HttpPost]
        [AllowAnonymous] // Temporarily allow anonymous access for testing
        public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto dto)
        {
            try
            {
                var existingVehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.VehicleNumber == dto.VehicleNumber);

                if (existingVehicle != null)
                    return BadRequest(new { message = "Vehicle with this number already exists" });

                // Create a test user first if it doesn't exist
                var testUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == "test@driver.com");
                if (testUser == null)
                {
                    testUser = new ApplicationUser
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = "test@driver.com",
                        Email = "test@driver.com",
                        NormalizedUserName = "TEST@DRIVER.COM",
                        NormalizedEmail = "TEST@DRIVER.COM",
                        EmailConfirmed = true,
                        FullName = "Test Driver",
                        Role = "Driver",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(testUser);
                    await _context.SaveChangesAsync();
                }

                // Use existing or create driver profile
                var driverProfile = await _context.DriverProfiles.FirstOrDefaultAsync(d => d.UserId == testUser.Id);
                if (driverProfile == null)
                {
                    driverProfile = new DriverProfile
                    {
                        UserId = testUser.Id,
                        LicenseNumber = "TEST123",
                        FullName = "Test Driver",
                        PhoneNumber = "1234567890",
                        IsVerified = true
                    };
                    _context.DriverProfiles.Add(driverProfile);
                    await _context.SaveChangesAsync();
                }

                var vehicle = new Vehicle
                {
                    DriverId = driverProfile.DriverId,
                    VehicleNumber = dto.VehicleNumber,
                    VehicleType = dto.VehicleType,
                    Make = dto.Make,
                    Model = dto.Model,
                    Color = dto.Color,
                    SeatCapacity = dto.SeatCapacity,
                    IsActive = true,
                    IsVerified = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Vehicle registered successfully. Awaiting admin verification.",
                    vehicleId = vehicle.VehicleId
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error: {ex.Message}", innerException = ex.InnerException?.Message });
            }
        }

        [HttpGet("my-vehicles")]
        public async Task<IActionResult> GetMyVehicles()
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var vehicles = await _context.Vehicles
                .Where(v => v.DriverId.ToString() == driverId)
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
                    v.VerifiedAt
                })
                .ToListAsync();

            return Ok(vehicles);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleDto dto)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == id && v.DriverId.ToString() == driverId);

            if (vehicle == null)
                return NotFound("Vehicle not found");

            vehicle.VehicleType = dto.VehicleType;
            vehicle.Make = dto.Make;
            vehicle.Model = dto.Model;
            vehicle.Color = dto.Color;
            vehicle.SeatCapacity = dto.SeatCapacity;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == id && v.DriverId.ToString() == driverId);

            if (vehicle == null)
                return NotFound("Vehicle not found");

            // Check if vehicle has active rides
            var hasActiveRides = await _context.Rides
                .AnyAsync(r => r.VehicleId == id && r.RideStatus == "Open");

            if (hasActiveRides)
                return BadRequest("Cannot delete vehicle with active rides");

            vehicle.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle deactivated successfully" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicleById(int id)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == id && v.DriverId.ToString() == driverId);

            if (vehicle == null)
                return NotFound("Vehicle not found");

            return Ok(new
            {
                vehicle.VehicleId,
                vehicle.VehicleNumber,
                vehicle.VehicleType,
                vehicle.Make,
                vehicle.Model,
                vehicle.Color,
                vehicle.SeatCapacity,
                vehicle.IsActive,
                vehicle.IsVerified,
                vehicle.CreatedAt,
                vehicle.VerifiedAt
            });
        }
    }
}