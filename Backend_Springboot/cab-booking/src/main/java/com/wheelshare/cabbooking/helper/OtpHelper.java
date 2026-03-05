package com.wheelshare.cabbooking.helper;

import java.security.SecureRandom;

public class OtpHelper {
    public static String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
