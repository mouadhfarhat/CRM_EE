package com.cmdpfe.demande.jwt;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;

public class CustomJwt extends JwtAuthenticationToken {
    private String id; // From 'sub' claim
    private String email; // From 'email' claim
    private String username; // From 'preferred_username' claim
    private String firstname; // From 'given_name' claim
    private String lastname; // From 'family_name' claim
    private String phoneNumber; // From 'phone_number' claim

    public CustomJwt(Jwt jwt, Collection<? extends GrantedAuthority> authorities) {
        super(jwt, authorities);
        this.id = jwt.getSubject();
        this.email = jwt.getClaimAsString("email");
        this.username = jwt.getClaimAsString("preferred_username");
        this.firstname = jwt.getClaimAsString("given_name");
        this.lastname = jwt.getClaimAsString("family_name");
        this.phoneNumber = jwt.getClaimAsString("phone_number");
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}