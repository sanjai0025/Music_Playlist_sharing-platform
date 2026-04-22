package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.musicplaylistsharingplatform.musicplaylist.Service.SmsService;
import com.project.musicplaylistsharingplatform.musicplaylist.Service.otpService;

@RestController
@RequestMapping("/music")
@CrossOrigin(origins = "*")
public class SmsController {
    
    @Autowired
    private otpService otpService;
    
    @Autowired
    private SmsService smsService;
    
    @PostMapping("/send-otp-sms")
    public ResponseEntity<String> sendOtpSms(@RequestParam String phoneNumber) {
        System.out.println("Received phone number: " + phoneNumber);
        String otp = otpService.generateOtp(phoneNumber); // generate + store OTP for that phone
        boolean sent = smsService.sendOtpSms(phoneNumber, otp);

    if (sent) {
        return ResponseEntity.ok("OTP sent successfully via SMS");
    } else {
        return ResponseEntity.status(500).body("Failed to send OTP via SMS");
    }
}

@PostMapping("/verify-otp-sms")
public ResponseEntity<String> verifyOtpSms(@RequestParam String phoneNumber, @RequestParam String otp) {
    boolean isValid = otpService.verifyOtp(phoneNumber, otp);

    if (isValid) {
        return ResponseEntity.ok("OTP verified successfully");
    } else {
        return ResponseEntity.badRequest().body("Invalid or expired OTP");
    }
}


}
