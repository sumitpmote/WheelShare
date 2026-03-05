package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.entity.Ride;
import com.wheelshare.cabbooking.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideStatusController {

    private final RideRepository rideRepository;

    @GetMapping("/{rideId}")
    public ResponseEntity<?> getRideStatus(@PathVariable Integer rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElse(null);

        if (ride == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("rideId", ride.getRideId());
        response.put("rideStatus", ride.getRideStatus());
        response.put("status", ride.getRideStatus()); // Duplicate for frontend compat
        response.put("sourceLat", ride.getSourceLat());
        response.put("sourceLng", ride.getSourceLng());
        response.put("destinationLat", ride.getDestinationLat());
        response.put("destinationLng", ride.getDestinationLng());
        response.put("fare", ride.getFare());
        response.put("distanceKm", ride.getDistanceKm());
        response.put("requestedAt", ride.getRequestedAt());
        response.put("completedAt", ride.getCompletedAt());

        if (ride.getDriver() != null && ride.getDriver().getUser() != null) {
            Map<String, Object> driverInfo = new HashMap<>();
            driverInfo.put("name", ride.getDriver().getUser().getName());
            driverInfo.put("phone", ride.getDriver().getUser().getPhone());
            driverInfo.put("licenseNumber", ride.getDriver().getLicenseNumber());
            response.put("driver", driverInfo);
        } else {
            response.put("driver", null);
        }

        return ResponseEntity.ok(response);
    }
}
