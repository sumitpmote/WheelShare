namespace CabBooking.API.DTOs
{
    public class RideDto
    {
        public int RideId { get; set; }
        public int VehicleId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public int AvailableSeats { get; set; }
        public decimal FarePerSeat { get; set; }
        public DateTime RideDateTime { get; set; }
        public string RideStatus { get; set; }
    }
}