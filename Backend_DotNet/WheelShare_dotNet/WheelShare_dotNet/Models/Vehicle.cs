using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("Vehicles")]
    public class Vehicle
    {

        [Key]
        public int VehicleId { get; set; }

        [Required]
        public int DriverId { get; set; }

        [Required, MaxLength(20)]
        public string VehicleType { get; set; }
        // Mini | Sedan | SUV

        [Required, MaxLength(20)]
        public string VehicleNumber { get; set; }

        public int Seats { get; set; }

        public bool IsActive { get; set; } = true;

        [ForeignKey("DriverId")]
        public Driver Driver { get; set; }
    }
}

