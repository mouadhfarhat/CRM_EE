package com.cmdpfe.demande.Repository.stats;

import org.springframework.stereotype.Repository;
import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.statistic.UserPreference;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository <UserPreference, Long> {
    
    Optional<UserPreference> findByClient(Client client);
    
    Optional<UserPreference> findBySessionHash(String sessionHash);
    
    @Query("SELECT p FROM UserPreference p WHERE p.engagementScore > :minScore ORDER BY p.engagementScore DESC")
    List<UserPreference> findHighEngagementUsers(@Param("minScore") Double minScore);
}