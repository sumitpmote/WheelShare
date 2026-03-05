namespace WheelShare_dotNet.Helpers
{
    public class OtpHelper
    {
        public static string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
