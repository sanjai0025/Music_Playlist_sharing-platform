package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.musicplaylistsharingplatform.musicplaylist.Service.LoginService;
import com.project.musicplaylistsharingplatform.musicplaylist.Service.UserService;
import com.project.musicplaylistsharingplatform.musicplaylist.Service.otpService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Login;

@RestController
public class OtpController {

    @Autowired
    private otpService otpService;
    
    @Autowired
    private LoginService loginService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp, @RequestParam String userName) {
        boolean isValid = otpService.completeVerification(email, otp);
        
        if (isValid) {
            // Update Login verified status
            loginService.updateVerifiedStatus(userName, true);
            
            // Get user info and update status to "verified"
            Login login = loginService.getUserIdAfterValidation(userName);
            if (login != null && login.getUser() != null) {
                userService.updateUserStatus(login.getUser().getUserId(), "verified");
            }
            
            return ResponseEntity.ok("OTP verified successfully. Account is now active.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }
}