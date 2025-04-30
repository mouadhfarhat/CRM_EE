package com.cmdpfe.gere_demande.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cmdpfe.gere_demande.Entity.CalendrierEvent;  // your entity class

@Repository       // optional, but explicit
public interface CalendrierEventRepository extends JpaRepository<CalendrierEvent, Long> {
  // you can add custom query methods here
}
