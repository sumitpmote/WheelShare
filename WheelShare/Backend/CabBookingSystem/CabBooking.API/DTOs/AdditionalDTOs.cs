namespace CabBooking.API.DTOs
{
    public class UpdateRideStatusDto
    {
        public string Status { get; set; } = null!;
    }

    public class CancelBookingDto
    {
        public string Reason { get; set; } = null!;
    }

    public class CreateVehicleDto
    {
        public string VehicleNumber { get; set; } = null!;
        public string VehicleType { get; set; } = null!;
        public string Make { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string Color { get; set; } = null!;
        public int SeatCapacity { get; set; }
    }

    public class UpdateVehicleDto
    {
        public string VehicleType { get; set; } = null!;
        public string Make { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string Color { get; set; } = null!;
        public int SeatCapacity { get; set; }
    }
}