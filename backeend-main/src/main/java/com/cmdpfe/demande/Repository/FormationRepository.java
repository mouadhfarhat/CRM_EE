package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.Formation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
	
    @Query("SELECT f FROM Formation f WHERE (:title IS NULL OR LOWER(f.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    List<Formation> searchFormations(@Param("title") String title);


    @Query("SELECT f FROM Formation f LEFT JOIN FETCH f.groups g LEFT JOIN FETCH g.clients WHERE f.dateDebut = :date")
    List<Formation> findByDateDebutWithGroups(@Param("date") LocalDate date);
    
    @Query("SELECT f FROM Formation f WHERE f.registrationEndDate <= :today AND :today < f.dateDebut")
    List<Formation> findFormationsEligibleForGroups(@Param("today") LocalDate today);

}
