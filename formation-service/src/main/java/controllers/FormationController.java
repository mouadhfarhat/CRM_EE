package controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import models.Formation;
import repositories.FormationRepository;

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
        Formation formation = formationRepository.findById(id).orElseThrow(() -> new RuntimeException("Formation not found"));
        formation.setTitre(formationDetails.getTitre());
        formation.setDescription(formationDetails.getDescription());
        formation.setDateDebut(formationDetails.getDateDebut());
        formation.setDateFin(formationDetails.getDateFin());
        formation.setDomaine(formationDetails.getDomaine());
        return formationRepository.save(formation);
    }

    @DeleteMapping("/{id}")
    public void deleteFormation(@PathVariable Long id) {
        formationRepository.deleteById(id);
    }
}