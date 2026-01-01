namespace CabBooking.API.DTOs
{
    public class RideResultDto
    {
        public int RideId { get; set; }
        public string VehicleType { get; set; } = null!;
        public string Source { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public decimal Fare { get; set; }
        public int AvailableSeats { get; set; }
        public double DistanceInKm { get; set; }
        public DateTime RideDateTime { get; set; }
        public string DriverName { get; set; } = null!;
    }
}