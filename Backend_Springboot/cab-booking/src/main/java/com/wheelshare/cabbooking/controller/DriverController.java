package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.dto.DriverLocationDto;
import com.wheelshare.cabbooking.entity.Ride;
import com.wheelshare.cabbooking.security.JwtService;
import com.wheelshare.cabbooking.service.DriverService;
import com.wheelshare.cabbooking.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
// @PreAuthorize("hasRole('DRIVER')") // SecurityConfig handles this via requestMatchers or we can use annotation
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;
    private final RideService rideService; // Needed for accepting/starting rides if logic resides there
    private final JwtService jwtService;

    // Helper to get Driver ID (which is User ID)
    private Integer getDriverId(String token) {
        // Remove "Bearer " prefix
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtService.extractUserId(token);
    }

    @PostMapping("/go-online")
    public ResponseEntity<?> goOnline(@RequestHeader("Authorization") String token) {
        try {
            Integer driverId = getDriverId(token);
            String result = driverService.goOnline(driverId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/update-location")
    public ResponseEntity<?> updateLocation(@RequestHeader("Authorization") String token, @RequestBody DriverLocationDto dto) {
        try {
            Integer driverId = getDriverId(token);
            driverService.updateLocation(driverId, dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/go-offline")
    public ResponseEntity<?> goOffline(@RequestHeader("Authorization") String token) {
        try {
             Integer driverId = getDriverId(token);
             String result = driverService.goOffline(driverId);
             return ResponseEntity.ok(result);
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/nearby-rides")
    public ResponseEntity<?> getNearbyRides(@RequestHeader("Authorization") String token) {
        try {
             Integer driverId = getDriverId(token);
             List<Map<String, Object>> result = driverService.getNearbyRides(driverId);
             return ResponseEntity.ok(result);
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/accept-ride/{rideId}")
    public ResponseEntity<?> acceptRide(@RequestHeader("Authorization") String token, @PathVariable Integer rideId) {
        try {
             Integer driverId = getDriverId(token);
             // Logic exists in RideService for accept
             String result = rideService.acceptRide(rideId, driverId);
             return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/start-ride/{rideId}")
    public ResponseEntity<?> startRide(@RequestHeader("Authorization") String token, @PathVariable Integer rideId) {
        try {
             Integer driverId = getDriverId(token);
             String result = rideService.startRide(rideId, driverId);
             return ResponseEntity.ok(new Map[]{Map.of("message", result)}); // .NET returns JSON object
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/complete-ride/{rideId}")
    public ResponseEntity<?> completeRide(@RequestHeader("Authorization") String token, @PathVariable Integer rideId) {
        try {
             Integer driverId = getDriverId(token);
             String result = rideService.completeRide(rideId, driverId);
             return ResponseEntity.ok(new Map[]{Map.of("message", result)});
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/my-rides")
    public ResponseEntity<?> getMyRides(@RequestHeader("Authorization") String token) {
        try {
             Integer driverId = getDriverId(token);
             List<Ride> result = driverService.getMyRides(driverId);
             return ResponseEntity.ok(result);
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/ride-history")
    public ResponseEntity<?> getRideHistory(@RequestHeader("Authorization") String token) {
        try {
             Integer driverId = getDriverId(token);
             List<Map<String, Object>> result = driverService.getRideHistory(driverId);
             return ResponseEntity.ok(result);
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}
