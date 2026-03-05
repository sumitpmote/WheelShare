package com.wheelshare.cabbooking.service;

import com.wheelshare.cabbooking.dto.SavedPlaceDto;
import com.wheelshare.cabbooking.entity.SavedPlace;
import com.wheelshare.cabbooking.repository.SavedPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPlacesService {

    private final SavedPlaceRepository savedPlaceRepository;

    public List<SavedPlace> getSavedPlaces(Integer userId) {
        // Assuming findByUserId exists, relying on JpaRepository default or defined
        return savedPlaceRepository.findByUserId(userId);
    }

    public SavedPlace addSavedPlace(SavedPlaceDto dto, Integer userId) {
        SavedPlace savedPlace = new SavedPlace();
        savedPlace.setUserId(userId);
        savedPlace.setRideName(dto.getName());
        savedPlace.setPickupAddress(dto.getAddress());
        savedPlace.setPickupLatitude(dto.getLatitude()); // Mapping slightly different?
        // Wait, DTO has Name, Address, Lat, Lng. 
        // Entity has Pickup/Drop Address/Lat/Lng.
        // .NET DTO usage in Controller:
        // RideName = dto.RideName, PickupAddress = dto.PickupAddress ...
        // BUT SavedPlacesController uses SavedRideDto NOT SavedPlaceDto for POST?
        // Let's check SavedPlacesController again.
        
        // Controller: public async Task<IActionResult> AddSavedPlace([FromBody] SavedRideDto dto)
        // SavedRideDto has Pickup/Drop properties.
        // SavedPlaceDto has Name, Address, Latitude... for a generic place?
        
        // I created SavedPlaceDto AND SavedRideDto in Phase 1.
        // SavedPlacesController uses SavedRideDto for ADD.
        // It returns a list of SavedPlace objects.
        
        // So I should use SavedRideDto for adding.
        
        // Re-implementing with SavedRideDto input.
        return null; 
    }
    
    // Correcting method signature below
    public SavedPlace addSavedRide(com.wheelshare.cabbooking.dto.SavedRideDto dto, Integer userId) {
        SavedPlace savedPlace = new SavedPlace();
        savedPlace.setUserId(userId);
        savedPlace.setRideName(dto.getRideName());
        savedPlace.setPickupAddress(dto.getPickupAddress());
        savedPlace.setPickupLatitude(dto.getPickupLatitude());
        savedPlace.setPickupLongitude(dto.getPickupLongitude());
        savedPlace.setDropAddress(dto.getDropAddress());
        savedPlace.setDropLatitude(dto.getDropLatitude());
        savedPlace.setDropLongitude(dto.getDropLongitude());
        savedPlace.setCreatedAt(LocalDateTime.now());

        return savedPlaceRepository.save(savedPlace);
    }

    public void deleteSavedPlace(Integer id, Integer userId) {
        SavedPlace place = savedPlaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Saved place not found"));
        
        if (!place.getUserId().equals(userId)) {
             throw new RuntimeException("Unauthorized");
        }

        savedPlaceRepository.delete(place);
    }
}
