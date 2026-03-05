using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("CarpoolRequests")]
    public class CarpoolRequest
    {
        [Key]
        public int RequestId { get; set; }

        [Required]
        public int OriginalRideId { get; set; }

        [Required]
        public int RequestingCustomerId { get; set; }

        public double SourceLat { get; set; }
        public double SourceLng { get; set; }
        
        [MaxLength(500)]
        public string SourceAddress { get; set; }

        public double DestinationLat { get; set; }
        public double DestinationLng { get; set; }
        
        [MaxLength(500)]
        public string DestinationAddress { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "PENDING";
        // PENDING | ACCEPTED | REJECTED

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("OriginalRideId")]
        public Ride OriginalRide { get; set; }

        [ForeignKey("RequestingCustomerId")]
        public User RequestingCustomer { get; set; }
    }
}
