package com.cmdpfe.demande.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.demande.Entity.Rating;

public interface RatingRepository extends JpaRepository<Rating,Long> {
  Optional<Rating> findByClient_IdAndFormation_Id(Long clientId, Long formationId);
  List<Rating> findByFormation_Id(Long formationId);
  List<Rating> findByClient_Id(Long clientId);

}
