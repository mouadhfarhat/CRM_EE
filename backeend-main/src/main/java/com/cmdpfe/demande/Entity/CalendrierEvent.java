	package com.cmdpfe.demande.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
public class CalendrierEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private EventType type;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.SCHEDULED;

    @ManyToOne
    @JoinColumn(name = "gestionnaire_id")
    @JsonIgnore // gestionnaire hidden from frontend
    private Gestionnaire gestionnaire;

    @ManyToMany
    @JoinTable(
        name = "calendrier_event_clients",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    @JsonIgnoreProperties("events") // <-- Ignore the events list inside client
    private List<Client> clients = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "formation_id")
    @JsonIgnoreProperties({"events", "groups", "interestedClients", "demanded"}) 
    private Formation formation; 

    @ManyToMany
    @JoinTable(
        name = "calendrier_event_groups",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    @JsonIgnoreProperties("events") // << Ignore "events" when serializing group
    private List<ClientGroup> groups = new ArrayList<>();


    private String backgroundColor;
    private String borderColor;
    
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public EventType getType() { return type; }
    public void setType(EventType type) { this.type = type; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public Gestionnaire getGestionnaire() { return gestionnaire; }
    public void setGestionnaire(Gestionnaire gestionnaire) { this.gestionnaire = gestionnaire; }

    public List<Client> getClients() { return clients; }
    public void setClients(List<Client> clients) { this.clients = clients; }

    public Formation getFormation() { return formation; }
    public void setFormation(Formation formation) { this.formation = formation; }



    public List<ClientGroup> getGroups() {
		return groups;
	}
	public void setGroups(List<ClientGroup> groups) {
		this.groups = groups;
	}
	public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public String getBorderColor() { return borderColor; }
    public void setBorderColor(String borderColor) { this.borderColor = borderColor; }

    // Constructors
    public CalendrierEvent() {
        super();
    }
	public CalendrierEvent(Long id, String title, LocalDateTime startTime, LocalDateTime endTime, EventType type,
			EventStatus status, Gestionnaire gestionnaire, List<Client> clients, Formation formation,
			List<ClientGroup> groups, String backgroundColor, String borderColor) {
		super();
		this.id = id;
		this.title = title;
		this.startTime = startTime;
		this.endTime = endTime;
		this.type = type;
		this.status = status;
		this.gestionnaire = gestionnaire;
		this.clients = clients;
		this.formation = formation;
		this.groups = groups;
		this.backgroundColor = backgroundColor;
		this.borderColor = borderColor;
	}


}
