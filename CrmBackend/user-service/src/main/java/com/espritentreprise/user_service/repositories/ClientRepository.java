package com.espritentreprise.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.user_service.models.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {}

