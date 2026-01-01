namespace WheelShare.Application.DTOs
{
    public class AuthRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}