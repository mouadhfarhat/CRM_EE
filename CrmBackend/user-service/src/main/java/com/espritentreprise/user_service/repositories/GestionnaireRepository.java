package com.espritentreprise.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.espritentreprise.user_service.models.Gestionnaire;


public interface GestionnaireRepository extends JpaRepository<Gestionnaire, Long> {
}