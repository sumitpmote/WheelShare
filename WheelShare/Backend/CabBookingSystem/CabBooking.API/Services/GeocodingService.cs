//using System.Net.Http;
//using System.Text.Json;
//using System.Threading.Tasks;

//namespace CabBooking.API.Services
//{
//    public class GeocodingService
//    {
//        private readonly HttpClient _httpClient;

//        public GeocodingService(HttpClient httpClient)
//        {
//            _httpClient = httpClient;
//        }

//        public async Task<(double lat, double lon)> GetCoordinates(string address)
//        {
//            var url =
//                $"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1";

//            var response = await _httpClient.GetStringAsync(url);
//            var json = JsonDocument.Parse(response);

//            var element = json.RootElement[0];

//            var lat = double.Parse(element.GetProperty("lat").GetString());
//            var lon = double.Parse(element.GetProperty("lon").GetString());

//            return (lat, lon);
//        }
//    }
//}

using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace CabBooking.API.Services
{
    public class GeocodingService
    {
        private readonly HttpClient _httpClient;

        public GeocodingService(HttpClient httpClient)
        {
            _httpClient = httpClient;

            // REQUIRED by OpenStreetMap Nominatim
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
                "CabBookingApp/1.0 (cdac-project)"
            );
        }

        public async Task<(double lat, double lon)> GetCoordinates(string address)
        {
            var url =
                $"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1";

            var response = await _httpClient.GetAsync(url);

            // This prevents silent failures
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(jsonString);

            if (json.RootElement.GetArrayLength() == 0)
                throw new Exception("Address not found");

            var element = json.RootElement[0];

            var lat = double.Parse(element.GetProperty("lat").GetString());
            var lon = double.Parse(element.GetProperty("lon").GetString());

            return (lat, lon);
        }
    }
}
