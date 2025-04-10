package com.espritentreprise.formation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.espritentreprise.formation_service.feign")
public class FormationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FormationServiceApplication.class, args);
    }
}
