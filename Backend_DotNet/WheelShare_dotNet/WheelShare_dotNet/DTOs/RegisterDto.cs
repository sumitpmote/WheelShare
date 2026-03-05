using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.DTOs
{
    public class RegisterDto
    {

        [Required]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Phone { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }
        // CUSTOMER | DRIVER
    }
}
