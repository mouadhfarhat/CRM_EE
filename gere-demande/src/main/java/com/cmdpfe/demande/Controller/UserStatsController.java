package com.cmdpfe.demande.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.cmdpfe.demande.Repository.DemandeRepository;
import com.cmdpfe.demande.Repository.FormationRepository;
import com.cmdpfe.demande.jwt.CustomJwt;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/users/me")
public class UserStatsController {

  @Autowired DemandeRepository demandeRepo;
  @Autowired FormationRepository formationRepo;

  private String currentKeycloakId() {
    CustomJwt jwt = (CustomJwt) SecurityContextHolder.getContext().getAuthentication();
    return jwt.getId();
  }
  
  @GetMapping("/{id}/demandes/count")
  public Map<String, Long> countDemandesByClientId(@PathVariable Long id) {
      long cnt = demandeRepo.countByClient_Id(id);
      return Map.of("count", cnt);
  }

  @GetMapping("/{id}/formations/count")
  public Map<String, Long> countFormationsByClientId(@PathVariable Long id) {
      long cnt = formationRepo.countByInterestedClients_Id(id);
      return Map.of("count", cnt);
  }


  @GetMapping("/demandes/count")
  public Map<String, Long> countDemandes() {
    long cnt = demandeRepo.countByClient_KeycloakId(currentKeycloakId());
    return Map.of("count", cnt);
  }

  @GetMapping("/formations/count")
  public Map<String, Long> countFormations() {
    long cnt = formationRepo.countByInterestedClients_KeycloakId(currentKeycloakId());
    return Map.of("count", cnt);
  }
}
