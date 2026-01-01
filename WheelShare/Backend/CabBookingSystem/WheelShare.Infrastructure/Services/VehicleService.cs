using Microsoft.EntityFrameworkCore;
using WheelShare.Application.Interfaces;
using CabBooking.API.DTOs;
using WheelShare.Infrastructure.Data;

namespace WheelShare.Infrastructure.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly ApplicationDbContext _context;

        public VehicleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<VehicleDto> CreateAsync(VehicleDto dto)
        {
            var vehicle = new CabBooking.API.Models.Vehicle
            {
                DriverId = dto.DriverId,
                VehicleNumber = dto.VehicleNumber,
                VehicleType = dto.VehicleType,
                SeatCapacity = dto.SeatCapacity,
                IsActive = dto.IsActive
            };
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            dto.VehicleId = vehicle.VehicleId;
            return dto;
        }

        public async Task DeleteAsync(int id)
        {
            var v = await _context.Vehicles.FindAsync(id);
            if (v == null) return;
            _context.Vehicles.Remove(v);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<VehicleDto>> GetAllAsync()
        {
            return await _context.Vehicles
                .Select(v => new VehicleDto
                {
                    VehicleId = v.VehicleId,
                    DriverId = v.DriverId,
                    VehicleNumber = v.VehicleNumber,
                    VehicleType = v.VehicleType,
                    SeatCapacity = v.SeatCapacity,
                    IsActive = v.IsActive
                }).ToListAsync();
        }

        public async Task<VehicleDto?> GetByIdAsync(int id)
        {
            var v = await _context.Vehicles.FindAsync(id);
            if (v == null) return null;
            return new VehicleDto
            {
                VehicleId = v.VehicleId,
                DriverId = v.DriverId,
                VehicleNumber = v.VehicleNumber,
                VehicleType = v.VehicleType,
                SeatCapacity = v.SeatCapacity,
                IsActive = v.IsActive
            };
        }

        public async Task UpdateAsync(int id, VehicleDto dto)
        {
            var v = await _context.Vehicles.FindAsync(id);
            if (v == null) return;
            v.VehicleNumber = dto.VehicleNumber;
            v.VehicleType = dto.VehicleType;
            v.SeatCapacity = dto.SeatCapacity;
            v.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
        }
    }
}