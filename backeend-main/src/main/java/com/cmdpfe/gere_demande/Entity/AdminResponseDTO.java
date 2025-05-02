package com.cmdpfe.gere_demande.Entity;

//DTO for admin responses
public class AdminResponseDTO {
private Long id;
private String username;
private String email;
private String firstname;
private String lastname;
private String phoneNumber;
private String department;
private boolean active;

// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public String getUsername() { return username; }
public void setUsername(String username) { this.username = username; }

public String getEmail() { return email; }
public void setEmail(String email) { this.email = email; }

public String getFirstname() { return firstname; }
public void setFirstname(String firstname) { this.firstname = firstname; }

public String getLastname() { return lastname; }
public void setLastname(String lastname) { this.lastname = lastname; }

public String getPhoneNumber() { return phoneNumber; }
public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

public String getDepartment() { return department; }
public void setDepartment(String department) { this.department = department; }

public boolean isActive() { return active; }
public void setActive(boolean active) { this.active = active; }
}