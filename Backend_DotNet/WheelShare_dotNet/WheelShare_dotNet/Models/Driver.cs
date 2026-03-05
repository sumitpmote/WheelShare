using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("Drivers")]
    public class Driver
    {

        [Key, ForeignKey("User")]
        public int DriverId { get; set; }

        [Required, MaxLength(50)]
        public string LicenseNumber { get; set; }

        public bool IsVerified { get; set; } = false;
        public bool IsAvailable { get; set; } = false;

        public double CurrentLatitude { get; set; }
        public double CurrentLongitude { get; set; }

        public User User { get; set; }

        public ICollection<Vehicle> Vehicles { get; set; }
    }
}

