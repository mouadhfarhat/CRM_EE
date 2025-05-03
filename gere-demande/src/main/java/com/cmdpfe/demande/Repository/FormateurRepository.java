package com.cmdpfe.demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.demande.Entity.Formateur;

public interface FormateurRepository extends JpaRepository	<Formateur, Long> {
    List<Formateur> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String firstname, String lastname);
}