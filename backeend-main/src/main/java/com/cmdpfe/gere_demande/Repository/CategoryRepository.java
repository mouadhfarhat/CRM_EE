package com.cmdpfe.gere_demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.gere_demande.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
}