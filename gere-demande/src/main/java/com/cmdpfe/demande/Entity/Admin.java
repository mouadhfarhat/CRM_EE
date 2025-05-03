package com.cmdpfe.demande.Entity;

import jakarta.persistence.Entity;

@Entity
public class Admin extends User {
    // No additional fields for now (can be extended later)

    // Constructors
    public Admin() {}

    public Admin(String keycloakId, String username, String email, String firstname, String lastname, String phoneNumber) {
        super(keycloakId, username, email, firstname, lastname, phoneNumber);
    }
}