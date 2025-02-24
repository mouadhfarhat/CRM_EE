package repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import models.Formation;

public interface FormationRepository extends JpaRepository<Formation, Long> {
	
}