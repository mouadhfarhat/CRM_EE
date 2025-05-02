package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("SUPER_ADMIN")
public class SuperAdmin extends Admin {
    
    @Column(name = "security_level")
    private int securityLevel = 10; // Highest security level
    
    // Constructors
    public SuperAdmin() {
        super();
        setAdminRole(AdminRole.SUPER_ADMIN);
    }
    
    public SuperAdmin(String username, String email, String password, String firstname, 
                    String lastname, String phoneNumber) {
        super(username, email, password, firstname, lastname, phoneNumber, AdminRole.SUPER_ADMIN);
    }
    
    // Getters & Setters
    public int getSecurityLevel() {
        return securityLevel;
    }
    
    public void setSecurityLevel(int securityLevel) {
        this.securityLevel = securityLevel;
    }
}