package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDemandeId(Long demandeId);
}
