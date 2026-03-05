package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Integer> {
    List<Ride> findByRideStatusAndDriverIsNull(String rideStatus);
    List<Ride> findByRideStatus(String rideStatus);

    List<Ride> findByCustomer_UserIdOrderByRequestedAtDesc(Integer userId);

    java.util.Optional<Ride> findByRideIdAndCustomer_UserId(Integer rideId, Integer userId);

    List<Ride> findByDriver_DriverId(Integer driverId);

    List<Ride> findByDriver_DriverIdAndRideStatus(Integer driverId, String rideStatus);
}
