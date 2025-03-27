package com.espritentreprise.auth_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Value("${eureka.client.service-url.defaultZone}")
    private String eurekaServer;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
} 
