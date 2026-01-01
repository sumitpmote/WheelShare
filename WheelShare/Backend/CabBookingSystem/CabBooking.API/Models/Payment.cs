using System.ComponentModel.DataAnnotations;

namespace CabBooking.API.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        public int BookingId { get; set; }
        public Booking Booking { get; set; }

        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } // UPI, Card (Mock)
        public string PaymentStatus { get; set; } // Success, Failed

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }
}
