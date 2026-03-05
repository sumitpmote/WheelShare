using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.Models
{
    public class SavedPlace
    {
        [Key]
        public int SavedPlaceId { get; set; }

        public int UserId { get; set; }

        public string RideName { get; set; } = string.Empty;

        // Pickup Location
        public string PickupAddress { get; set; } = string.Empty;
        public double PickupLatitude { get; set; }
        public double PickupLongitude { get; set; }

        // Drop Location
        public string DropAddress { get; set; } = string.Empty;
        public double DropLatitude { get; set; }
        public double DropLongitude { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation property
        public User User { get; set; } = null!;
    }
}