package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.dto.EstimateFareDto;
import com.wheelshare.cabbooking.dto.PaymentDto;
import com.wheelshare.cabbooking.dto.RideRequestDto;
import com.wheelshare.cabbooking.security.JwtService;
import com.wheelshare.cabbooking.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
// @PreAuthorize("hasRole('CUSTOMER')") // Or handle in method
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;
    private final JwtService jwtService;

    private Integer getUserId(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtService.extractUserId(token);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRides() {
        return ResponseEntity.ok(rideService.getPendingRides());
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestRide(@RequestHeader("Authorization") String token, @RequestBody RideRequestDto dto) {
        try {
            Integer customerId = getUserId(token);
            Map<String, Object> result = rideService.requestRide(dto, customerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/estimate-fare")
    public ResponseEntity<?> estimateFare(@RequestBody EstimateFareDto dto) {
        try {
            Map<String, Object> result = rideService.estimateFare(dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/cancel/{rideId}")
    public ResponseEntity<?> cancelRide(@RequestHeader("Authorization") String token, @PathVariable Integer rideId) {
        try {
            Integer customerId = getUserId(token);
            String result = rideService.cancelRide(rideId, customerId);
            return ResponseEntity.ok(new Map[]{Map.of("message", result)});
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(e.getMessage()); // Or NotFound
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getRideHistory(@RequestHeader("Authorization") String token) {
        try {
            Integer customerId = getUserId(token);
            List<Map<String, Object>> result = rideService.getRideHistory(customerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/pay/{rideId}")
    public ResponseEntity<?> makePayment(@RequestHeader("Authorization") String token, @PathVariable Integer rideId, @RequestBody PaymentDto dto) {
        try {
            Integer customerId = getUserId(token);
            Map<String, Object> result = rideService.makePayment(rideId, dto, customerId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}
