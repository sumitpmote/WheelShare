using Microsoft.EntityFrameworkCore;
using WheelShare.Application.Interfaces;
using CabBooking.API.DTOs;
using WheelShare.Infrastructure.Data;
using WheelShare.Domain.Entities;

namespace WheelShare.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, string userId)
        {
            var ride = await _context.Rides.FindAsync(dto.RideId);
            if (ride == null) throw new ArgumentException("Ride not found");
            if (ride.RideStatus != "Open") throw new InvalidOperationException("Ride not open");
            if (dto.Seats <= 0) throw new ArgumentException("Invalid seats");
            if (ride.AvailableSeats < dto.Seats) throw new InvalidOperationException("Not enough seats");

            using var trx = await _context.Database.BeginTransactionAsync();
            try
            {
                ride.AvailableSeats -= dto.Seats;
                var booking = new Booking
                {
                    RideId = dto.RideId,
                    CustomerId = userId,
                    SeatsBooked = dto.Seats,
                    TotalFare = ride.FarePerSeat * dto.Seats,
                    BookingStatus = "Confirmed"
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                await trx.CommitAsync();

                return MapToDto(booking);
            }
            catch
            {
                await trx.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<BookingDto>> GetAllAsync()
        {
            return await _context.Bookings
                .Include(b => b.Ride)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<BookingDto?> GetByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Ride)
                .FirstOrDefaultAsync(b => b.BookingId == id);
            return booking == null ? null : MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId)
        {
            return await _context.Bookings
                .Include(b => b.Ride)
                .Where(b => b.CustomerId == userId)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task CancelBookingAsync(int bookingId, string userId, string reason)
        {
            var booking = await _context.Bookings
                .Include(b => b.Ride)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId && b.CustomerId == userId);
                
            if (booking == null) throw new ArgumentException("Booking not found");
            if (booking.BookingStatus == "Cancelled") throw new InvalidOperationException("Already cancelled");
            
            booking.BookingStatus = "Cancelled";
            
            if (booking.Ride != null)
            {
                booking.Ride.AvailableSeats += booking.SeatsBooked;
            }
            
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ConfirmBookingAsync(int bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;
            
            booking.BookingStatus = "Confirmed";
            await _context.SaveChangesAsync();
            return true;
        }

        private static BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                BookingId = booking.BookingId,
                RideId = booking.RideId,
                CustomerId = booking.CustomerId,
                SeatsBooked = booking.SeatsBooked,
                TotalFare = booking.TotalFare,
                BookingStatus = booking.BookingStatus
            };
        }
    }
}