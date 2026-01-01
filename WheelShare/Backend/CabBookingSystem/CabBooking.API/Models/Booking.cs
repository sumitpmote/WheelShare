using System.ComponentModel.DataAnnotations;

namespace CabBooking.API.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        public int RideId { get; set; }
        public Ride Ride { get; set; }

        public string CustomerId { get; set; }
        public ApplicationUser Customer { get; set; }

        public int SeatsBooked { get; set; }
        public decimal TotalFare { get; set; }

        public string BookingStatus { get; set; } // Confirmed, Cancelled
        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
    }
}
