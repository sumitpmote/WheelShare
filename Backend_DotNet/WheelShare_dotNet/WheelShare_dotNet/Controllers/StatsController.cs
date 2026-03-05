using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelShare_dotNet.Data;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/stats")]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicStats()
        {
            var totalUsers = await _context.Users.CountAsync(u => u.IsEmailVerified);
            var totalDrivers = await _context.Drivers.CountAsync();
            var totalRides = await _context.Rides.CountAsync(r => r.RideStatus == "COMPLETED");
            var avgRating = 4.8; // Placeholder - implement rating system later

            return Ok(new
            {
                totalUsers,
                totalDrivers,
                totalRides,
                avgRating
            });
        }
    }
}