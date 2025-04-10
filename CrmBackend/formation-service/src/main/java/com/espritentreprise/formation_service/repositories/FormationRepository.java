package com.espritentreprise.formation_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.formation_service.models.Formation;

public interface FormationRepository extends JpaRepository<Formation, Long> {
	
}