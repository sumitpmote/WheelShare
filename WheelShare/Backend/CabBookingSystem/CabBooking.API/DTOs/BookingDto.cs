namespace CabBooking.API.DTOs
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public int RideId { get; set; }
        public string CustomerId { get; set; }
        public int SeatsBooked { get; set; }
        public decimal TotalFare { get; set; }
        public string BookingStatus { get; set; }
    }
}