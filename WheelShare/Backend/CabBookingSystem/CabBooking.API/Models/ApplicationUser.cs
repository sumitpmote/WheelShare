using Microsoft.AspNetCore.Identity;

namespace CabBooking.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? OtpCode { get; set; }
        public DateTime? OtpExpiry { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}