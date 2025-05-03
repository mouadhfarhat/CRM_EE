package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.Gestionnaire;
import com.cmdpfe.demande.Repository.GestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
	@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/gestionnaires")
public class GestionnaireController {

    @Autowired
    private GestionnaireRepository gestionnaireRepository;

    // Get all gestionnaires
    @GetMapping
    public List<Gestionnaire> getAllGestionnaires() {
        return gestionnaireRepository.findAll();
    }

    // Get gestionnaire by ID
    @GetMapping("/{id}")
    public Optional<Gestionnaire> getGestionnaireById(@PathVariable Long id) {
        return gestionnaireRepository.findById(id);
    }

    // Create new gestionnaire
    @PostMapping
    public Gestionnaire createGestionnaire(@RequestBody Gestionnaire gestionnaire) {
        return gestionnaireRepository.save(gestionnaire);
    }

    // Update gestionnaire
    @PutMapping("/{id}")
    public Gestionnaire updateGestionnaire(@PathVariable Long id, @RequestBody Gestionnaire updatedGestionnaire) {
        return gestionnaireRepository.findById(id)
                .map(gestionnaire -> {
                    gestionnaire.setUsername(updatedGestionnaire.getUsername());
                    gestionnaire.setEmail(updatedGestionnaire.getEmail());
                    gestionnaire.setDepartment(updatedGestionnaire.getDepartment());
                    return gestionnaireRepository.save(gestionnaire);
                })
                .orElseThrow(() -> new RuntimeException("Gestionnaire not found"));
    }

    // Delete gestionnaire
    @DeleteMapping("/{id}")
    public void deleteGestionnaire(@PathVariable Long id) {
        gestionnaireRepository.deleteById(id);
    }
}
