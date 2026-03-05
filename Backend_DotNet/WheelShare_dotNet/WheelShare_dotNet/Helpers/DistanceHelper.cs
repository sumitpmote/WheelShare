namespace WheelShare_dotNet.Helpers
{
    public class DistanceHelper
    {
        public static double CalculateDistanceKm(
           double lat1, double lon1,
           double lat2, double lon2)
        {
            const double R = 6371; // Earth radius in KM

            double dLat = DegreesToRadians(lat2 - lat1);
            double dLon = DegreesToRadians(lon2 - lon1);

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) *
                Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }

        private static double DegreesToRadians(double deg)
        {
            return deg * (Math.PI / 180);
        }
    }
}
