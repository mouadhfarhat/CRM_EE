package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
public class Formation {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalDate registrationEndDate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "formateur_id", nullable = false)
    private Formateur formateur;

    @ManyToOne
    @JoinColumn(name = "food_company_id", nullable = false)
    private FoodCompany foodCompany;

    @ManyToMany(mappedBy = "interested")
    @JsonIgnore
    private List<Client> interestedClients;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Demande> demanded;

    @OneToMany(mappedBy = "formation")
    @JsonIgnore
    private List<CalendrierEvent> events = new ArrayList<>();

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("formation-group") // Important for groups serialization!
    private List<ClientGroup> groups = new ArrayList<>();


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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDateDebut() {
		return dateDebut;
	}

	public void setDateDebut(LocalDate dateDebut) {
		this.dateDebut = dateDebut;
	}

	public LocalDate getDateFin() {
		return dateFin;
	}

	public void setDateFin(LocalDate dateFin) {
		this.dateFin = dateFin;
	}

	public LocalDate getRegistrationEndDate() {
		return registrationEndDate;
	}

	public void setRegistrationEndDate(LocalDate registrationEndDate) {
		this.registrationEndDate = registrationEndDate;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public Formateur getFormateur() {
		return formateur;
	}

	public void setFormateur(Formateur formateur) {
		this.formateur = formateur;
	}

	public FoodCompany getFoodCompany() {
		return foodCompany;
	}

	public void setFoodCompany(FoodCompany foodCompany) {
		this.foodCompany = foodCompany;
	}

	public List<Client> getInterestedClients() {
		return interestedClients;
	}

	public void setInterestedClients(List<Client> interestedClients) {
		this.interestedClients = interestedClients;
	}

	public List<Demande> getDemanded() {
		return demanded;
	}

	public void setDemanded(List<Demande> demanded) {
		this.demanded = demanded;
	}

	public List<CalendrierEvent> getEvents() {
		return events;
	}

	public void setEvents(List<CalendrierEvent> events) {
		this.events = events;
	}

	public List<ClientGroup> getGroups() {
		return groups;
	}

	public void setGroups(List<ClientGroup> groups) {
		this.groups = groups;
	}

	public Formation(Long id, String name, String title, String description, LocalDate dateDebut, LocalDate dateFin,
			LocalDate registrationEndDate, Category category, Formateur formateur, FoodCompany foodCompany,
			List<Client> interestedClients, List<Demande> demanded, List<CalendrierEvent> events,
			List<ClientGroup> groups) {
		super();
		this.id = id;
		this.name = name;
		this.title = title;
		this.description = description;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.registrationEndDate = registrationEndDate;
		this.category = category;
		this.formateur = formateur;
		this.foodCompany = foodCompany;
		this.interestedClients = interestedClients;
		this.demanded = demanded;
		this.events = events;
		this.groups = groups;
	}

	public Formation() {
		super();
		// TODO Auto-generated constructor stub
	}

    
}