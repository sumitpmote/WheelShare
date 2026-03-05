using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WheelShare_dotNet.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("WheelShare", _config["Email:From"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "WheelShare - Email Verification OTP";

            message.Body = new TextPart("html")
            {
                Text = $"<h2>Your OTP is <b>{otp}</b></h2><p>Valid for 5 minutes.</p>"
            };

            using var client = new SmtpClient();

            await client.ConnectAsync(
                _config["Email:Host"],
                int.Parse(_config["Email:Port"]),
                SecureSocketOptions.StartTls
            );

            await client.AuthenticateAsync(
                _config["Email:Username"],
                _config["Email:Password"]
            );

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
