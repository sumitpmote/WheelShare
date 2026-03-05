using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("PlatformRevenue")]
    public class PlatformRevenue
    {
        [Key]
        public int RevenueId { get; set; }

        [Required]
        public int RideId { get; set; }

        [Required]
        public decimal TotalFare { get; set; }

        [Required]
        public decimal DriverEarning { get; set; }

        [Required]
        public decimal PlatformEarning { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("RideId")]
        public Ride Ride { get; set; }
    }
}
