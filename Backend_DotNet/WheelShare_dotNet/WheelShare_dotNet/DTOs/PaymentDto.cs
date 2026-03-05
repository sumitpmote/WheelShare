namespace WheelShare_dotNet.DTOs
{
    public class PaymentDto
    {
        public string PaymentMethod { get; set; } = string.Empty;
        public string? PaymentId { get; set; }
    }
}