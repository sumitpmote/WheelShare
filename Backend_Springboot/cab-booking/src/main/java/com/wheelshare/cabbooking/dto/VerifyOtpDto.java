package com.wheelshare.cabbooking.dto;

import lombok.Data;

@Data
public class VerifyOtpDto {
    private String email;
    private String otp;
}
