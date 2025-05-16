package com.cmdpfe.demande.Entity;

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

    private Double averageRating;
    private String imagePath; // NEW: To store the path or name of the image file
    private Double price; // NEW: Price field

    private String fileName; // NEW: PDF file name/path

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
    @JsonManagedReference("formation-group")
    @JsonIgnore // Prevent deserialization of groups during POST
    private List<ClientGroup> groups = new ArrayList<>();
    
    
    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Rating> ratings = new ArrayList<>();


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public List<Rating> getRatings() {
		return ratings;
	}

	public void setRatings(List<Rating> ratings) {
		this.ratings = ratings;
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

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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
    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    // Constructors

    public Formation() {
        super();
    }

    public Formation(Long id, String name, String title, String description, LocalDate dateDebut, LocalDate dateFin,
            LocalDate registrationEndDate, Double averageRating, Double price, String fileName, String imagePath,
            Category category, Formateur formateur, FoodCompany foodCompany,
            List<Client> interestedClients, List<Demande> demanded,
            List<CalendrierEvent> events, List<ClientGroup> groups) {
						this.id = id;
						this.name = name;
						this.title = title;
						this.description = description;
						this.dateDebut = dateDebut;
						this.dateFin = dateFin;
						this.registrationEndDate = registrationEndDate;
						this.averageRating = averageRating;
						this.price = price;
						this.fileName = fileName;
						this.imagePath = imagePath; // Add to constructor
						this.category = category;
						this.formateur = formateur;
						this.foodCompany = foodCompany;
						this.interestedClients = interestedClients;
						this.demanded = demanded;
						this.events = events;
						this.groups = groups;
						}
}