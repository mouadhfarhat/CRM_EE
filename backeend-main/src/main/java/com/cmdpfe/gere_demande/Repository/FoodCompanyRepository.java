package com.cmdpfe.gere_demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.gere_demande.Entity.FoodCompany;

public interface FoodCompanyRepository extends JpaRepository<FoodCompany, Long> {
    List<FoodCompany> findByNameContainingIgnoreCase(String name);
}