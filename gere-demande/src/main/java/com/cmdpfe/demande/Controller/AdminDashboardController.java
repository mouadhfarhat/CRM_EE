package com.cmdpfe.demande.Controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmdpfe.demande.Entity.DashboardStatsDTO;
import com.cmdpfe.demande.Entity.*;
import com.cmdpfe.demande.Repository.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final FormationRepository formationRepository;
    private final ClientGroupRepository groupRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    private final DemandeRepository demandeRepository;

    @Autowired
    public AdminDashboardController(
            FormationRepository formationRepository,
            ClientGroupRepository groupRepository,
            ClientRepository clientRepository,
            CategoryRepository categoryRepository,
            DemandeRepository demandeRepository
    ) {
        this.formationRepository = formationRepository;
        this.groupRepository = groupRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.demandeRepository = demandeRepository;
    }

    @GetMapping("/cards")
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalFormations(formationRepository.count());
        stats.setTotalGroups(groupRepository.count());
        stats.setTotalClients(clientRepository.count());
        stats.setTotalCategories(categoryRepository.count());
        stats.setTotalDemandes(demandeRepository.count());
        stats.setTotalReclamationDemandes(
            demandeRepository.countByType(DemandeType.RECLAMATION)
        );
        return stats;
    }
    
    
    @GetMapping("/revenue-per-month")
    public ResponseEntity<Map<String, Double>> getMonthlyRevenue(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<Demande> demandes = demandeRepository.findByStatutAndType(DemandeStatut.TERMINE, DemandeType.REJOINDRE);

        Map<String, Double> revenueByMonth = new TreeMap<>();

        for (Demande demande : demandes) {
            if (demande.getCreatedAt() == null || demande.getFormation() == null || demande.getFormation().getPrice() == null)
                continue;

            // Apply date range filter
            if (startDate != null && demande.getCreatedAt().isBefore(startDate)) continue;
            if (endDate != null && demande.getCreatedAt().isAfter(endDate)) continue;

            String month = demande.getCreatedAt().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            revenueByMonth.put(month, revenueByMonth.getOrDefault(month, 0.0) + demande.getFormation().getPrice());
        }

        return ResponseEntity.ok(revenueByMonth);
    }

    
    
    @GetMapping("/demandes-over-time")
    public ResponseEntity<Map<String, Map<String, Long>>> getDemandesOverTime() {
        List<Demande> allDemandes = demandeRepository.findAll();
        Map<String, Map<String, Long>> result = new TreeMap<>(); // month -> {status -> count}

        for (Demande demande : allDemandes) {
            if (demande.getCreatedAt() == null) continue;

            String month = demande.getCreatedAt().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            String status = demande.getStatut().name();

            result.putIfAbsent(month, new HashMap<>());
            Map<String, Long> statusMap = result.get(month);
            statusMap.put(status, statusMap.getOrDefault(status, 0L) + 1);
        }

        return ResponseEntity.ok(result);
    }

    
    @GetMapping("/category-distribution")
    public ResponseEntity<Map<String, Long>> getCategoryDistribution() {
        List<Formation> formations = formationRepository.findAll();
        Map<String, Long> categoryCount = new HashMap<>();

        for (Formation formation : formations) {
            if (formation.getCategory() != null) {
                String categoryName = formation.getCategory().getName();
                categoryCount.put(categoryName, categoryCount.getOrDefault(categoryName, 0L) + 1);
            }
        }

        return ResponseEntity.ok(categoryCount);
    }

    
    
    @GetMapping("/formations-per-formateur")
    public ResponseEntity<Map<String, Long>> getFormationsPerFormateur() {
        List<Formation> formations = formationRepository.findAll();
        Map<String, Long> result = new HashMap<>();

        for (Formation formation : formations) {
            if (formation.getFormateur() != null) {
                String formateurName = formation.getFormateur().getFirstname() + " " + formation.getFormateur().getLastname();
                result.put(formateurName, result.getOrDefault(formateurName, 0L) + 1);
            }
        }

        return ResponseEntity.ok(result);
    }

    
    @GetMapping("/top-formations-revenue")
    public ResponseEntity<List<Map<String, Object>>> getTopRevenueFormations() {
        List<Demande> demandes = demandeRepository.findByStatutAndType(DemandeStatut.TERMINE, DemandeType.REJOINDRE);
        Map<String, Double> revenueMap = new HashMap<>();

        for (Demande demande : demandes) {
            Formation formation = demande.getFormation();
            if (formation != null && formation.getPrice() != null) {
                String title = formation.getTitle();
                revenueMap.put(title, revenueMap.getOrDefault(title, 0.0) + formation.getPrice());
            }
        }

        // Sort and take top 3
        List<Map<String, Object>> top3 = revenueMap.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(3)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", entry.getKey());
                    map.put("revenue", entry.getValue());
                    return map;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(top3);
    }

    
    @GetMapping("/demandes-by-category-status")
    public ResponseEntity<Map<String, Map<String, Long>>> getDemandesByCategoryAndStatus() {
        List<Demande> demandes = demandeRepository.findAll();
        Map<String, Map<String, Long>> result = new HashMap<>();

        for (Demande demande : demandes) {
            if (demande.getFormation() == null || demande.getFormation().getCategory() == null) continue;

            String categoryName = demande.getFormation().getCategory().getName();
            String status = demande.getStatut().name();

            result.putIfAbsent(categoryName, new HashMap<>());
            Map<String, Long> statusMap = result.get(categoryName);
            statusMap.put(status, statusMap.getOrDefault(status, 0L) + 1);
        }

        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/gestionnaire-demande-count")
    public ResponseEntity<Map<String, Long>> getGestionnaireDemandeCount() {
        List<Demande> demandes = demandeRepository.findAll();
        Map<String, Long> result = new HashMap<>();

        for (Demande demande : demandes) {
            if (demande.getGestionnaireAssigne() != null) {
                String name = demande.getGestionnaireAssigne().getFirstname() + " " + demande.getGestionnaireAssigne().getLastname();
                result.put(name, result.getOrDefault(name, 0L) + 1);
            }
        }

        return ResponseEntity.ok(result);
    }


    @GetMapping(value = "/export/revenue.csv", produces = "text/csv")
    public void exportRevenueCsv(HttpServletResponse response) throws IOException {
        List<Demande> demandes = demandeRepository.findByStatutAndType(DemandeStatut.TERMINE, DemandeType.REJOINDRE);

        response.setHeader("Content-Disposition", "attachment; filename=revenue.csv");
        PrintWriter writer = response.getWriter();
        writer.println("Month,Revenue");

        Map<String, Double> revenueMap = new TreeMap<>();
        for (Demande demande : demandes) {
            if (demande.getCreatedAt() == null || demande.getFormation() == null || demande.getFormation().getPrice() == null)
                continue;
            String month = demande.getCreatedAt().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            revenueMap.put(month, revenueMap.getOrDefault(month, 0.0) + demande.getFormation().getPrice());
        }

        for (Map.Entry<String, Double> entry : revenueMap.entrySet()) {
            writer.println(entry.getKey() + "," + entry.getValue());
        }
        writer.flush();
    }



}
