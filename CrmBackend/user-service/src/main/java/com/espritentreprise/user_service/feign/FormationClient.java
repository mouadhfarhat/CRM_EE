package com.espritentreprise.user_service.feign;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "formation-service")
public interface FormationClient {
    @GetMapping("/formations/{id}")
    FormationDto getFormationById(@PathVariable("id") Long id);
}
