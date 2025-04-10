package com.espritentreprise.user_service.models;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Gestionnaire extends User {
    @ElementCollection
    private List<Long> assignedDemandeIds = new ArrayList<>();

    // Gestionnaire-specific methods working with demande IDs.
    public void updateDemandeStatus(Long demandeId, String status) {
        // Logic to update the status of the demande.
        // E.g., call demande-service API to update the demande status.
    }

    public void transferDemande(Long demandeId, Gestionnaire targetGestionnaire) {
        // Logic to transfer the demande to a different gestionnaire.
        // E.g., update demande assignment by calling the demande-service.
    }
}
