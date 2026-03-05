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
    [Route("api/carpool")]
    [Authorize(Roles = "CUSTOMER")]
    public class CarpoolController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly FareHelper _fareHelper;

        public CarpoolController(AppDbContext context, FareHelper fareHelper)
        {
            _context = context;
            _fareHelper = fareHelper;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestCarpoolRide(RideRequestDto dto)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            double distanceKm = DistanceHelper.CalculateDistanceKm(
                dto.SourceLat, dto.SourceLng, dto.DestinationLat, dto.DestinationLng
            );

            decimal estimatedFare = _fareHelper.CalculateEstimatedFare(distanceKm);

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
                Fare = Math.Round(estimatedFare, 2),
                RideStatus = "REQUESTED",
                IsCarpool = true,
                PassengerCount = 1,
                RequestedAt = DateTime.UtcNow
            };

            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Carpool ride requested",
                rideId = ride.RideId,
                distanceKm = ride.DistanceKm,
                estimatedFare = ride.Fare
            });
        }

        [HttpGet("available-rides")]
        public async Task<IActionResult> GetAvailableCarpoolRides(
            [FromQuery] double sourceLat,
            [FromQuery] double sourceLng,
            [FromQuery] double destLat,
            [FromQuery] double destLng
        )
        {
            var activeRides = await _context.Rides
                .Include(r => r.Customer)
                .Where(r => r.IsCarpool && 
                           (r.RideStatus == "REQUESTED" || r.RideStatus == "ACCEPTED" || r.RideStatus == "STARTED") && 
                           r.PassengerCount < 4 &&
                           r.ParentRideId == null)
                .ToListAsync();

            var matchingRides = activeRides
                .Where(r =>
                {
                    double pickupDistance = DistanceHelper.CalculateDistanceKm(
                        sourceLat, sourceLng, r.SourceLat, r.SourceLng
                    );
                    double dropDistance = DistanceHelper.CalculateDistanceKm(
                        destLat, destLng, r.DestinationLat, r.DestinationLng
                    );
                    return pickupDistance <= 2 && dropDistance <= 2;
                })
                .Select(r => new
                {
                    r.RideId,
                    r.SourceAddress,
                    r.DestinationAddress,
                    r.PassengerCount,
                    availableSeats = 4 - r.PassengerCount,
                    customerName = r.Customer.Name,
                    baseFare = r.Fare,
                    estimatedFare = CalculateSharedFare(r.Fare, r.PassengerCount + 1)
                })
                .ToList();

            return Ok(matchingRides);
        }

        [HttpPost("join/{rideId}")]
        public async Task<IActionResult> JoinCarpoolRide(int rideId, RideRequestDto dto)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var parentRide = await _context.Rides.FindAsync(rideId);
            if (parentRide == null || !parentRide.IsCarpool || 
                (parentRide.RideStatus != "REQUESTED" && parentRide.RideStatus != "ACCEPTED" && parentRide.RideStatus != "STARTED"))
                return BadRequest("Ride not available for carpooling");

            if (parentRide.PassengerCount >= 4)
                return BadRequest("Ride is full");

            var existingRequest = await _context.CarpoolRequests
                .FirstOrDefaultAsync(cr => cr.OriginalRideId == rideId && 
                                          cr.RequestingCustomerId == customerId && 
                                          cr.Status == "PENDING");

            if (existingRequest != null)
                return BadRequest("Request already sent");

            var request = new CarpoolRequest
            {
                OriginalRideId = rideId,
                RequestingCustomerId = customerId,
                SourceLat = dto.SourceLat,
                SourceLng = dto.SourceLng,
                SourceAddress = dto.SourceAddress,
                DestinationLat = dto.DestinationLat,
                DestinationLng = dto.DestinationLng,
                DestinationAddress = dto.DestinationAddress,
                Status = "PENDING",
                RequestedAt = DateTime.UtcNow
            };

            _context.CarpoolRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Join request sent", requestId = request.RequestId });
        }

        [HttpGet("pending-requests/{rideId}")]
        public async Task<IActionResult> GetPendingRequests(int rideId)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null || ride.CustomerId != customerId)
                return Forbid();

            var requests = await _context.CarpoolRequests
                .Include(cr => cr.RequestingCustomer)
                .Where(cr => cr.OriginalRideId == rideId && cr.Status == "PENDING")
                .Select(cr => new
                {
                    cr.RequestId,
                    customerName = cr.RequestingCustomer.Name,
                    customerPhone = cr.RequestingCustomer.Phone,
                    cr.SourceAddress,
                    cr.DestinationAddress,
                    cr.RequestedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPost("approve-request/{requestId}")]
        public async Task<IActionResult> ApproveRequest(int requestId)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var request = await _context.CarpoolRequests
                .Include(cr => cr.OriginalRide)
                .FirstOrDefaultAsync(cr => cr.RequestId == requestId);

            if (request == null)
                return NotFound("Request not found");

            if (request.OriginalRide.CustomerId != customerId)
                return Forbid();

            if (request.Status != "PENDING")
                return BadRequest("Request already processed");

            var parentRide = request.OriginalRide;
            if (parentRide.PassengerCount >= 4)
                return BadRequest("Ride is full");

            double distanceKm = DistanceHelper.CalculateDistanceKm(
                request.SourceLat, request.SourceLng, request.DestinationLat, request.DestinationLng
            );

            decimal sharedFare = CalculateSharedFare(parentRide.Fare, parentRide.PassengerCount + 1);

            var joinRide = new Ride
            {
                CustomerId = request.RequestingCustomerId,
                DriverId = parentRide.DriverId,
                SourceLat = request.SourceLat,
                SourceLng = request.SourceLng,
                SourceAddress = request.SourceAddress,
                DestinationLat = request.DestinationLat,
                DestinationLng = request.DestinationLng,
                DestinationAddress = request.DestinationAddress,
                DistanceKm = Math.Round(distanceKm, 2),
                Fare = Math.Round(sharedFare, 2),
                FinalFare = Math.Round(sharedFare, 2),
                RideStatus = parentRide.RideStatus,
                IsCarpool = true,
                PassengerCount = 1,
                ParentRideId = parentRide.RideId,
                RequestedAt = DateTime.UtcNow,
                AcceptedAt = parentRide.AcceptedAt,
                StartedAt = parentRide.StartedAt
            };

            _context.Rides.Add(joinRide);

            parentRide.PassengerCount++;
            decimal originalBaseFare = parentRide.Fare / (1 + (parentRide.PassengerCount - 2) * 0.15m);
            parentRide.Fare = CalculateTotalCarpoolFare(originalBaseFare, parentRide.PassengerCount);
            parentRide.FinalFare = parentRide.Fare;

            // Update all existing child rides with recalculated fare
            var childRides = await _context.Rides
                .Where(r => r.ParentRideId == parentRide.RideId)
                .ToListAsync();
            
            foreach (var child in childRides)
            {
                child.Fare = Math.Round(sharedFare, 2);
                child.FinalFare = Math.Round(sharedFare, 2);
            }

            request.Status = "ACCEPTED";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Request approved", rideId = joinRide.RideId });
        }

        [HttpPost("reject-request/{requestId}")]
        public async Task<IActionResult> RejectRequest(int requestId)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var request = await _context.CarpoolRequests
                .Include(cr => cr.OriginalRide)
                .FirstOrDefaultAsync(cr => cr.RequestId == requestId);

            if (request == null)
                return NotFound("Request not found");

            if (request.OriginalRide.CustomerId != customerId)
                return Forbid();

            request.Status = "REJECTED";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Request rejected" });
        }

        [HttpPost("confirm-seat/{rideId}")]
        public async Task<IActionResult> ConfirmSeat(int rideId)
        {
            int customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null || ride.CustomerId != customerId)
                return BadRequest("Invalid ride");

            if (!ride.IsCarpool || ride.ParentRideId == null)
                return BadRequest("Not a carpool ride");

            return Ok(new { message = "Seat confirmed", rideId = ride.RideId });
        }

        private decimal CalculateSharedFare(decimal baseFare, int totalPassengers)
        {
            if (totalPassengers <= 1) return baseFare;
            decimal increase = (totalPassengers - 1) * 0.15m;
            return baseFare * (1 + increase) / totalPassengers;
        }

        private decimal CalculateTotalCarpoolFare(decimal originalFare, int passengers)
        {
            if (passengers <= 1) return originalFare;
            return originalFare * (1 + (passengers - 1) * 0.15m);
        }
    }
}
