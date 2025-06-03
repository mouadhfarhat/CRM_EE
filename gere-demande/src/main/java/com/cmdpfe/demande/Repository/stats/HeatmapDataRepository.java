package com.cmdpfe.demande.Repository.stats;


import com.cmdpfe.demande.Entity.statistic.HeatmapData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface HeatmapDataRepository extends JpaRepository<HeatmapData, Long> {
    
    Optional<HeatmapData> findByPageUrl(String pageUrl);
    
    Optional<HeatmapData> findByFormationId(Long formationId);
    
    List<HeatmapData> findByCategoryId(Long categoryId);
    
    @Query("SELECT h FROM HeatmapData h ORDER BY h.totalViews DESC")
    List<HeatmapData> findMostPopularPages();
}