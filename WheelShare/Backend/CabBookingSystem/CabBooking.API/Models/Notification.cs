using CabBooking.API.Models;

namespace CabBooking.API.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser? User { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Type { get; set; } = "Info";
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
    }
}