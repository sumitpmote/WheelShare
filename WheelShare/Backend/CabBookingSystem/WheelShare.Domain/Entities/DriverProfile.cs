using WheelShare.Domain.Models;

namespace WheelShare.Domain.Entities
{
    public class DriverProfile
    {
        public int DriverId { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser? User { get; set; }
        public string LicenseNumber { get; set; } = null!;
        public DateTime LicenseExpiry { get; set; }
        public bool IsVerified { get; set; } = false;
        public DateTime? VerifiedAt { get; set; }
        public decimal Rating { get; set; } = 0;
        public int TotalRides { get; set; } = 0;
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Rating> ReceivedRatings { get; set; } = new List<Rating>();
    }
}