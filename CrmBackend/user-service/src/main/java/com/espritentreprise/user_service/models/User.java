package com.espritentreprise.user_service.models;

import java.util.Map;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public boolean login(String email, String password) {
        return this.email.equals(email) && this.password.equals(password);
    }

    public void updateProfile(Map<String, String> info) {
        if (info.containsKey("username")) this.username = info.get("username");
        if (info.containsKey("password")) this.password = info.get("password");
    }
}
