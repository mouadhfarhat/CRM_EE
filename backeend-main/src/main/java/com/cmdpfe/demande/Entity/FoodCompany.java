package com.cmdpfe.demande.Entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity

public class FoodCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactInfo;   // e.g. email or phone

    // Back-ref: one company may serve many formations
    @OneToMany(mappedBy = "foodCompany")
    @JsonIgnore

    private List<Formation> formations;

    public FoodCompany() {}

    public FoodCompany(String name, String contactInfo) {
        this.name = name;
        this.contactInfo = contactInfo;
    }

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

	public String getContactInfo() {
		return contactInfo;
	}

	public void setContactInfo(String contactInfo) {
		this.contactInfo = contactInfo;
	}

	public List<Formation> getFormations() {
		return formations;
	}

	public void setFormations(List<Formation> formations) {
		this.formations = formations;
	}

}
