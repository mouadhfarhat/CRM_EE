package com.espritentreprise.formation_service.dto;


import java.util.UUID;
import lombok.Data;

@Data
public class User {
    private UUID id;
    private String username;
    private String email;
    private String role;

    // Getters and Setters
}
