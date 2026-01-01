using CabBooking.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CabBooking.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<DriverProfile> DriverProfiles { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Ride> Rides { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Ride>()
                .Property(r => r.FarePerSeat)
                .HasPrecision(10, 2);

            builder.Entity<Booking>()
                .Property(b => b.TotalFare)
                .HasPrecision(10, 2);

            builder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(10, 2);

            builder.Entity<Booking>()
                .HasOne(b => b.Ride)
                .WithMany()
                .HasForeignKey(b => b.RideId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.Customer)
                .WithMany()
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}