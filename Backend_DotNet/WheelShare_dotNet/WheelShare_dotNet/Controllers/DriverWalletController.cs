using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WheelShare_dotNet.Data;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/driver/wallet")]
    [Authorize(Roles = "DRIVER")]
    public class DriverWalletController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriverWalletController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetWalletHistory()
        {
            try
            {
                var driverIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!int.TryParse(driverIdString, out int driverId))
                    return Unauthorized("Invalid user claim");

                var walletHistory = await _context.DriverWallets
                    .Where(w => w.DriverId == driverId)
                    .OrderByDescending(w => w.CreatedAt)
                    .Select(w => new
                    {
                        w.WalletId,
                        w.RideId,
                        w.Amount,
                        w.TransactionType,
                        w.Description,
                        w.CreatedAt
                    })
                    .ToListAsync();

                var totalBalance = await _context.DriverWallets
                    .Where(w => w.DriverId == driverId)
                    .SumAsync(w => w.TransactionType == "CREDIT" ? w.Amount : -w.Amount);

                return Ok(new { walletHistory, totalBalance });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}