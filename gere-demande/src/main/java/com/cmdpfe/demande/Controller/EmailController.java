package com.cmdpfe.demande.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import com.cmdpfe.demande.Entity.EmailRequest;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<Map<String, String>> sendEmail(@RequestBody EmailRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getRecipients().toArray(new String[0]));
            message.setSubject(request.getSubject());
            message.setText(request.getBody());
            mailSender.send(message);

            return ResponseEntity.ok(Collections.singletonMap("message", "Emails sent successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Collections.singletonMap("message", "Failed to send emails!"));

        }
    }

}
