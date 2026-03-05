using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class DriverProfileDto
    {
        [Required]
        public string LicenseNumber { get; set; }

        public string? VehicleModel { get; set; }

        public string? RegistrationNumber { get; set; }
    }
}