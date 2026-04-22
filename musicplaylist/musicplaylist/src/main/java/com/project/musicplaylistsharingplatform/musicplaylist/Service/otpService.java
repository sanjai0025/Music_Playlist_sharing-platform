package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class otpService {

    // Store OTPs temporarily (use Redis/DB for production)
    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, Long> otpExpiry = new HashMap<>();

    // Generate and store OTP
    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit
        otpStorage.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + (5 * 60 * 1000)); // expires in 5 mins
        return otp;
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otp) {
        if (!otpStorage.containsKey(email)) return false;

        if (otpExpiry.get(email) < System.currentTimeMillis()) {
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return false; // expired
        }

        return otpStorage.get(email).equals(otp);
    }

    // Complete verification - removes OTP from storage after successful verification
    public boolean completeVerification(String email, String otp) {
        boolean isValid = verifyOtp(email, otp);
        if (isValid) {
            otpStorage.remove(email);
            otpExpiry.remove(email);
        }
        return isValid;
    }
}

