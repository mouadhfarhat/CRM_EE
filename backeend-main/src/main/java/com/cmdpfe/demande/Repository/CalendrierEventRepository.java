package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.CalendrierEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendrierEventRepository extends JpaRepository<CalendrierEvent, Long> {
    // You can add custom queries if needed
	
	
}
