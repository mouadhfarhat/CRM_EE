package com.espritentreprise.formation_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.espritentreprise.formation_service.models.Formation;
import com.espritentreprise.formation_service.repositories.FormationRepository;

import java.util.List;

@RestController
@RequestMapping("/formations")
public class FormationController {

    @Autowired
    private FormationRepository formationRepository;

    @GetMapping
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @PostMapping
    public Formation createFormation(@RequestBody Formation formation) {
        return formationRepository.save(formation);
    }

    @PutMapping("/{id}")
    public Formation updateFormation(@PathVariable Long id, @RequestBody Formation formationDetails) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found"));
        
        formation.setTitle(formationDetails.getTitle());
        formation.setDescription(formationDetails.getDescription());
        formation.setStartDate(formationDetails.getStartDate());
        formation.setEndDate(formationDetails.getEndDate());
        formation.setDomain(formationDetails.getDomain());
        formation.setAvailableSeats(formationDetails.getAvailableSeats());
        
        return formationRepository.save(formation);
    }

    @DeleteMapping("/{id}")
    public void deleteFormation(@PathVariable Long id) {
        formationRepository.deleteById(id);
    }
}
