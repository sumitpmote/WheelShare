namespace WheelShare.Domain.Entities
{
    public class Ride
    {
        public int RideId { get; set; }
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public string Source { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public double SourceLatitude { get; set; }
        public double SourceLongitude { get; set; }
        public double DestinationLatitude { get; set; }
        public double DestinationLongitude { get; set; }
        public int AvailableSeats { get; set; }
        public decimal FarePerSeat { get; set; }
        public DateTime RideDateTime { get; set; }
        public string RideStatus { get; set; } = "Open";
    }
}