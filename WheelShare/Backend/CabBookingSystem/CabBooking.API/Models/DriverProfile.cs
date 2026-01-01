using System.ComponentModel.DataAnnotations;

namespace CabBooking.API.Models
{
    public class DriverProfile
    {
        [Key]
        public int DriverId { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser? User { get; set; }
        public string LicenseNumber { get; set; } = null!;
        public bool IsVerified { get; set; } = false;
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    }
}