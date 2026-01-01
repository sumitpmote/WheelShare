using WheelShare.Domain.Models;

namespace WheelShare.Domain.Entities
{
    public class Rating
    {
        public int RatingId { get; set; }
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        public int? RideId { get; set; }
        public Ride? Ride { get; set; }
        public string RatedByUserId { get; set; } = null!;
        public ApplicationUser? RatedByUser { get; set; }
        public string RatedToUserId { get; set; } = null!;
        public ApplicationUser? RatedToUser { get; set; }
        public int? DriverId { get; set; }
        public DriverProfile? Driver { get; set; }
        public decimal RatingValue { get; set; } // 1-5 stars
        public string? Comment { get; set; }
        public string RatingType { get; set; } = null!; // "DriverRating", "CustomerRating"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}