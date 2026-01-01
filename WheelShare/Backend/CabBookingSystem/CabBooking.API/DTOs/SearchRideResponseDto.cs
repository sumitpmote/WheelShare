using System.Collections.Generic;

namespace CabBooking.API.DTOs
{
    public class SearchRideResponseDto
    {
        public List<RideResultDto> Cabs { get; set; } = new();
        public List<RideResultDto> Carpools { get; set; } = new();
    }
}
