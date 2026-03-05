using System.ComponentModel.DataAnnotations;

namespace WheelShare_dotNet.Models
{
    public class UserDocument
    {
        [Key]
        public int DocumentId { get; set; }
        public int UserId { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string S3Key { get; set; } = string.Empty;
        public string VerificationStatus { get; set; } = "PENDING";
        public DateTime UploadedAt { get; set; }
        
        public User User { get; set; } = null!;
    }
}