/*
 package com.cmdpfe.demande.sync;


import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

import com.cmdpfe.demande.Entity.User;
import com.cmdpfe.demande.Repository.UserRepository;
import com.cmdpfe.demande.jwt.CustomJwt;

import java.util.Optional;

@Component
public class UserSyncListener {

    private final UserRepository userRepo;

    public UserSyncListener(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @EventListener
    public void onLoginSuccess(AuthenticationSuccessEvent ev) {
        if (ev.getAuthentication() instanceof CustomJwt jwt) {
            String username = jwt.getUsername();
            Optional<User> existing = userRepo.findByUsername(username);

            if (existing.isEmpty()) {
                // First login: create new User
                User u = new User();
                u.setUsername(username);
                u.setFirstname(jwt.getFirstname());
                u.setLastname(jwt.getLastname());
                u.setEmail(jwt.getEmail());
                u.setPhoneNumber(jwt.getPhoneNumber());
                // No password in Keycloak; you may leave blank or a placeholder
                u.setPassword("");
                userRepo.save(u);
            }
            // else you could update fields if they’ve changed
        }
    }
}*/
