package com.espritentreprise.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.auth_service.model.User;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
} 
