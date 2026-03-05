package com.wheelshare.cabbooking.service;

import com.wheelshare.cabbooking.dto.DriverLocationDto;
import com.wheelshare.cabbooking.entity.Driver;
import com.wheelshare.cabbooking.entity.Ride;
import com.wheelshare.cabbooking.helper.DistanceHelper;
import com.wheelshare.cabbooking.helper.FareHelper;
import com.wheelshare.cabbooking.repository.DriverRepository;
import com.wheelshare.cabbooking.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;
    private final FareHelper fareHelper;

    @Transactional
    public String goOnline(Integer driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        driver.setIsAvailable(true);
        driverRepository.save(driver);
        return "Driver is online";
    }

    @Transactional
    public String updateLocation(Integer driverId, DriverLocationDto dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (Boolean.FALSE.equals(driver.getIsAvailable())) {
             throw new RuntimeException("Driver is offline");
        }

        driver.setCurrentLatitude(dto.getLatitude());
        driver.setCurrentLongitude(dto.getLongitude());
        driverRepository.save(driver);
        
        return "Location updated";
    }

    @Transactional
    public String goOffline(Integer driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setIsAvailable(false);
        driverRepository.save(driver);
        return "Driver is offline";
    }

    public List<Map<String, Object>> getNearbyRides(Integer driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        if (Boolean.FALSE.equals(driver.getIsAvailable()) || driver.getCurrentLatitude() == null) {
            return new ArrayList<>();
        }

        double maxDistanceKm = 5.0;
        List<Ride> rides = rideRepository.findByRideStatusAndDriverIsNull("REQUESTED");

        return rides.stream()
                .filter(r -> DistanceHelper.calculateDistanceKm(
                        driver.getCurrentLatitude(), driver.getCurrentLongitude(),
                        r.getSourceLat(), r.getSourceLng()
                ) <= maxDistanceKm)
                .map(r -> {
                    double distanceToPickup = DistanceHelper.calculateDistanceKm(
                            driver.getCurrentLatitude(), driver.getCurrentLongitude(),
                            r.getSourceLat(), r.getSourceLng()
                    );
                    
                    BigDecimal driverEarning = fareHelper.calculateDriverEarning(BigDecimal.valueOf(r.getFare()));

                    Map<String, Object> map = new HashMap<>();
                    map.put("rideId", r.getRideId());
                    map.put("pickupAddress", r.getSourceAddress());
                    map.put("dropAddress", r.getDestinationAddress());
                    map.put("distanceKm", r.getDistanceKm());
                    map.put("fare", r.getFare());
                    map.put("driverEarning", driverEarning);
                    map.put("distanceToPickup", Math.round(distanceToPickup * 100.0) / 100.0);
                    
                    return map;
                })
                .sorted((m1, m2) -> Double.compare((Double) m1.get("distanceToPickup"), (Double) m2.get("distanceToPickup")))
                .collect(Collectors.toList());
    }

    public List<Ride> getMyRides(Integer driverId) {
        return rideRepository.findByDriver_DriverId(driverId).stream()
                .filter(r -> "ACCEPTED".equals(r.getRideStatus()) || "STARTED".equals(r.getRideStatus()))
                .sorted((r1, r2) -> r2.getRequestedAt().compareTo(r1.getRequestedAt()))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRideHistory(Integer driverId) {
         return rideRepository.findByDriver_DriverIdAndRideStatus(driverId, "COMPLETED").stream()
                .sorted((r1, r2) -> r2.getCompletedAt().compareTo(r1.getCompletedAt()))
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("rideId", r.getRideId());
                    map.put("sourceAddress", r.getSourceAddress());
                    map.put("destinationAddress", r.getDestinationAddress());
                    map.put("distanceKm", r.getDistanceKm());
                    map.put("fare", r.getFare());
                    map.put("finalFare", r.getFinalFare());
                    map.put("rideStatus", r.getRideStatus());
                    map.put("completedAt", r.getCompletedAt());
                    map.put("customerName", r.getCustomer() != null ? r.getCustomer().getName() : "Unknown");
                    map.put("driverEarning", fareHelper.calculateDriverEarning(BigDecimal.valueOf(r.getFinalFare() != null ? r.getFinalFare() : r.getFare())));
                    return map;
                })
                .collect(Collectors.toList());
    }
}
