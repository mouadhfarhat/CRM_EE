package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.SmsRequest;
import com.cmdpfe.demande.Entity.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    @Autowired
    private TwilioConfig twilioConfig;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendSms(@RequestBody SmsRequest smsRequest) {
        try {
            Message.creator(
                    new PhoneNumber(smsRequest.getTo()),               // To
                    new PhoneNumber(twilioConfig.getPhoneNumber()),   // From (Twilio number)
                    smsRequest.getMessage()                            // Message
            ).create();

            return ResponseEntity.ok(Collections.singletonMap("message", "SMS sent successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Collections.singletonMap("message", "Failed to send SMS: " + e.getMessage()));
        }
    }
}
