package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "client_group")
public class ClientGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    @JsonBackReference("formation-group") // Important to avoid infinite recursion
    private Formation formation;

    @ManyToMany
    @JoinTable(
        name = "group_clients",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    private Set<Client> clients = new HashSet<>();

    @ManyToMany(mappedBy = "groups")
    @JsonIgnoreProperties("groups") // << Ignore "groups" when serializing event
    private List<CalendrierEvent> events = new ArrayList<>();

    // Constructors
    public ClientGroup() {}
    public ClientGroup(String name, Formation formation) {
        this.name = name;
        this.formation = formation;
    }


    // Getters & Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Formation getFormation() { return formation; }
    public void setFormation(Formation formation) { this.formation = formation; }
    public Set<Client> getClients() { return clients; }
    public void setClients(Set<Client> clients) { this.clients = clients; }
    public void addClient(Client client) { this.clients.add(client); }
    public void removeClient(Client client) { this.clients.remove(client); }
}
