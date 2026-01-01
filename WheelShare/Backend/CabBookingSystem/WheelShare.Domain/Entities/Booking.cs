using WheelShare.Domain.Models;

namespace WheelShare.Domain.Entities
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int RideId { get; set; }
        public Ride? Ride { get; set; }
        public string CustomerId { get; set; } = null!;
        public ApplicationUser? Customer { get; set; }
        public int SeatsBooked { get; set; }
        public decimal TotalFare { get; set; }
        public string BookingStatus { get; set; } = "Confirmed";
        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
    }
}