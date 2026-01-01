using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WheelShare.Domain.Entities;
using WheelShare.Domain.Models;

namespace WheelShare.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<DriverProfile> DriverProfiles { get; set; }
        public DbSet<CustomerProfile> CustomerProfiles { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Ride> Rides { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure decimal precision
            builder.Entity<Ride>()
                .Property(r => r.FarePerSeat)
                .HasPrecision(10, 2);

            builder.Entity<Booking>()
                .Property(b => b.TotalFare)
                .HasPrecision(10, 2);

            builder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(10, 2);
        }
    }
}