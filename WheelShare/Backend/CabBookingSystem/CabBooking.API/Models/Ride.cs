using System.ComponentModel.DataAnnotations;

namespace CabBooking.API.Models
{
    public class Ride
    {
        [Key]
        public int RideId { get; set; }

        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }

        public string Source { get; set; }
        public string Destination { get; set; }

        public double SourceLatitude { get; set; }
        public double SourceLongitude { get; set; }

        public double DestinationLatitude { get; set; }
        public double DestinationLongitude { get; set; }

        public int AvailableSeats { get; set; }
        public decimal FarePerSeat { get; set; }

        public DateTime RideDateTime { get; set; }
        public string RideStatus { get; set; } // Open, Completed, Cancelled
    }
}
