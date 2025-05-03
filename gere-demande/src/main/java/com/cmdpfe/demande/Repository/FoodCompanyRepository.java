package com.cmdpfe.demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.demande.Entity.FoodCompany;

public interface FoodCompanyRepository extends JpaRepository<FoodCompany, Long> {
    List<FoodCompany> findByNameContainingIgnoreCase(String name);
}