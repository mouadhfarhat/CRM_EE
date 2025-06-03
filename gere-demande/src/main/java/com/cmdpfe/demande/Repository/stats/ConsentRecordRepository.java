package com.cmdpfe.demande.Repository.stats;

import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Entity.statistic.ConsentRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 1. Consent Record Repository
@Repository
public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, Long> {
    
    Optional<ConsentRecord> findByClient(Client client);
    
    Optional<ConsentRecord> findBySessionHash(String sessionHash);
    
    @Query("SELECT c FROM ConsentRecord c WHERE c.retentionExpiry < :now")
    List<ConsentRecord> findExpiredConsents(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM ConsentRecord c WHERE c.client = :client AND c.consentGiven = true")
    Optional<ConsentRecord> findActiveConsentByClient(@Param("client") Client client);
    
    @Query("SELECT c FROM ConsentRecord c WHERE c.sessionHash = :sessionHash AND c.consentGiven = true")
    Optional<ConsentRecord> findActiveConsentBySessionHash(@Param("sessionHash") String sessionHash);
}