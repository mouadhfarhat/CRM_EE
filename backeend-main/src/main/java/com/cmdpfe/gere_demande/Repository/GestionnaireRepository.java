package com.cmdpfe.gere_demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmdpfe.gere_demande.Entity.DemandeType;
import com.cmdpfe.gere_demande.Entity.DepartmentType;
import com.cmdpfe.gere_demande.Entity.Gestionnaire;

@Repository
public interface GestionnaireRepository extends JpaRepository<Gestionnaire, Long> {
    //List<Gestionnaire> findByDepartment(DemandeType department);
    List<Gestionnaire> findByDepartment(DemandeType type);
    List<Gestionnaire> findByDepartment(DepartmentType departmentType);

}
