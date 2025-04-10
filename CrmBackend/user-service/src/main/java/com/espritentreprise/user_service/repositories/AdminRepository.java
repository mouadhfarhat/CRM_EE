package com.espritentreprise.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.espritentreprise.user_service.models.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}

