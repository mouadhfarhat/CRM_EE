package com.cmdpfe.demande.Repository.stats;

import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.statistic.UserInteraction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    
    List<UserInteraction> findByClientOrderByInteractionDateDesc(Client client);
    
    List<UserInteraction> findBySessionHashOrderByInteractionDateDesc(String sessionHash);
    
    // Simple analytics queries for basic stats
    
    @Query("SELECT ui.formationId, COUNT(ui), COUNT(DISTINCT ui.sessionHash), AVG(ui.durationSeconds) " +
           "FROM UserInteraction ui " +
           "WHERE ui.formationId IS NOT NULL AND ui.interactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY ui.formationId " +
           "ORDER BY COUNT(ui) DESC")
    List<Object[]> getFormationPopularityMetrics(@Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ui.categoryId, COUNT(ui), COUNT(DISTINCT ui.sessionHash), AVG(ui.scrollDepthPercentage) " +
           "FROM UserInteraction ui " +
           "WHERE ui.categoryId IS NOT NULL AND ui.interactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY ui.categoryId " +
           "ORDER BY COUNT(ui) DESC")
    List<Object[]> getCategoryEngagementMetrics(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Click heatmap data - simplified
    @Query("SELECT ui.clickX, ui.clickY, ui.elementSelector " +
           "FROM UserInteraction ui " +
           "WHERE ui.pageUrl = :pageUrl AND ui.interactionType = 'CLICK' " +
           "AND ui.interactionDate BETWEEN :startDate AND :endDate " +
           "AND ui.clickX IS NOT NULL AND ui.clickY IS NOT NULL")
    List<Object[]> getClickHeatmapData(@Param("pageUrl") String pageUrl,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
    
    // Overall dashboard stats - simple counts
    @Query("SELECT " +
           "COUNT(ui) as totalInteractions, " +
           "COUNT(DISTINCT ui.sessionHash) as uniqueSessions, " +
           "AVG(ui.durationSeconds) as avgDuration, " +
           "COUNT(CASE WHEN ui.interactionType = 'CLICK' THEN 1 END) as totalClicks, " +
           "COUNT(CASE WHEN ui.interactionType = 'PAGE_VIEW' THEN 1 END) as totalPageViews " +
           "FROM UserInteraction ui " +
           "WHERE ui.interactionDate BETWEEN :startDate AND :endDate")
    Object[] getDashboardMetrics(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
    
    // Formation specific stats
    @Query("SELECT " +
           "COUNT(ui) as totalInteractions, " +
           "COUNT(DISTINCT ui.sessionHash) as uniqueUsers, " +
           "AVG(ui.durationSeconds) as avgDuration, " +
           "COUNT(CASE WHEN ui.interactionType = 'CLICK' THEN 1 END) as totalClicks " +
           "FROM UserInteraction ui " +
           "WHERE ui.formationId = :formationId " +
           "AND ui.interactionDate BETWEEN :startDate AND :endDate")
    Object[] getFormationStats(@Param("formationId") Long formationId,
                               @Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);
    
    // Category specific stats
    @Query("SELECT " +
           "COUNT(ui) as totalInteractions, " +
           "COUNT(DISTINCT ui.sessionHash) as uniqueUsers, " +
           "AVG(ui.durationSeconds) as avgDuration, " +
           "COUNT(CASE WHEN ui.interactionType = 'CLICK' THEN 1 END) as totalClicks " +
           "FROM UserInteraction ui " +
           "WHERE ui.categoryId = :categoryId " +
           "AND ui.interactionDate BETWEEN :startDate AND :endDate")
    Object[] getCategoryStats(@Param("categoryId") Long categoryId,
                              @Param("startDate") LocalDateTime startDate, 
                              @Param("endDate") LocalDateTime endDate);
}