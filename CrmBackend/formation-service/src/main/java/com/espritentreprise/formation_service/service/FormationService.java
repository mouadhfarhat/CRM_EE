package com.espritentreprise.formation_service.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.espritentreprise.formation_service.dto.User;
import com.espritentreprise.formation_service.feign.UserServiceClient;
import com.espritentreprise.formation_service.models.Formation;
import com.espritentreprise.formation_service.repositories.FormationRepository;


@Service
public class FormationService {

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    public Formation createFormation(Formation formation, Long userId) {
        // Optional: Validate user via UserService
        User user = userServiceClient.getUserById(userId);

        // Business logic using user info if needed
        return formationRepository.save(formation);
    }
}
