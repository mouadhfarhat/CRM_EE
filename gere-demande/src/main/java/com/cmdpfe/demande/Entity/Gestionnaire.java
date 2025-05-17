package com.cmdpfe.demande.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Gestionnaire extends User {
    @Enumerated(EnumType.STRING)
    private DepartmentType department;

 // In Gestionnaire.java
 // Gestionnaire.java
    @OneToMany(mappedBy = "gestionnaireAssigne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Demande> assignedDemandes;

    @OneToMany(mappedBy = "sharedWith")
    private List<Demande> demandesSharedWithMe;


    // Constructors
    public Gestionnaire() {}

    public Gestionnaire(String keycloakId, String username, String email, String firstname, String lastname, String phoneNumber, DepartmentType department) {
        super(keycloakId, username, email, firstname, lastname, phoneNumber);
        this.department = department;
    }

    // Getters & Setters
    public DepartmentType getDepartment() { return department; }
    public void setDepartment(DepartmentType department) { this.department = department; }
    public List<Demande> getAssignedDemandes() { return assignedDemandes; }
    public void setAssignedDemandes(List<Demande> assignedDemandes) { this.assignedDemandes = assignedDemandes; }
    public List<Demande> getDemandesSharedWithMe() { return demandesSharedWithMe; }
    public void setDemandesSharedWithMe(List<Demande> demandesSharedWithMe) { this.demandesSharedWithMe = demandesSharedWithMe; }
}