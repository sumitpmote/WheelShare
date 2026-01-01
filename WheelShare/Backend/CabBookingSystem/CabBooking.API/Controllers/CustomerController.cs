using CabBooking.API.Data;
using CabBooking.API.DTOs;
using CabBooking.API.Helpers;
using CabBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CabBooking.API.Controllers
{
    [ApiController]
    [Route("api/customer")]
    //[Authorize(Roles = "Customer")]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly GeocodingService _geoService;

        public CustomerController(
            ApplicationDbContext context,
            GeocodingService geoService)
        {
            _context = context;
            _geoService = geoService;
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchRides(
            [FromBody] SearchRideRequestDto request)
        {
            // 1. Convert source & destination to coordinates
            var (srcLat, srcLon) =
                await _geoService.GetCoordinates(request.Source);

            var (destLat, destLon) =
                await _geoService.GetCoordinates(request.Destination);

            // 2. Fetch active rides
            var rides = await _context.Rides
                .Include(r => r.Vehicle)
                .Where(r => r.RideStatus == "Open")
                .ToListAsync();

            var response = new SearchRideResponseDto();

            foreach (var ride in rides)
            {
                var distanceFromSource =
                    DistanceHelper.CalculateDistance(
                        srcLat, srcLon,
                        ride.SourceLatitude, ride.SourceLongitude);

                // 3 km radius rule
                if (distanceFromSource > 3)
                    continue;

                var result = new RideResultDto
                {
                    RideId = ride.RideId,
                    VehicleType = ride.Vehicle.VehicleType,
                    Source = ride.Source,
                    Destination = ride.Destination,
                    Fare = ride.FarePerSeat,
                    AvailableSeats = ride.AvailableSeats,
                    DistanceInKm = Math.Round(distanceFromSource, 2)
                };

                // 3. Split Cab vs Carpool
                if (ride.Vehicle.VehicleType == "Cab")
                {
                    response.Cabs.Add(result);
                }
                else if (
                    ride.Vehicle.VehicleType == "Carpool" &&
                    ride.AvailableSeats > 0)
                {
                    response.Carpools.Add(result);
                }
            }

            return Ok(response);
        }
    }
}
