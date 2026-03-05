using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.Models;
using BCrypt.Net;

namespace WheelShare_dotNet.Services
{
    public class AdminSeederService
    {
        private readonly AppDbContext _context;

        public AdminSeederService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAdminUserAsync()
        {
            // Check if admin user already exists
            var existingAdmin = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == "admin@wheelshare.com");

            if (existingAdmin == null)
            {
                var adminUser = new User
                {
                    Name = "Admin",
                    Email = "admin@wheelshare.com",
                    Phone = "9999999999",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "ADMIN",
                    IsActive = true,
                    IsVerified = true,
                    IsBanned = false,
                    CreatedAt = DateTime.UtcNow,
                    IsEmailVerified = true
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();
                
                Console.WriteLine("Admin user created successfully!");
            }
            else
            {
                Console.WriteLine("Admin user already exists.");
            }
        }
    }
}