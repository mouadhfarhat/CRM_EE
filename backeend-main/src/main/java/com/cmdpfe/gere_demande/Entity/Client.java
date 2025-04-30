package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Client extends User {
	@ManyToMany
	@JoinTable(
	    name = "client_formation_interest",  // Custom join table name
	    joinColumns = @JoinColumn(name = "client_id"),
	    inverseJoinColumns = @JoinColumn(name = "formation_id")
	)
	private List<Formation> interested;
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore  // Add this to break the loop

	private List<Demande> demandes;

    public List<Demande> getDemandes() {
		return demandes;
	}

	public void setDemandes(List<Demande> demandes) {
		this.demandes = demandes;
	}
	@ManyToMany(mappedBy = "clients")
	@JsonIgnoreProperties("clients") // <-- Ignore the clients list inside event
	private List<CalendrierEvent> events = new ArrayList<>();

	// Constructors
    public Client() {}

    public Client(String username, String email, String password, String firstname, String lastname, String phoneNumber, List<Formation> interested) {
        super(username, email, password, firstname, lastname, phoneNumber);
        this.interested = interested;
    }

    // Getters & Setters
    public List<Formation> getInterested() { return interested; }
    public void setInterested(List<Formation> interested) { this.interested = interested; }
}
