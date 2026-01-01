using CabBooking.API.DTOs;

namespace WheelShare.Application.Interfaces
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, string userId);
        Task<BookingDto?> GetByIdAsync(int id);
        Task<IEnumerable<BookingDto>> GetAllAsync();
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId);
        Task CancelBookingAsync(int bookingId, string userId, string reason);
        Task<bool> ConfirmBookingAsync(int bookingId);
    }
}