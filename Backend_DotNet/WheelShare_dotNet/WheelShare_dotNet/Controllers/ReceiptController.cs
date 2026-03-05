using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WheelShare_dotNet.Data;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/receipt")]
    [Authorize]
    public class ReceiptController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReceiptController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{rideId}")]
        public async Task<IActionResult> GetReceipt(int rideId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userRole = User.FindFirst(ClaimTypes.Role).Value;

            var ride = await _context.Rides
                .Include(r => r.Customer)
                .Include(r => r.Driver)
                .ThenInclude(d => d.User)
                .FirstOrDefaultAsync(r => r.RideId == rideId);

            if (ride == null)
                return NotFound("Ride not found");

            if (userRole == "CUSTOMER" && ride.CustomerId != userId)
                return Forbid();

            if (userRole == "DRIVER" && ride.DriverId != userId)
                return Forbid();

            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.RideId == rideId);

            if (payment == null)
                return NotFound("Payment not found");

            var receipt = new
            {
                receiptId = $"WS{rideId}{payment.PaymentId}",
                rideId = ride.RideId,
                date = payment.CreatedAt,
                customerName = ride.Customer.Name,
                customerPhone = ride.Customer.Phone,
                driverName = ride.Driver?.User?.Name ?? "N/A",
                driverPhone = ride.Driver?.User?.Phone ?? "N/A",
                sourceAddress = ride.SourceAddress,
                destinationAddress = ride.DestinationAddress,
                distanceKm = ride.DistanceKm,
                baseFare = ride.Fare,
                finalFare = ride.FinalFare ?? ride.Fare,
                paymentMethod = payment.PaymentMethod,
                paymentStatus = payment.PaymentStatus,
                transactionRef = payment.TransactionRef,
                completedAt = ride.CompletedAt
            };

            return Ok(receipt);
        }
    }
}
