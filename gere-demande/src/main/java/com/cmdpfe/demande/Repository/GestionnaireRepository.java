package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.DemandeType;
import com.cmdpfe.demande.Entity.DepartmentType;
import com.cmdpfe.demande.Entity.Gestionnaire;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GestionnaireRepository extends JpaRepository<Gestionnaire, Long> {
    //List<Gestionnaire> findByDepartment(DemandeType department);
    List<Gestionnaire> findByDepartment(DemandeType type);
    List<Gestionnaire> findByDepartment(DepartmentType departmentType);
    Gestionnaire findByKeycloakId(String keycloakId);
    Optional<Gestionnaire> findByEmail(String email);
    
}
