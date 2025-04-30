package com.cmdpfe.gere_demande.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.cmdpfe.gere_demande.Entity.Formateur;
import com.cmdpfe.gere_demande.Repository.FormateurRepository;

@RestController
@RequestMapping("/api/formateurs")
public class FormateurController {

    @Autowired
    private FormateurRepository formateurRepository;

    @PostMapping
    public Formateur createFormateur(@RequestBody Formateur formateur) {
        return formateurRepository.save(formateur);
    }

    @GetMapping
    public List<Formateur> getAllFormateurs() {
        return formateurRepository.findAll();
    }

    @GetMapping("/search")
    public List<Formateur> searchFormateurs(@RequestParam("query") String query) {
        return formateurRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(query, query);
    }

    @PutMapping("/{id}")
    public Formateur updateFormateur(@PathVariable Long id, @RequestBody Formateur updatedFormateur) {
        Formateur formateur = formateurRepository.findById(id).orElseThrow();
        formateur.setFirstname(updatedFormateur.getFirstname());
        formateur.setLastname(updatedFormateur.getLastname());
        formateur.setEmail(updatedFormateur.getEmail());
        formateur.setPhoneNumber(updatedFormateur.getPhoneNumber());
        return formateurRepository.save(formateur);
    }

    @DeleteMapping("/{id}")
    public void deleteFormateur(@PathVariable Long id) {
        formateurRepository.deleteById(id);
    }
}