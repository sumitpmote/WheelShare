package com.wheelshare.cabbooking.service;

import com.wheelshare.cabbooking.dto.LoginDto;
import com.wheelshare.cabbooking.dto.RegisterDto;
import com.wheelshare.cabbooking.dto.ResendOtpDto;
import com.wheelshare.cabbooking.dto.VerifyOtpDto;
import com.wheelshare.cabbooking.entity.Driver;
import com.wheelshare.cabbooking.entity.EmailOtp;
import com.wheelshare.cabbooking.entity.User;
import com.wheelshare.cabbooking.helper.OtpHelper;
import com.wheelshare.cabbooking.repository.DriverRepository;
import com.wheelshare.cabbooking.repository.EmailOtpRepository;
import com.wheelshare.cabbooking.repository.UserRepository;
import com.wheelshare.cabbooking.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final EmailOtpRepository emailOtpRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String register(RegisterDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        user.setIsEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);

        user = userRepository.save(user);

        if ("DRIVER".equalsIgnoreCase(dto.getRole())) {
            Driver driver = new Driver();
            driver.setUser(user);
            driver.setLicenseNumber("PENDING");
            driverRepository.save(driver);
        }

        String otp = OtpHelper.generateOtp();

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setUserId(user.getUserId());
        emailOtp.setOtpCode(otp);
        emailOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        emailOtp.setIsUsed(false);
        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return "OTP sent to registered email";
    }

    public String verifyOtp(VerifyOtpDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new RuntimeException("Email already verified");
        }

        EmailOtp otpRecord = emailOtpRepository.findFirstByUserIdAndIsUsedFalseOrderByExpiresAtDesc(user.getUserId())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!otpRecord.getOtpCode().equals(dto.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        otpRecord.setIsUsed(true);
        emailOtpRepository.save(otpRecord);

        user.setIsEmailVerified(true);
        userRepository.save(user);

        return "Email verified successfully. Please login.";
    }

    @Transactional
    public String resendOtp(ResendOtpDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new RuntimeException("Email already verified");
        }

        List<EmailOtp> oldOtps = emailOtpRepository.findByUserIdAndIsUsedFalse(user.getUserId());
        for (EmailOtp oldOtp : oldOtps) {
            oldOtp.setIsUsed(true);
        }
        emailOtpRepository.saveAll(oldOtps);

        String newOtp = OtpHelper.generateOtp();

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setUserId(user.getUserId());
        emailOtp.setOtpCode(newOtp);
        emailOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        emailOtp.setIsUsed(false);
        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(user.getEmail(), newOtp);

        return "OTP resent successfully";
    }

    public Map<String, Object> login(LoginDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (Boolean.FALSE.equals(user.getIsEmailVerified())) {
            throw new RuntimeException("Please verify your email first");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getUserId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getUserId());
        response.put("role", user.getRole());

        return response;
    }
}
