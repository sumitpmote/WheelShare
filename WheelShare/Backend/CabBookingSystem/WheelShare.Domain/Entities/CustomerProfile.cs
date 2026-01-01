using WheelShare.Domain.Models;

namespace WheelShare.Domain.Entities
{
    public class CustomerProfile
    {
        public int CustomerProfileId { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser? User { get; set; }
        public string Preferences { get; set; } = string.Empty;
        public decimal Rating { get; set; } = 0;
        public int TotalRides { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Rating> GivenRatings { get; set; } = new List<Rating>();
    }
}