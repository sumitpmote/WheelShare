package com.wheelshare.cabbooking.controller;

import com.wheelshare.cabbooking.dto.LoginDto;
import com.wheelshare.cabbooking.dto.RegisterDto;
import com.wheelshare.cabbooking.dto.ResendOtpDto;
import com.wheelshare.cabbooking.dto.VerifyOtpDto;
import com.wheelshare.cabbooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto dto) {
        try {
            String result = authService.register(dto);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpDto dto) {
        try {
            String result = authService.verifyOtp(dto);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ResendOtpDto dto) {
        try {
            String result = authService.resendOtp(dto);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        try {
            Map<String, Object> result = authService.login(dto);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            // Using 401 Unauthorized for login failures as per .NET
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
