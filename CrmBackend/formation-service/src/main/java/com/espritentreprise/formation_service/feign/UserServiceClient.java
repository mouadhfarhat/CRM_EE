package com.espritentreprise.formation_service.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.espritentreprise.formation_service.dto.User;


@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUserById(@PathVariable("id") long id);
}
