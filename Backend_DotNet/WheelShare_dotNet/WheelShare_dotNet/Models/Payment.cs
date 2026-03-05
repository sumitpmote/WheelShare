using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("Payments")]
    public class Payment
    {

        [Key]
        public int PaymentId { get; set; }

        [Required]
        public int RideId { get; set; }

        [ForeignKey(nameof(RideId))]
        public Ride Ride { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string PaymentMethod { get; set; }
        // CASH | UPI | CARD | WALLET

        [Required]
        public string PaymentStatus { get; set; }
        // PENDING | SUCCESS | FAILED | AWAITING_CONFIRMATION

        public string? TransactionRef { get; set; }

        public bool? DriverConfirmed { get; set; } = null;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;











        //[Key]
        //public int PaymentId { get; set; }

        //[Required]
        //public int RideId { get; set; }

        //public decimal Amount { get; set; }

        //[Required, MaxLength(20)]
        //public string PaymentMethod { get; set; }
        //// UPI | CARD | CASH

        //[Required, MaxLength(20)]
        //public string PaymentStatus { get; set; }
        //// Pending | Paid | Failed

        //public DateTime? PaidAt { get; set; }

        //[ForeignKey("RideId")]
        //public Ride Ride { get; set; }
    }
}
