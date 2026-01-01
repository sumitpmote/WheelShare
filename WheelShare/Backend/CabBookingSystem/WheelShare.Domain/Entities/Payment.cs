namespace WheelShare.Domain.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMode { get; set; } = "Mock"; // UPI, Card
        public string PaymentStatus { get; set; } = "Success"; // Success, Failed
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }
}