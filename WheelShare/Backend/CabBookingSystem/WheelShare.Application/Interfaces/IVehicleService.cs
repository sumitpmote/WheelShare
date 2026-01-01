using CabBooking.API.DTOs;

namespace WheelShare.Application.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllAsync();
        Task<VehicleDto?> GetByIdAsync(int id);
        Task<VehicleDto> CreateAsync(VehicleDto dto);
        Task UpdateAsync(int id, VehicleDto dto);
        Task DeleteAsync(int id);
    }
}