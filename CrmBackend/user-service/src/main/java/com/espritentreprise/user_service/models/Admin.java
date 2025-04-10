package com.espritentreprise.user_service.models;


import jakarta.persistence.Entity;

@Entity
public class Admin extends User {
    // Admin-specific methods
    public void manageFormations() {
        // Logic to manage formations
    }

    public void manageClients() {
        // Logic to manage clients
    }
}
