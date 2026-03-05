using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class ResendOtpDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
