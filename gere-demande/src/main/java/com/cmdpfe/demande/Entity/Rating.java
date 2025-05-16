package com.cmdpfe.demande.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Table(name="rating")
public class Rating {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="client_id", nullable=false)
    private Client client;

    @ManyToOne
    @JoinColumn(name="formation_id", nullable=false)
    private Formation formation;

    private int value;

    // Constructors
    public Rating() {
        // Default constructor for JPA
    }

    public Rating(Client client, Formation formation, int value) {
        this.client = client;
        this.formation = formation;
        this.value = value;
    }

    public Rating(Long id, Client client, Formation formation, int value) {
        this.id = id;
        this.client = client;
        this.formation = formation;
        this.value = value;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Formation getFormation() {
        return formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}