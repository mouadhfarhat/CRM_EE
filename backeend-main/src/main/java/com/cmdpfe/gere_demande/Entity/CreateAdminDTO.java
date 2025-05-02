package com.cmdpfe.gere_demande.Entity;


//DTO for creating a new RegularAdmin
public class CreateAdminDTO {
 private String username;
 private String email;
 private String password;
 private String firstname;
 private String lastname;
 private String phoneNumber;
 private String department;
 
 // Getters and Setters
 public String getUsername() { return username; }
 public void setUsername(String username) { this.username = username; }
 
 public String getEmail() { return email; }
 public void setEmail(String email) { this.email = email; }
 
 public String getPassword() { return password; }
 public void setPassword(String password) { this.password = password; }
 
 public String getFirstname() { return firstname; }
 public void setFirstname(String firstname) { this.firstname = firstname; }
 
 public String getLastname() { return lastname; }
 public void setLastname(String lastname) { this.lastname = lastname; }
 
 public String getPhoneNumber() { return phoneNumber; }
 public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
 
 public String getDepartment() { return department; }
 public void setDepartment(String department) { this.department = department; }
}
