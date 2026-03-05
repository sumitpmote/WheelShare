package com.wheelshare.cabbooking.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String role; // CUSTOMER | DRIVER
}
