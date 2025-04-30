package com.cmdpfe.gere_demande.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmdpfe.gere_demande.Entity.ClientGroup;

import java.util.List;
import java.util.Optional;

public interface ClientGroupRepository extends JpaRepository<ClientGroup, Long> {
    // Find all groups for a given formation
    @Query("SELECT g FROM ClientGroup g WHERE g.formation.id = :formationId")
    List<ClientGroup> findByFormationId(@Param("formationId") Long formationId);

    

}