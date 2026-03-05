using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.Models;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/rides")]
    public class RideStatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RideStatusController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET RIDE STATUS
        // =========================
        [HttpGet("{rideId}")]
        [Authorize]
        public async Task<IActionResult> GetRideStatus(int rideId)
        {
            var ride = await _context.Rides
                .Include(r => r.Driver)
                .ThenInclude(d => d.User)
                .Include(r => r.Driver)
                .ThenInclude(d => d.Vehicles.Where(v => v.IsActive))
                .FirstOrDefaultAsync(r => r.RideId == rideId);

            if (ride == null)
                return NotFound("Ride not found");

            // Check payment status
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.RideId == rideId);

            var response = new
            {
                rideId = ride.RideId,
                // provide both keys so frontend components using either name work
                rideStatus = ride.RideStatus,
                status = ride.RideStatus,
                sourceLat = ride.SourceLat,
                sourceLng = ride.SourceLng,
                destinationLat = ride.DestinationLat,
                destinationLng = ride.DestinationLng,
                fare = ride.Fare,
                distanceKm = ride.DistanceKm,
                requestedAt = ride.RequestedAt,
                completedAt = ride.CompletedAt,
                paymentStatus = payment?.PaymentStatus,
                paymentMethod = payment?.PaymentMethod,
                driver = ride.Driver != null ? new
                {
                    name = ride.Driver.User.Name,
                    phone = ride.Driver.User.Phone,
                    licenseNumber = ride.Driver.LicenseNumber
                } : null,
                vehicle = ride.Driver?.Vehicles?.FirstOrDefault(v => v.IsActive) != null ? new
                {
                    vehicleType = ride.Driver.Vehicles.FirstOrDefault(v => v.IsActive).VehicleType,
                    vehicleNumber = ride.Driver.Vehicles.FirstOrDefault(v => v.IsActive).VehicleNumber,
                    seats = ride.Driver.Vehicles.FirstOrDefault(v => v.IsActive).Seats
                } : null
            };

            return Ok(response);
        }
    }
}