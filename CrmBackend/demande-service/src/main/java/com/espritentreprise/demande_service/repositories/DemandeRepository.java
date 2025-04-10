package com.espritentreprise.demande_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.demande_service.models.Demande;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
}