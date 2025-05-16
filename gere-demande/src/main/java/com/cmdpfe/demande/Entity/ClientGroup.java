package com.cmdpfe.demande.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "client_group")
public class ClientGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    @JsonBackReference("formation-group") // Match with @JsonManagedReference in Formation
    private Formation formation;

    @ManyToMany
    @JoinTable(
        name = "group_clients",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    @JsonIgnore // Exclude clients from serialization
    private Set<Client> clients = new HashSet<>();

    @ManyToMany(mappedBy = "groups")
    @JsonIgnore // Exclude events from serialization to avoid recursion
    private List<CalendrierEvent> events = new ArrayList<>();

    // Constructors
    public ClientGroup() {}

    public ClientGroup(String name, Formation formation) {
        this.name = name;
        this.formation = formation;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Formation getFormation() {
        return formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public Set<Client> getClients() {
        return clients;
    }

    public void setClients(Set<Client> clients) {
        this.clients = clients;
    }

    public void addClient(Client client) {
        this.clients.add(client);
    }

    public void removeClient(Client client) {
        this.clients.remove(client);
    }

    public List<CalendrierEvent> getEvents() {
        return events;
    }

    public void setEvents(List<CalendrierEvent> events) {
        this.events = events;
    }
}