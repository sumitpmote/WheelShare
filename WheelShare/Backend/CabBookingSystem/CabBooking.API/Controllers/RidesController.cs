using CabBooking.API.Data;
using CabBooking.API.DTOs;
using CabBooking.API.Helpers;
using CabBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CabBooking.API.Models;

namespace CabBooking.API.Controllers
{
    [ApiController]
    [Route("api/rides")]
    [Authorize]
    public class RidesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly GeocodingService _geoService;

        public RidesController(ApplicationDbContext context, GeocodingService geoService)
        {
            _context = context;
            _geoService = geoService;
        }

        [HttpPost("search")]
        // [Authorize(Roles = "Customer")]  // Temporarily disabled for testing
        public async Task<IActionResult> SearchRides([FromBody] SearchRideRequestDto request)
        {
            var (srcLat, srcLon) = await _geoService.GetCoordinates(request.Source);
            var (destLat, destLon) = await _geoService.GetCoordinates(request.Destination);

            var rides = await _context.Rides
                .Include(r => r.Vehicle)
                .ThenInclude(v => v.Driver)
                .Where(r => r.RideStatus == "Open" && r.RideDateTime >= DateTime.UtcNow)
                .ToListAsync();

            var response = new SearchRideResponseDto();

            foreach (var ride in rides)
            {
                var distanceFromSource = DistanceHelper.CalculateDistance(
                    srcLat, srcLon, ride.SourceLatitude, ride.SourceLongitude);

                if (distanceFromSource > 3) continue;

                var result = new RideResultDto
                {
                    RideId = ride.RideId,
                    VehicleType = ride.Vehicle.VehicleType,
                    Source = ride.Source,
                    Destination = ride.Destination,
                    Fare = ride.FarePerSeat,
                    AvailableSeats = ride.AvailableSeats,
                    DistanceInKm = Math.Round(distanceFromSource, 2),
                    RideDateTime = ride.RideDateTime,
                    DriverName = ride.Vehicle.Driver?.FullName ?? "Unknown"
                };

                if (ride.Vehicle.VehicleType == "Cab")
                    response.Cabs.Add(result);
                else if (ride.Vehicle.VehicleType == "Carpool" && ride.AvailableSeats > 0)
                    response.Carpools.Add(result);
            }

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> CreateRide([FromBody] CreateRideDto dto)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.DriverId.ToString() == driverId && v.IsActive);

            if (vehicle == null)
                return BadRequest("No active vehicle found");

            if (!vehicle.IsVerified)
                return BadRequest("Vehicle must be verified by admin before creating rides");

            var (srcLat, srcLon) = await _geoService.GetCoordinates(dto.Source);
            var (destLat, destLon) = await _geoService.GetCoordinates(dto.Destination);

            var ride = new Ride
            {
                VehicleId = vehicle.VehicleId,
                Source = dto.Source,
                Destination = dto.Destination,
                SourceLatitude = srcLat,
                SourceLongitude = srcLon,
                DestinationLatitude = destLat,
                DestinationLongitude = destLon,
                AvailableSeats = dto.AvailableSeats,
                FarePerSeat = dto.FarePerSeat,
                RideDateTime = dto.RideDateTime,
                RideStatus = "Open"
            };

            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ride created successfully", rideId = ride.RideId });
        }

        [HttpGet("my-rides")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMyRides()
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rides = await _context.Rides
                .Include(r => r.Vehicle)
                .Where(r => r.Vehicle.DriverId.ToString() == driverId)
                .OrderByDescending(r => r.RideDateTime)
                .Select(r => new
                {
                    r.RideId,
                    r.Source,
                    r.Destination,
                    r.RideDateTime,
                    r.AvailableSeats,
                    r.FarePerSeat,
                    r.RideStatus,
                    BookingsCount = _context.Bookings.Count(b => b.RideId == r.RideId)
                })
                .ToListAsync();

            return Ok(rides);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> UpdateRideStatus(int id, [FromBody] UpdateRideStatusDto dto)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var ride = await _context.Rides
                .Include(r => r.Vehicle)
                .FirstOrDefaultAsync(r => r.RideId == id && r.Vehicle.DriverId.ToString() == driverId);

            if (ride == null)
                return NotFound("Ride not found");

            ride.RideStatus = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ride status updated successfully" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRideById(int id)
        {
            var ride = await _context.Rides
                .Include(r => r.Vehicle)
                .ThenInclude(v => v.Driver)
                .FirstOrDefaultAsync(r => r.RideId == id);

            if (ride == null)
                return NotFound("Ride not found");

            return Ok(new
            {
                ride.RideId,
                ride.Source,
                ride.Destination,
                ride.RideDateTime,
                ride.AvailableSeats,
                ride.FarePerSeat,
                ride.RideStatus,
                Vehicle = new
                {
                    ride.Vehicle.VehicleNumber,
                    ride.Vehicle.VehicleType,
                    ride.Vehicle.Make,
                    ride.Vehicle.Model,
                    ride.Vehicle.Color
                },
                Driver = new
                {
                    ride.Vehicle.Driver?.FullName,
                    ride.Vehicle.Driver?.PhoneNumber
                }
            });
        }
    }
}