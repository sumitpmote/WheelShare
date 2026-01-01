namespace WheelShare.Domain.Entities
{
    public class Location
    {
        public int LocationId { get; set; }
        public string Name { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}