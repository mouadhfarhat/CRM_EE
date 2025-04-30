package com.cmdpfe.gere_demande.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmdpfe.gere_demande.Entity.Formation;


@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
	
    @Query("SELECT f FROM Formation f WHERE (:title IS NULL OR LOWER(f.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    List<Formation> searchFormations(@Param("title") String title);


    @Query("SELECT f FROM Formation f LEFT JOIN FETCH f.groups g LEFT JOIN FETCH g.clients WHERE f.dateDebut = :date")
    List<Formation> findByDateDebutWithGroups(@Param("date") LocalDate date);
    
    @Query("SELECT f FROM Formation f WHERE f.registrationEndDate <= :today AND :today < f.dateDebut")
    List<Formation> findFormationsEligibleForGroups(@Param("today") LocalDate today);
    
    @Query("SELECT f.name FROM Formation f WHERE LOWER(f.category.name) = LOWER(:categoryName)")
    List<String> findNamesByCategory(@Param("categoryName") String categoryName);

        // Check if a formation exists by name
        boolean existsByNameContainingIgnoreCase(String name);
        
        // Any other methods you need for formation queries
    }



