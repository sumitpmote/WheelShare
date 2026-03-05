namespace WheelShare_dotNet.DTOs
{
    public class SavedPlaceDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string PlaceType { get; set; } = "CUSTOM";
    }
}