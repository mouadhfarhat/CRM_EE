package com.cmdpfe.demande.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private boolean completed = false;

    @ManyToOne
    @JoinColumn(name = "demande_id")
    @JsonBackReference
    private Demande demande;


    // Constructors
    public Task() {}

    public Task(String content, Demande demande) {
        this.content = content;
        this.demande = demande;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Demande getDemande() { return demande; }
    public void setDemande(Demande demande) { this.demande = demande; }
}
