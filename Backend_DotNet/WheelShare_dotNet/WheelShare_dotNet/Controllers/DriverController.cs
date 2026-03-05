using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.DTOs;
using WheelShare_dotNet.Helpers;
using WheelShare_dotNet.Models;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/driver")]
    [Authorize(Roles = "DRIVER")]
    public class DriverController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly FareHelper _fareHelper;

        public DriverController(AppDbContext context, FareHelper fareHelper)
        {
            _context = context;
            _fareHelper = fareHelper;
        }

        // =========================
        // GO ONLINE
        // =========================
        [HttpPost("go-online")]
        public async Task<IActionResult> GoOnline()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var driver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null)
                    return BadRequest("Driver not found");

                driver.IsAvailable = true;
                await _context.SaveChangesAsync();

                return Ok("Driver is online");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // UPDATE LOCATION
        // =========================
        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateLocation(DriverLocationDto dto)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var driver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null)
                    return BadRequest("Driver not found");

                if (!driver.IsAvailable)
                    return BadRequest("Driver is offline");

                driver.CurrentLatitude = dto.Latitude;
                driver.CurrentLongitude = dto.Longitude;

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // GO OFFLINE
        // =========================
        [HttpPost("go-offline")]
        public async Task<IActionResult> GoOffline()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var driver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null)
                    return BadRequest("Driver not found");

                driver.IsAvailable = false;
                await _context.SaveChangesAsync();

                return Ok("Driver is offline");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // GET NEARBY RIDES
        // =========================
        [HttpGet("nearby-rides")]
        public async Task<IActionResult> GetNearbyRides()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var driver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null || !driver.IsAvailable)
                    return Ok(new List<object>());

                if (driver.CurrentLatitude == 0 || driver.CurrentLongitude == 0)
                    return Ok(new List<object>());

                double maxDistanceKm = 10; 

                var rides = await _context.Rides
                    .Where(r => r.RideStatus == "REQUESTED" && r.DriverId == null)
                    .ToListAsync();

                var nearbyRides = rides
                    .Where(r => DistanceHelper.CalculateDistanceKm(
                        driver.CurrentLatitude,
                        driver.CurrentLongitude,
                        r.SourceLat,
                        r.SourceLng
                    ) <= maxDistanceKm)
                    .Select(r =>
                    {
                        double distanceToPickup = DistanceHelper.CalculateDistanceKm(
                            driver.CurrentLatitude,
                            driver.CurrentLongitude,
                            r.SourceLat,
                            r.SourceLng
                        );

                        // Use the fare allocated to the ride, not recalculate it
                        decimal rideFare = r.Fare;
                        decimal driverEarning = _fareHelper.CalculateDriverEarning(rideFare);

                        return new
                        {
                            r.RideId,
                            pickupAddress = r.SourceAddress,
                            dropAddress = r.DestinationAddress,
                            pickupLat = r.SourceLat,
                            pickupLng = r.SourceLng,
                            dropLat = r.DestinationLat,
                            dropLng = r.DestinationLng,
                            distanceKm = Math.Round(r.DistanceKm, 2),
                            fare = Math.Round(rideFare, 2),
                            driverEarning = Math.Round(driverEarning, 2),
                            distanceToPickup = Math.Round(distanceToPickup, 2)
                        };
                    })
                    .OrderBy(r => r.distanceToPickup)
                    .ToList();

                return Ok(nearbyRides);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // ACCEPT RIDE
        // =========================
        [HttpPost("accept-ride/{rideId}")]
        public async Task<IActionResult> AcceptRide(int rideId)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var ride = await _context.Rides
                    .FirstOrDefaultAsync(r => r.RideId == rideId);

                if (ride == null || ride.RideStatus != "REQUESTED")
                    return BadRequest("Ride not available");

                ride.DriverId = driverId;
                ride.RideStatus = "ACCEPTED";
                ride.AcceptedAt = DateTime.UtcNow;

                var driver = await _context.Drivers
                    .FirstAsync(d => d.DriverId == driverId);

                driver.IsAvailable = false;

                await _context.SaveChangesAsync();
                return Ok("Ride accepted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // START RIDE
        // =========================
        [HttpPost("start-ride/{rideId}")]
        public async Task<IActionResult> StartRide(int rideId)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var ride = await _context.Rides
                    .FirstOrDefaultAsync(r => r.RideId == rideId && r.DriverId == driverId);

                if (ride == null)
                    return BadRequest("Ride not found");

                if (ride.RideStatus != "ACCEPTED")
                    return BadRequest("Ride cannot be started");

                ride.RideStatus = "STARTED";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Ride started successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // COMPLETE RIDE
        // =========================
        [HttpPost("complete-ride/{rideId}")]
        public async Task<IActionResult> CompleteRide(int rideId)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var ride = await _context.Rides
                    .FirstOrDefaultAsync(r => r.RideId == rideId && r.DriverId == driverId);

                if (ride == null)
                    return BadRequest("Ride not found");

                if (ride.RideStatus != "STARTED")
                    return BadRequest("Ride cannot be completed");

                ride.RideStatus = "COMPLETED";
                ride.CompletedAt = DateTime.UtcNow;
                ride.FinalFare = ride.Fare;

                // Complete all joined carpool rides
                if (ride.IsCarpool)
                {
                    var joinedRides = await _context.Rides
                        .Where(r => r.ParentRideId == rideId && r.RideStatus == "STARTED")
                        .ToListAsync();

                    foreach (var jr in joinedRides)
                    {
                        jr.RideStatus = "COMPLETED";
                        jr.CompletedAt = DateTime.UtcNow;
                        jr.FinalFare = jr.Fare;
                    }

                    // Calculate revenue split (80% driver, 20% platform)
                    decimal totalFare = ride.Fare + joinedRides.Sum(jr => jr.Fare);
                    decimal driverEarning = totalFare * 0.80m;
                    decimal platformEarning = totalFare * 0.20m;

                    var revenue = new PlatformRevenue
                    {
                        RideId = rideId,
                        TotalFare = totalFare,
                        DriverEarning = driverEarning,
                        PlatformEarning = platformEarning,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.PlatformRevenues.Add(revenue);
                }

                // Make driver available again
                var driver = await _context.Drivers
                    .FirstAsync(d => d.DriverId == driverId);
                driver.IsAvailable = true;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Ride completed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // GET DRIVER'S ACTIVE RIDES
        // =========================
        [HttpGet("my-rides")]
        public async Task<IActionResult> GetMyRides()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var rides = await _context.Rides
                    .Where(r => r.DriverId == driverId && 
                               (r.RideStatus == "ACCEPTED" || r.RideStatus == "STARTED"))
                    .OrderByDescending(r => r.RequestedAt)
                    .ToListAsync();

                return Ok(rides);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // =========================
        // SAVE/UPDATE DRIVER PROFILE
        // =========================
        [HttpPost("profile")]
        public async Task<IActionResult> SaveProfile([FromBody] DriverProfileDto dto)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                // Check if user exists and is a driver
                var user = await _context.Users.FindAsync(driverId);
                if (user == null || user.Role != "DRIVER")
                    return BadRequest("User is not a driver");

                var driver = await _context.Drivers
                    .Include(d => d.Vehicles)
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null)
                {
                    // Create new driver profile
                    driver = new Models.Driver
                    {
                        DriverId = driverId,
                        LicenseNumber = dto.LicenseNumber,
                        IsVerified = false,
                        IsAvailable = false,
                        CurrentLatitude = 0,
                        CurrentLongitude = 0
                    };
                    _context.Drivers.Add(driver);
                }
                else
                {
                    // Update existing driver
                    driver.LicenseNumber = dto.LicenseNumber;
                }

                // Handle vehicle information if provided
                if (!string.IsNullOrEmpty(dto.VehicleModel) && !string.IsNullOrEmpty(dto.RegistrationNumber))
                {
                    // Deactivate existing vehicles
                    var existingVehicles = await _context.Vehicles.Where(v => v.DriverId == driverId).ToListAsync();
                    foreach (var existingVehicle in existingVehicles)
                    {
                        existingVehicle.IsActive = false;
                    }

                    // Add new vehicle
                    var vehicle = new Vehicle
                    {
                        DriverId = driverId,
                        VehicleType = dto.VehicleModel,
                        VehicleNumber = dto.RegistrationNumber,
                        Seats = 4, // Default seats
                        IsActive = true
                    };
                    _context.Vehicles.Add(vehicle);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Driver profile saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        // =========================
        // GET DRIVER PROFILE
        // =========================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var driver = await _context.Drivers
                    .Include(d => d.User)
                    .Include(d => d.Vehicles.Where(v => v.IsActive))
                    .FirstOrDefaultAsync(d => d.DriverId == driverId);

                if (driver == null)
                    return NotFound("Driver profile not found");

                var activeVehicle = driver.Vehicles.FirstOrDefault(v => v.IsActive);

                var profile = new
                {
                    licenseNumber = driver.LicenseNumber,
                    isVerified = driver.IsVerified,
                    isAvailable = driver.IsAvailable,
                    vehicleModel = activeVehicle?.VehicleType,
                    registrationNumber = activeVehicle?.VehicleNumber,
                    seats = activeVehicle?.Seats
                };

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("ride-history")]
        public async Task<IActionResult> GetRideHistory()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var rides = await _context.Rides
                    .Include(r => r.Customer)
                    .Where(r => r.DriverId == driverId && r.RideStatus == "COMPLETED")
                    .OrderByDescending(r => r.CompletedAt)
                    .ToListAsync();

                var rideHistory = rides.Select(r => new
                {
                    rideId = r.RideId,
                    sourceLat = r.SourceLat,
                    sourceLng = r.SourceLng,
                    destinationLat = r.DestinationLat,
                    destinationLng = r.DestinationLng,
                    sourceAddress = r.SourceAddress,
                    destinationAddress = r.DestinationAddress,
                    distanceKm = r.DistanceKm,
                    fare = r.Fare,
                    finalFare = r.FinalFare,
                    rideStatus = r.RideStatus,
                    customerName = r.Customer?.Name ?? "Unknown",
                    completedAt = r.CompletedAt,
                    driverEarning = _fareHelper.CalculateDriverEarning(r.FinalFare ?? r.Fare)
                }).ToList();

                return Ok(rideHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("confirm-cash-payment/{rideId}")]
        public async Task<IActionResult> ConfirmCashPayment(int rideId)
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var ride = await _context.Rides
                    .FirstOrDefaultAsync(r => r.RideId == rideId && r.DriverId == driverId);

                if (ride == null)
                    return NotFound("Ride not found");

                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.RideId == rideId);

                if (payment == null)
                    return NotFound("Payment not found");

                if (payment.PaymentMethod != "CASH")
                    return BadRequest("Only cash payments require confirmation");

                payment.DriverConfirmed = true;
                payment.PaymentStatus = "COMPLETED";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cash payment confirmed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("pending-cash-confirmations")]
        public async Task<IActionResult> GetPendingCashConfirmations()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(driverIdString) || !int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var pendingPayments = await _context.Payments
                    .Include(p => p.Ride)
                    .ThenInclude(r => r.Customer)
                    .Where(p => p.Ride.DriverId == driverId && 
                                p.PaymentMethod == "CASH" && 
                                p.PaymentStatus == "AWAITING_CONFIRMATION")
                    .Select(p => new
                    {
                        rideId = p.RideId,
                        amount = p.Amount,
                        customerName = p.Ride.Customer.Name,
                        sourceAddress = p.Ride.SourceAddress,
                        destinationAddress = p.Ride.DestinationAddress
                    })
                    .ToListAsync();

                return Ok(pendingPayments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
