package com.cmdpfe.gere_demande.Repository;

import com.cmdpfe.gere_demande.Entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
    Optional<SuperAdmin> findByUsername(String username);
    Optional<SuperAdmin> findByEmail(String email);
}