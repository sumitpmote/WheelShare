namespace WheelShare_dotNet.DTOs
{
    public class SavedRideDto
    {
        public string RideName { get; set; } = string.Empty;
        public string PickupAddress { get; set; } = string.Empty;
        public double PickupLatitude { get; set; }
        public double PickupLongitude { get; set; }
        public string DropAddress { get; set; } = string.Empty;
        public double DropLatitude { get; set; }
        public double DropLongitude { get; set; }
    }
}
