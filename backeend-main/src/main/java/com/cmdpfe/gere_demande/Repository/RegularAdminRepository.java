package com.cmdpfe.gere_demande.Repository;

import com.cmdpfe.gere_demande.Entity.RegularAdmin;
import com.cmdpfe.gere_demande.Entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegularAdminRepository extends JpaRepository<RegularAdmin, Long> {
    Optional<RegularAdmin> findByUsername(String username);
    Optional<RegularAdmin> findByEmail(String email);
    List<RegularAdmin> findByCreatedBy(SuperAdmin createdBy);
    List<RegularAdmin> findByDepartment(String department);
}