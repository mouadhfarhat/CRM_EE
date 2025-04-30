package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Gestionnaire extends User {
	@Enumerated(EnumType.STRING)  // Store as a String in the DB
    private DepartmentType department;
	
    @OneToMany(mappedBy = "gestionnaireAssigne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Prevents serialization of assignedDemandes

    private List<Demande> assignedDemandes;
    
    @OneToMany(mappedBy = "sharedWith")
    private List<Demande> demandesSharedWithMe;


    // Constructors
    public Gestionnaire() {}

    public Gestionnaire(String username, String email, String password, String firstname, String lastname, String phoneNumber, DepartmentType department) {
        super(username, email, password, firstname, lastname, phoneNumber);
        this.department = department;
    }

    // Getters & Setters
    public DepartmentType getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentType department) {
        this.department = department;
    }

    public List<Demande> getAssignedDemandes() { return assignedDemandes; }
    public void setAssignedDemandes(List<Demande> assignedDemandes) { this.assignedDemandes = assignedDemandes; }
}
