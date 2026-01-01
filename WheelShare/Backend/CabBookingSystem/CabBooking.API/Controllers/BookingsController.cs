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
    [Route("api/bookings")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var ride = await _context.Rides
                .FirstOrDefaultAsync(r => r.RideId == dto.RideId && r.RideStatus == "Open");

            if (ride == null)
                return BadRequest("Ride not available");

            if (ride.AvailableSeats < dto.SeatsBooked)
                return BadRequest("Not enough seats available");

            var booking = new Booking
            {
                RideId = dto.RideId,
                CustomerId = customerId,
                SeatsBooked = dto.SeatsBooked,
                TotalFare = dto.SeatsBooked * ride.FarePerSeat,
                BookingStatus = "Confirmed",
                BookedAt = DateTime.UtcNow
            };

            ride.AvailableSeats -= dto.SeatsBooked;

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Booking confirmed successfully", 
                bookingId = booking.BookingId,
                totalFare = booking.TotalFare
            });
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyBookings()
        {
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var bookings = await _context.Bookings
                .Include(b => b.Ride)
                .ThenInclude(r => r.Vehicle)
                .ThenInclude(v => v.Driver)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.BookedAt)
                .Select(b => new
                {
                    b.BookingId,
                    b.SeatsBooked,
                    b.TotalFare,
                    b.BookingStatus,
                    b.BookedAt,
                    Ride = new
                    {
                        b.Ride.Source,
                        b.Ride.Destination,
                        b.Ride.RideDateTime,
                        b.Ride.RideStatus,
                        Vehicle = new
                        {
                            b.Ride.Vehicle.VehicleNumber,
                            b.Ride.Vehicle.VehicleType,
                            b.Ride.Vehicle.Make,
                            b.Ride.Vehicle.Model
                        },
                        Driver = new
                        {
                            b.Ride.Vehicle.Driver.FullName,
                            b.Ride.Vehicle.Driver.PhoneNumber
                        }
                    }
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("ride/{rideId}")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetRideBookings(int rideId)
        {
            var driverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var ride = await _context.Rides
                .Include(r => r.Vehicle)
                .FirstOrDefaultAsync(r => r.RideId == rideId && r.Vehicle.DriverId.ToString() == driverId);

            if (ride == null)
                return NotFound("Ride not found");

            var bookings = await _context.Bookings
                .Include(b => b.Customer)
                .Where(b => b.RideId == rideId)
                .Select(b => new
                {
                    b.BookingId,
                    b.SeatsBooked,
                    b.TotalFare,
                    b.BookingStatus,
                    b.BookedAt,
                    Customer = new
                    {
                        b.Customer.FullName,
                        b.Customer.PhoneNumber,
                        b.Customer.Email
                    }
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CancelBooking(int id, [FromBody] CancelBookingDto dto)
        {
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var booking = await _context.Bookings
                .Include(b => b.Ride)
                .FirstOrDefaultAsync(b => b.BookingId == id && b.CustomerId == customerId);

            if (booking == null)
                return NotFound("Booking not found");

            if (booking.BookingStatus == "Cancelled")
                return BadRequest("Booking already cancelled");

            booking.BookingStatus = "Cancelled";
            booking.Ride.AvailableSeats += booking.SeatsBooked;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var booking = await _context.Bookings
                .Include(b => b.Ride)
                .ThenInclude(r => r.Vehicle)
                .ThenInclude(v => v.Driver)
                .Include(b => b.Customer)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
                return NotFound("Booking not found");

            // Check authorization
            if (userRole == "Customer" && booking.CustomerId != userId)
                return Forbid();
            
            if (userRole == "Driver" && booking.Ride.Vehicle.DriverId.ToString() != userId)
                return Forbid();

            return Ok(new
            {
                booking.BookingId,
                booking.SeatsBooked,
                booking.TotalFare,
                booking.BookingStatus,
                booking.BookedAt,
                Ride = new
                {
                    booking.Ride.Source,
                    booking.Ride.Destination,
                    booking.Ride.RideDateTime,
                    booking.Ride.RideStatus
                },
                Customer = new
                {
                    booking.Customer.FullName,
                    booking.Customer.PhoneNumber
                },
                Vehicle = new
                {
                    booking.Ride.Vehicle.VehicleNumber,
                    booking.Ride.Vehicle.VehicleType,
                    booking.Ride.Vehicle.Make,
                    booking.Ride.Vehicle.Model
                }
            });
        }
    }
}