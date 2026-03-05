using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class RideRequestDto
    {

        [Required]
        public double SourceLat { get; set; }

        [Required]
        public double SourceLng { get; set; }
        
        public string SourceAddress { get; set; }

        [Required]
        public double DestinationLat { get; set; }

        [Required]
        public double DestinationLng { get; set; }
        
        public string DestinationAddress { get; set; }
        
        public decimal EstimatedFare { get; set; }
    }
}
