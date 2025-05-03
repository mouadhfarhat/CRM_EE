package com.cmdpfe.demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.demande.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
}