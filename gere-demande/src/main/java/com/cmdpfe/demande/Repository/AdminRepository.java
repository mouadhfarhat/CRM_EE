package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.Admin;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByKeycloakId(String keycloakId);
    Optional<Admin> findByUsername(String username);

}