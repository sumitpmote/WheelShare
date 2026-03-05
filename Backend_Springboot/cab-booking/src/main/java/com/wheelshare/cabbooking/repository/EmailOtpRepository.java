package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Integer> {

    Optional<EmailOtp> findTopByUserIdOrderByOtpIdDesc(Integer userId);

    java.util.List<EmailOtp> findByUserIdAndIsUsedFalse(Integer userId);

    Optional<EmailOtp> findFirstByUserIdAndIsUsedFalseOrderByExpiresAtDesc(Integer userId);
}
