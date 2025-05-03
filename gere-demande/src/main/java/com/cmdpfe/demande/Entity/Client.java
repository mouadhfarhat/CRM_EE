package com.cmdpfe.demande.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Client extends User {
    @ManyToMany
    @JoinTable(
        name = "client_formation_interest",
        joinColumns = @JoinColumn(name = "client_id"),
        inverseJoinColumns = @JoinColumn(name = "formation_id")
    )
    private List<Formation> interested;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Demande> demandes;

    @ManyToMany(mappedBy = "clients")
    @JsonIgnoreProperties("clients")
    private List<CalendrierEvent> events = new ArrayList<>();

    // Constructors
    public Client() {}

    public Client(String keycloakId, String username, String email, String firstname, String lastname, String phoneNumber, List<Formation> interested) {
        super(keycloakId, username, email, firstname, lastname, phoneNumber);
        this.interested = interested;
    }

    // Getters & Setters
    public List<Formation> getInterested() { return interested; }
    public void setInterested(List<Formation> interested) { this.interested = interested; }
    public List<Demande> getDemandes() { return demandes; }
    public void setDemandes(List<Demande> demandes) { this.demandes = demandes; }
    public List<CalendrierEvent> getEvents() { return events; }
    public void setEvents(List<CalendrierEvent> events) { this.events = events; }
}