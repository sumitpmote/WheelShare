using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class DriverLocationDto
    {
        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }
    }
}
