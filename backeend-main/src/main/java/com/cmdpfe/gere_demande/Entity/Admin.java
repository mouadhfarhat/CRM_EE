package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "admins")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "admin_type", discriminatorType = DiscriminatorType.STRING)
public class Admin extends User {
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "last_login")
    private Date lastLogin;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "admin_role")
    private AdminRole adminRole;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    public enum AdminRole {
        ADMIN,
        SUPER_ADMIN
    }
    
    // Constructors
    public Admin() {
        this.createdAt = new Date();
    }
    
    public Admin(String username, String email, String password, String firstname, 
                String lastname, String phoneNumber, AdminRole adminRole) {
        super(username, email, password, firstname, lastname, phoneNumber);
        this.adminRole = adminRole;
        this.createdAt = new Date();
    }
    
    // Getters & Setters
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    public AdminRole getAdminRole() {
        return adminRole;
    }
    
    public void setAdminRole(AdminRole adminRole) {
        this.adminRole = adminRole;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isSuperAdmin() {
        return this.adminRole == AdminRole.SUPER_ADMIN;
    }
}