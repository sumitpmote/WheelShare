package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    java.util.Optional<Payment> findByRideId(Integer rideId);
}
