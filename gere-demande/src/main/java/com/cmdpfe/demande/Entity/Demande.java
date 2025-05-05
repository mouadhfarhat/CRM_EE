package com.cmdpfe.demande.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Table(name = "demande")
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private DemandeType type;

    @Enumerated(EnumType.STRING)
    private DemandeStatut statut;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    @JsonIgnoreProperties({"demanded", "events", "groups", "interestedClients"})
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "gestionnaire_id", nullable = true)
    @JsonIgnore
    private Gestionnaire gestionnaireAssigne;

    @ManyToOne
    @JoinColumn(name = "shared_with_id")
    @JsonIgnore
    private Gestionnaire sharedWith;
    public Demande() {
        this.createdAt = LocalDateTime.now();
    }

    public Demande(String title, String description, DemandeType type, DemandeStatut statut, Client client, Formation formation, Gestionnaire gestionnaireAssigne) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.statut = statut;
        this.client = client;
        this.formation = formation;
        this.gestionnaireAssigne = gestionnaireAssigne;
        this.createdAt = LocalDateTime.now();
    }




    public Gestionnaire getSharedWith() {
		return sharedWith;
	}

	public void setSharedWith(Gestionnaire sharedWith) {
		this.sharedWith = sharedWith;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	// Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DemandeType getType() { return type; }
    public void setType(DemandeType type) { this.type = type; }

    public DemandeStatut getStatut() { return statut; }
    public void setStatut(DemandeStatut statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Formation getFormation() { return formation; }
    public void setFormation(Formation formation) { this.formation = formation; }

    public Gestionnaire getGestionnaireAssigne() { return gestionnaireAssigne; }
    public void setGestionnaireAssigne(Gestionnaire gestionnaireAssigne) { this.gestionnaireAssigne = gestionnaireAssigne; }
}
