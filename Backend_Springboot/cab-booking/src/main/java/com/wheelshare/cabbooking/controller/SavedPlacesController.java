package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.dto.SavedRideDto;
import com.wheelshare.cabbooking.entity.SavedPlace;
import com.wheelshare.cabbooking.security.JwtService;
import com.wheelshare.cabbooking.service.SavedPlacesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved-places")
@RequiredArgsConstructor
public class SavedPlacesController {

    private final SavedPlacesService savedPlacesService;
    private final JwtService jwtService;

    private Integer getUserId(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtService.extractUserId(token);
    }

    @GetMapping
    public ResponseEntity<?> getSavedPlaces(@RequestHeader("Authorization") String token) {
        try {
            Integer userId = getUserId(token);
            List<SavedPlace> places = savedPlacesService.getSavedPlaces(userId);
            
            // Mapping to anonymous object structure similar to .NET
            var result = places.stream().map(s -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("savedPlaceId", s.getSavedPlaceId());
                map.put("rideName", s.getRideName());
                map.put("pickupAddress", s.getPickupAddress());
                map.put("pickupLatitude", s.getPickupLatitude());
                map.put("pickupLongitude", s.getPickupLongitude());
                map.put("dropAddress", s.getDropAddress());
                map.put("dropLatitude", s.getDropLatitude());
                map.put("dropLongitude", s.getDropLongitude());
                map.put("createdAt", s.getCreatedAt());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addSavedPlace(@RequestHeader("Authorization") String token, @RequestBody SavedRideDto dto) {
        try {
            Integer userId = getUserId(token);
            SavedPlace savedPlace = savedPlacesService.addSavedRide(dto, userId);
            
            return ResponseEntity.ok(new Map[]{Map.of(
                "message", "Ride saved successfully",
                "savedPlaceId", savedPlace.getSavedPlaceId()
            )});
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavedPlace(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        try {
            Integer userId = getUserId(token);
            savedPlacesService.deleteSavedPlace(id, userId);
            return ResponseEntity.ok(new Map[]{Map.of("message", "Ride removed successfully")});
        } catch (RuntimeException e) {
             return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}
