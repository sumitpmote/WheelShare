using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WheelShare_dotNet.Data;
using WheelShare_dotNet.DTOs;
using WheelShare_dotNet.Models;

namespace WheelShare_dotNet.Controllers
{
    [ApiController]
    [Route("api/saved-places")]
    [Authorize]
    public class SavedPlacesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedPlacesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/saved-places
        [HttpGet]
        public async Task<IActionResult> GetSavedPlaces()
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                    return Unauthorized("Invalid user claim");

                var savedRides = await _context.SavedPlaces
                    .Where(s => s.UserId == userId)
                    .OrderByDescending(s => s.CreatedAt)
                    .Select(s => new
                    {
                        savedPlaceId = s.SavedPlaceId,
                        rideName = s.RideName,
                        pickupAddress = s.PickupAddress,
                        pickupLatitude = s.PickupLatitude,
                        pickupLongitude = s.PickupLongitude,
                        dropAddress = s.DropAddress,
                        dropLatitude = s.DropLatitude,
                        dropLongitude = s.DropLongitude,
                        s.CreatedAt
                    })
                    .ToListAsync();

                return Ok(savedRides);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/saved-places
        [HttpPost]
        public async Task<IActionResult> AddSavedPlace([FromBody] SavedRideDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest("Request body is empty");

                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                    return Unauthorized("Invalid user claim");

                var savedPlace = new SavedPlace
                {
                    UserId = userId,
                    RideName = dto.RideName,
                    PickupAddress = dto.PickupAddress,
                    PickupLatitude = dto.PickupLatitude,
                    PickupLongitude = dto.PickupLongitude,
                    DropAddress = dto.DropAddress,
                    DropLatitude = dto.DropLatitude,
                    DropLongitude = dto.DropLongitude,
                    CreatedAt = DateTime.UtcNow
                };

                _context.SavedPlaces.Add(savedPlace);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Ride saved successfully", savedPlaceId = savedPlace.SavedPlaceId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/saved-places/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSavedPlace(int id)
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                    return Unauthorized("Invalid user claim");

                var savedPlace = await _context.SavedPlaces
                    .FirstOrDefaultAsync(s => s.SavedPlaceId == id && s.UserId == userId);

                if (savedPlace == null)
                    return NotFound("Saved ride not found");

                _context.SavedPlaces.Remove(savedPlace);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Ride removed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}