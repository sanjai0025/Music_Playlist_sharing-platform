package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    // Twilio credentials
    String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");  //this is removed due to security reasons 
    String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN"); ///this is removed due to security reasons contact sanjai :)
    private final String FROM_PHONE = "+12526508664"; // Twilio number

    public SmsService() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public boolean sendOtpSms(String phoneNumber, String otp) {
        try {
            Message.creator(
                    new com.twilio.type.PhoneNumber(phoneNumber),
                    new com.twilio.type.PhoneNumber(FROM_PHONE),
                    "Your OTP is: " + otp + " (valid for 5 minutes)"
            ).create();
            return true;
        } catch (Exception e) {
            e.printStackTrace(); 
            return false;
        }
    }
}