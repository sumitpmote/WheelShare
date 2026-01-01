using CabBooking.API.DTOs;

namespace WheelShare.Application.Interfaces
{
    public interface IRideService
    {
        Task<IEnumerable<RideDto>> GetOpenRidesAsync();
        Task<RideDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateRideDto dto);
        Task UpdateAsync(int id, CreateRideDto dto);
        Task CloseRideAsync(int id);
    }
}