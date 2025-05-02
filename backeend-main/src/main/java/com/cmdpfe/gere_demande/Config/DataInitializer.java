package com.cmdpfe.gere_demande.Config;

import com.cmdpfe.gere_demande.Entity.SuperAdmin;
import com.cmdpfe.gere_demande.Repository.SuperAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Autowired
    private SuperAdminRepository superAdminRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Create a default SuperAdmin if none exists
            if (superAdminRepository.count() == 0) {
                SuperAdmin superAdmin = new SuperAdmin(
                    "superadmin",
                    "super@admin.com",
                    "admin123",
                    "Super",
                    "Admin",
                    "123456789"
                );
                
                superAdminRepository.save(superAdmin);
                System.out.println("Default SuperAdmin created with username: superadmin and password: admin123");
            }
        };
    }
}