using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.DTOs;
using WheelShare_dotNet.Helpers;
using WheelShare_dotNet.Models;
using System.Security.Claims;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/rides")]
    public class RideController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RideController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // CUSTOMER → REQUEST RIDE
        // =========================
        [HttpPost("request")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> RequestRide(
            RideRequestDto dto,
            [FromServices] FareHelper fareHelper
        )
        {
            int customerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            double distanceKm = DistanceHelper.CalculateDistanceKm(
                dto.SourceLat,
                dto.SourceLng,
                dto.DestinationLat,
                dto.DestinationLng
            );

            decimal estimatedFare = fareHelper.CalculateEstimatedFare(distanceKm);

            var ride = new Ride
            {
                CustomerId = customerId,
                SourceLat = dto.SourceLat,
                SourceLng = dto.SourceLng,
                SourceAddress = dto.SourceAddress,
                DestinationLat = dto.DestinationLat,
                DestinationLng = dto.DestinationLng,
                DestinationAddress = dto.DestinationAddress,
                DistanceKm = Math.Round(distanceKm, 2),
                Fare = dto.EstimatedFare > 0 ? dto.EstimatedFare : Math.Round(estimatedFare, 2),
                RideStatus = "REQUESTED",
                RequestedAt = DateTime.UtcNow,
                DriverId = null
            };

            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Ride requested successfully",
                rideId = ride.RideId,
                distanceKm = ride.DistanceKm,
                estimatedFare = ride.Fare
            });
        }

        // =========================
        // DRIVER → GET INCOMING RIDES (POLLING)
        // =========================
        [HttpGet("pending")]
        [Authorize(Roles = "DRIVER")]
        public async Task<IActionResult> GetPendingRides()
        {
            var rides = await _context.Rides
                .Where(r => r.RideStatus == "REQUESTED" && r.DriverId == null)
                .OrderBy(r => r.RequestedAt)
                .ToListAsync();

            return Ok(rides);
        }

        // =========================
        // DRIVER → ACCEPT RIDE
        // =========================
        [HttpPost("{rideId}/accept")]
        [Authorize(Roles = "DRIVER")]
        public async Task<IActionResult> AcceptRide(int rideId)
        {
            int driverId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            var ride = await _context.Rides.FindAsync(rideId);

            if (ride == null)
                return NotFound("Ride not found");

            if (ride.RideStatus != "REQUESTED")
                return BadRequest("Ride already taken");

            ride.DriverId = driverId;
            ride.RideStatus = "ACCEPTED";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Ride accepted successfully" });
        }

        // =========================
        // DRIVER → REJECT RIDE
        // =========================
        [HttpPost("{rideId}/reject")]
        [Authorize(Roles = "DRIVER")]
        public async Task<IActionResult> RejectRide(int rideId)
        {
            var ride = await _context.Rides.FindAsync(rideId);

            if (ride == null)
                return NotFound("Ride not found");

            if (ride.RideStatus != "REQUESTED")
                return BadRequest("Ride cannot be rejected");

            // No DB update needed
            return Ok(new { message = "Ride rejected" });
        }

        // =========================
        // CUSTOMER → ESTIMATE FARE
        // =========================
        [HttpPost("estimate-fare")]
        [Authorize(Roles = "CUSTOMER")]
        public IActionResult EstimateFare(
            EstimateFareDto dto,
            [FromServices] FareHelper fareHelper
        )
        {
            double distanceKm = DistanceHelper.CalculateDistanceKm(
                dto.SourceLat,
                dto.SourceLng,
                dto.DestinationLat,
                dto.DestinationLng
            );

            var estimatedFare = fareHelper.CalculateEstimatedFare(distanceKm);

            return Ok(new
            {
                distanceKm = Math.Round(distanceKm, 2),
                estimatedFare = Math.Round(estimatedFare, 2)
            });
        }

        // =========================
        // CUSTOMER → CANCEL RIDE
        // =========================
        [HttpPost("cancel/{rideId}")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> CancelRide(int rideId)
        {
            int customerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            var ride = await _context.Rides
                .FirstOrDefaultAsync(r => r.RideId == rideId && r.CustomerId == customerId);

            if (ride == null)
                return NotFound("Ride not found");

            if (ride.RideStatus != "REQUESTED")
                return BadRequest("Ride cannot be cancelled");

            ride.RideStatus = "CANCELLED";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ride cancelled successfully" });
        }

        // =========================
        // CUSTOMER → GET RIDE HISTORY
        // =========================
        [HttpGet("history")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> GetRideHistory()
        {
            int customerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            var rides = await _context.Rides
                .Include(r => r.Driver)
                .ThenInclude(d => d.User)
                .Where(r => r.CustomerId == customerId)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            var rideHistory = rides.Select(r => new
            {
                rideId = r.RideId,
                sourceLat = r.SourceLat,
                sourceLng = r.SourceLng,
                sourceAddress = r.SourceAddress,
                destinationLat = r.DestinationLat,
                destinationLng = r.DestinationLng,
                destinationAddress = r.DestinationAddress,
                distanceKm = r.DistanceKm,
                fare = r.Fare,
                finalFare = r.FinalFare,
                rideStatus = r.RideStatus,
                requestedAt = r.RequestedAt,
                completedAt = r.CompletedAt,
                driver = r.Driver != null ? new
                {
                    name = r.Driver.User.Name,
                    phone = r.Driver.User.Phone,
                    licenseNumber = r.Driver.LicenseNumber
                } : null
            });

            return Ok(rideHistory);
        }

        // =========================
        // CUSTOMER → MAKE PAYMENT
        // =========================
        [HttpPost("pay/{rideId}")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> MakePayment(int rideId, [FromBody] PaymentDto dto)
        {
            try
            {
                int customerId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier).Value
                );

                var ride = await _context.Rides
                    .FirstOrDefaultAsync(r => r.RideId == rideId && r.CustomerId == customerId && r.RideStatus == "COMPLETED");

                if (ride == null)
                    return BadRequest("Ride not found or not completed");

                var existingPayment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.RideId == rideId);

                if (existingPayment != null)
                    return BadRequest("Payment already made for this ride");

                var payment = new Payment
                {
                    RideId = rideId,
                    Amount = ride.FinalFare ?? ride.Fare,
                    PaymentMethod = dto.PaymentMethod,
                    PaymentStatus = dto.PaymentMethod == "CASH" ? "AWAITING_CONFIRMATION" : "COMPLETED",
                    CreatedAt = DateTime.UtcNow,
                    TransactionRef = dto.PaymentId ?? (dto.PaymentMethod == "UPI" ? Guid.NewGuid().ToString() : null),
                    DriverConfirmed = dto.PaymentMethod == "CASH" ? false : null
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment processed successfully", paymentId = payment.PaymentId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
}
