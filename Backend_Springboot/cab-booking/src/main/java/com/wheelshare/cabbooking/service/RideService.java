package com.wheelshare.cabbooking.service;

import com.wheelshare.cabbooking.dto.EstimateFareDto;
import com.wheelshare.cabbooking.dto.PaymentDto;
import com.wheelshare.cabbooking.dto.RideRequestDto;
import com.wheelshare.cabbooking.entity.Driver;
import com.wheelshare.cabbooking.entity.Payment;
import com.wheelshare.cabbooking.entity.Ride;
import com.wheelshare.cabbooking.entity.User;
import com.wheelshare.cabbooking.helper.DistanceHelper;
import com.wheelshare.cabbooking.helper.FareHelper;
import com.wheelshare.cabbooking.repository.DriverRepository;
import com.wheelshare.cabbooking.repository.PaymentRepository;
import com.wheelshare.cabbooking.repository.RideRepository;
import com.wheelshare.cabbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final FareHelper fareHelper;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public Map<String, Object> requestRide(RideRequestDto dto, Integer customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        double distanceKm = DistanceHelper.calculateDistanceKm(
                dto.getSourceLat(), dto.getSourceLng(),
                dto.getDestinationLat(), dto.getDestinationLng()
        );

        BigDecimal estimatedFare = fareHelper.calculateEstimatedFare(distanceKm);

        Ride ride = new Ride();
        ride.setCustomer(customer);
        ride.setSourceLat(dto.getSourceLat());
        ride.setSourceLng(dto.getSourceLng());
        ride.setSourceAddress(dto.getSourceAddress());
        ride.setDestinationLat(dto.getDestinationLat());
        ride.setDestinationLng(dto.getDestinationLng());
        ride.setDestinationAddress(dto.getDestinationAddress());
        ride.setDistanceKm(Math.round(distanceKm * 100.0) / 100.0); // Round to 2 decimal places

        if (dto.getEstimatedFare() != null && dto.getEstimatedFare().doubleValue() > 0) {
            ride.setFare(dto.getEstimatedFare().doubleValue());
        } else {
            ride.setFare(Math.round(estimatedFare.doubleValue() * 100.0) / 100.0);
        }

        ride.setRideStatus("REQUESTED");
        ride.setRequestedAt(LocalDateTime.now());
        
        ride = rideRepository.save(ride);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ride requested successfully");
        response.put("rideId", ride.getRideId());
        response.put("distanceKm", ride.getDistanceKm());
        response.put("estimatedFare", ride.getFare());

        return response;
    }

    public List<Ride> getPendingRides() {
        return rideRepository.findByRideStatusAndDriverIsNull("REQUESTED");
    }

    @Transactional
    public String acceptRide(Integer rideId, Integer driverUserId) {
        // Driver ID in Ride table refers to Driver entity primary key, which is Shared PK with User table usually
        // But let's check: Driver entity has @Id private Integer driverId.
        // And DriverController uses int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value) which is UserID.
        // Since Driver table usually has PK same as UserID (OneToOne), we can use userId directly if mapped that way.
        // Let's assume DriverId = UserId for now based on .NET logic `ride.DriverId = driverId`.

        // Finding Driver entity just to be sure
        Driver driver = driverRepository.findById(driverUserId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!"REQUESTED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride already taken or cancelled");
        }

        ride.setDriver(driver);
        ride.setRideStatus("ACCEPTED");
        ride.setAcceptedAt(LocalDateTime.now());
        
        driver.setIsAvailable(false);
        driverRepository.save(driver);

        rideRepository.save(ride);

        return "Ride accepted successfully";
    }

    @Transactional
    public String startRide(Integer rideId, Integer driverId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (ride.getDriver() == null || !ride.getDriver().getDriverId().equals(driverId)) {
             throw new RuntimeException("Ride not assigned to this driver");
        }

        if (!"ACCEPTED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride cannot be started");
        }

        ride.setRideStatus("STARTED");
        rideRepository.save(ride);

        return "Ride started successfully";
    }

    @Transactional
    public String completeRide(Integer rideId, Integer driverId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
                
        if (ride.getDriver() == null || !ride.getDriver().getDriverId().equals(driverId)) {
             throw new RuntimeException("Ride not assigned to this driver");
        }

        if (!"STARTED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride cannot be completed");
        }

        ride.setRideStatus("COMPLETED");
        ride.setCompletedAt(LocalDateTime.now());
        ride.setFinalFare(ride.getFare()); // Set final fare same as estimated

        rideRepository.save(ride);
        
        // Make driver available again
        Driver driver = ride.getDriver();
        driver.setIsAvailable(true);
        driverRepository.save(driver);

        return "Ride completed successfully";
    }

    public String rejectRide(Integer rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!"REQUESTED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride cannot be rejected");
        }
        
        return "Ride rejected";
    }

    public Map<String, Object> estimateFare(EstimateFareDto dto) {
        double distanceKm = DistanceHelper.calculateDistanceKm(
                dto.getSourceLat(), dto.getSourceLng(),
                dto.getDestinationLat(), dto.getDestinationLng()
        );

        BigDecimal estimatedFare = fareHelper.calculateEstimatedFare(distanceKm);

        Map<String, Object> response = new HashMap<>();
        response.put("distanceKm", Math.round(distanceKm * 100.0) / 100.0);
        response.put("estimatedFare", Math.round(estimatedFare.doubleValue() * 100.0) / 100.0);

        return response;
    }

    @Transactional
    public String cancelRide(Integer rideId, Integer customerId) {
        Ride ride = rideRepository.findByRideIdAndCustomer_UserId(rideId, customerId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!"REQUESTED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride cannot be cancelled");
        }

        ride.setRideStatus("CANCELLED");
        rideRepository.save(ride);

        return "Ride cancelled successfully";
    }

    public List<Map<String, Object>> getRideHistory(Integer customerId) {
        List<Ride> rides = rideRepository.findByCustomer_UserIdOrderByRequestedAtDesc(customerId);

        return rides.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("rideId", r.getRideId());
            map.put("sourceLat", r.getSourceLat());
            map.put("sourceLng", r.getSourceLng());
            map.put("destinationLat", r.getDestinationLat());
            map.put("destinationLng", r.getDestinationLng());
            map.put("distanceKm", r.getDistanceKm());
            map.put("fare", r.getFare());
            map.put("finalFare", r.getFinalFare());
            map.put("rideStatus", r.getRideStatus());
            map.put("requestedAt", r.getRequestedAt());
            map.put("completedAt", r.getCompletedAt());
            
            if (r.getDriver() != null && r.getDriver().getUser() != null) {
                Map<String, Object> driverInfo = new HashMap<>();
                driverInfo.put("name", r.getDriver().getUser().getName());
                driverInfo.put("phone", r.getDriver().getUser().getPhone());
                driverInfo.put("licenseNumber", r.getDriver().getLicenseNumber());
                map.put("driver", driverInfo);
            } else {
                map.put("driver", null);
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> makePayment(Integer rideId, PaymentDto dto, Integer customerId) {
        Ride ride = rideRepository.findByRideIdAndCustomer_UserId(rideId, customerId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (!"COMPLETED".equals(ride.getRideStatus())) {
            throw new RuntimeException("Ride not completed");
        }

        if (paymentRepository.findByRideId(rideId).isPresent()) {
            throw new RuntimeException("Payment already made for this ride");
        }

        
        Payment payment = new Payment();
        payment.setRideId(rideId);
        payment.setAmount(BigDecimal.valueOf(ride.getFinalFare() != null ? ride.getFinalFare() : ride.getFare()));
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus("CASH".equals(dto.getPaymentMethod()) ? "COMPLETED" : "PENDING");
        payment.setCreatedAt(LocalDateTime.now());
        
        if ("UPI".equals(dto.getPaymentMethod())) {
            payment.setTransactionRef(UUID.randomUUID().toString());
        }

        paymentRepository.save(payment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Payment processed successfully");
        response.put("paymentId", payment.getPaymentId());
        
        return response;
    }
}
