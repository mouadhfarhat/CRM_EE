package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
public class RegularAdmin extends Admin {
    
    @Column(name = "department")
    private String department;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private SuperAdmin createdBy;
    
    // Constructors
    public RegularAdmin() {
        super();
        setAdminRole(AdminRole.ADMIN);
    }
    
    public RegularAdmin(String username, String email, String password, String firstname, 
                      String lastname, String phoneNumber, String department, SuperAdmin createdBy) {
        super(username, email, password, firstname, lastname, phoneNumber, AdminRole.ADMIN);
        this.department = department;
        this.createdBy = createdBy;
    }
    
    // Getters & Setters
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public SuperAdmin getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(SuperAdmin createdBy) {
        this.createdBy = createdBy;
    }
}