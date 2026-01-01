namespace CabBooking.API.DTOs
{
    public class CreateRideDto
    {
        public string Source { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public int AvailableSeats { get; set; }
        public decimal FarePerSeat { get; set; }
        public DateTime RideDateTime { get; set; }
    }
}