using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class VerifyOtpDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Otp { get; set; }
    }
}
