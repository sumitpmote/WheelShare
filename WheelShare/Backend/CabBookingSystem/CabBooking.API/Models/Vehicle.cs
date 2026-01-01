using System.ComponentModel.DataAnnotations;

namespace CabBooking.API.Models
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public DriverProfile? Driver { get; set; }
        public string VehicleNumber { get; set; } = null!;
        public string VehicleType { get; set; } = null!;
        public string Make { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string Color { get; set; } = null!;
        public int SeatCapacity { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? VerifiedAt { get; set; }
        public bool IsVerified { get; set; } = false;
        
        public ICollection<Ride> Rides { get; set; } = new List<Ride>();
    }
}