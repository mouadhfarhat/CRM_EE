package com.espritentreprise.demande_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
//import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
//@EnableDiscoveryClient

@SpringBootApplication
@EnableFeignClients(basePackages = "com.espritentreprise.demande-service.feign") // adapt to your base package

public class DemandeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemandeServiceApplication.class, args);
	}

}
