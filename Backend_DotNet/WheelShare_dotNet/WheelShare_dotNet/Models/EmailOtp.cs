using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelShare_dotNet.Models
{
    [Table("EmailOtps")]
    public class EmailOtp
    {

        [Key]
        public int OtpId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string OtpCode { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
