package com.espritentreprise.user_service.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.user_service.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
