using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.Models
{
    public class DriverWallet
    {
        [Key]
        public int WalletId { get; set; }

        public int DriverId { get; set; }

        public int RideId { get; set; }

        public decimal Amount { get; set; }

        public string TransactionType { get; set; } = "CREDIT"; // CREDIT, DEBIT

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Driver Driver { get; set; } = null!;
        public Ride Ride { get; set; } = null!;
    }
}