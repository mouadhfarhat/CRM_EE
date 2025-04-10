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
public class Client extends User {
    private String domain;

    // Instead of storing Formation objects, store their IDs.
    @ElementCollection
    private List<Long> history = new ArrayList<>();

    @ElementCollection
    private List<Long> favorites = new ArrayList<>();

    // Client-specific methods using formation IDs.
    public void requestToJoin(Long formationId) {
        // Logic to create a demande using the formationId reference.
        // For instance, you might call an external service to create a demande.
    }

    public void addFavorite(Long formationId) {
        if (!favorites.contains(formationId)) {
            favorites.add(formationId);
        }
    }
}
