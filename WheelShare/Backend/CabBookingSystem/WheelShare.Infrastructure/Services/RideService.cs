using Microsoft.EntityFrameworkCore;
using WheelShare.Application.Interfaces;
using CabBooking.API.DTOs;
using WheelShare.Infrastructure.Data;

namespace WheelShare.Infrastructure.Services
{
    public class RideService : IRideService
    {
        private readonly ApplicationDbContext _context;

        public RideService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAsync(CreateRideDto dto)
        {
            var ride = new CabBooking.API.Models.Ride
            {
                VehicleId = dto.VehicleId,
                Source = dto.Source,
                Destination = dto.Destination,
                SourceLatitude = dto.SourceLatitude,
                SourceLongitude = dto.SourceLongitude,
                DestinationLatitude = dto.DestinationLatitude,
                DestinationLongitude = dto.DestinationLongitude,
                AvailableSeats = dto.AvailableSeats,
                FarePerSeat = dto.FarePerSeat,
                RideDateTime = dto.RideDateTime,
                RideStatus = "Open"
            };
            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();
            return ride.RideId;
        }

        public async Task CloseRideAsync(int id)
        {
            var r = await _context.Rides.FindAsync(id);
            if (r == null) return;
            r.RideStatus = "Completed";
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RideDto>> GetOpenRidesAsync()
        {
            return await _context.Rides
                .Where(r => r.RideStatus == "Open")
                .Select(r => new RideDto
                {
                    RideId = r.RideId,
                    VehicleId = r.VehicleId,
                    Source = r.Source,
                    Destination = r.Destination,
                    AvailableSeats = r.AvailableSeats,
                    FarePerSeat = r.FarePerSeat,
                    RideDateTime = r.RideDateTime,
                    RideStatus = r.RideStatus
                }).ToListAsync();
        }

        public async Task<RideDto?> GetByIdAsync(int id)
        {
            var r = await _context.Rides.FindAsync(id);
            if (r == null) return null;
            return new RideDto
            {
                RideId = r.RideId,
                VehicleId = r.VehicleId,
                Source = r.Source,
                Destination = r.Destination,
                AvailableSeats = r.AvailableSeats,
                FarePerSeat = r.FarePerSeat,
                RideDateTime = r.RideDateTime,
                RideStatus = r.RideStatus
            };
        }
    }
}