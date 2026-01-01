namespace WheelShare.Application.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public string Role { get; set; } = null!;
    }
}