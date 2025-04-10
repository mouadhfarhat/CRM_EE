package com.espritentreprise.user_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "demande-service")
public interface DemandeClient {
    @PostMapping("/demandes")
    DemandeDto createDemande(@RequestBody DemandeRequest request);
}
