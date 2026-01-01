using System.Net;
using System.Net.Mail;

namespace CabBooking.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendOtpEmail(string toEmail, string otp)
        {
            var smtpClient = new SmtpClient(_config["Smtp:Host"])
            {
                Port = int.Parse(_config["Smtp:Port"]),
                Credentials = new NetworkCredential(
                    _config["Smtp:Username"],
                    _config["Smtp:Password"]
                ),
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_config["Smtp:From"]),
                Subject = "Your Login OTP",
                Body = $"Your OTP is {otp}. It is valid for 5 minutes.",
                IsBodyHtml = false
            };

            mail.To.Add(toEmail);
            smtpClient.Send(mail);
        }
    }
}
