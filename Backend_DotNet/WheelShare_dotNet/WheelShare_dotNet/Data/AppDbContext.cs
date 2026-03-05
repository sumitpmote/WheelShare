using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Models;

namespace WheelShare_dotNet.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Ride> Rides { get; set; }

        public DbSet<Payment> Payments { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<EmailOtp> EmailOtps { get; set; }

        public DbSet<SavedPlace> SavedPlaces { get; set; }
        public DbSet<DriverWallet> DriverWallets { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }
        public DbSet<PlatformRevenue> PlatformRevenues { get; set; }
        public DbSet<CarpoolRequest> CarpoolRequests { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> Driver (1-1) CASCADE
            modelBuilder.Entity<Driver>()
                .HasOne(d => d.User)
                .WithOne()
                .HasForeignKey<Driver>(d => d.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // Driver -> Vehicle (1-M) CASCADE
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Driver)
                .WithMany(d => d.Vehicles)
                .HasForeignKey(v => v.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Ride (Customer) NO CASCADE
            modelBuilder.Entity<Ride>()
                .HasOne(r => r.Customer)
                .WithMany()
                .HasForeignKey(r => r.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Driver -> Ride NO CASCADE
            modelBuilder.Entity<Ride>()
                .HasOne(r => r.Driver)
                .WithMany()
                .HasForeignKey(r => r.DriverId)
                .OnDelete(DeleteBehavior.SetNull);

            // Ride -> Payment NO CASCADE
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Ride)
                .WithOne()
                .HasForeignKey<Payment>(p => p.RideId)
                .OnDelete(DeleteBehavior.Restrict);

            // User -> Notification CASCADE
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> SavedPlace CASCADE
            modelBuilder.Entity<SavedPlace>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Driver -> DriverWallet CASCADE
            modelBuilder.Entity<DriverWallet>()
                .HasOne(w => w.Driver)
                .WithMany()
                .HasForeignKey(w => w.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ride -> DriverWallet RESTRICT
            modelBuilder.Entity<DriverWallet>()
                .HasOne(w => w.Ride)
                .WithMany()
                .HasForeignKey(w => w.RideId)
                .OnDelete(DeleteBehavior.Restrict);

            // User -> UserDocument CASCADE
            modelBuilder.Entity<UserDocument>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
