package com.espritentreprise.demande_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.espritentreprise.demande_service.models.Demande;
import com.espritentreprise.demande_service.repositories.DemandeRepository;

import java.util.List;

@RestController
@RequestMapping("/demandes")
public class DemandeController {

    @Autowired
    private DemandeRepository demandeRepository;

    @GetMapping
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    @PostMapping
    public Demande createDemande(@RequestBody Demande demande) {
        return demandeRepository.save(demande);
    }

    @PutMapping("/{id}")
    public Demande updateDemande(@PathVariable Long id, @RequestBody Demande demandeDetails) {
        Demande demande = demandeRepository.findById(id).orElseThrow(() -> new RuntimeException("Demande not found"));
        demande.setType(demandeDetails.getType());
        demande.setDescription(demandeDetails.getDescription());
        demande.setStatut(demandeDetails.getStatut());
        return demandeRepository.save(demande);
    }

    @DeleteMapping("/{id}")
    public void deleteDemande(@PathVariable Long id) {
        demandeRepository.deleteById(id);
    }
}