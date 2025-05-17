package com.cmdpfe.demande.config;

import com.cmdpfe.demande.jwt.CustomJwtConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/clients/register", "/sync-user", "/api/usersk/me")
            )
            .authorizeHttpRequests(authorize -> authorize
                // Allow all CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public endpoints (no authentication)
                .requestMatchers("/sync-user").permitAll()
                .requestMatchers("/api/clients/register").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/formations", "/formations/search", "/formations/{id}").permitAll()
                .requestMatchers("/api/categories", "/api/categories/search").permitAll()

                // New endpoints for serving images and PDFs
                .requestMatchers(HttpMethod.GET, "/formations/images/{fileName}").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers(HttpMethod.GET, "/formations/files/{fileName}").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")

                // Authenticated endpoints
                .requestMatchers("/api/events/all", "/api/events/{id}").authenticated()
                .requestMatchers("/api/formateurs", "/api/formateurs/search").authenticated()
                .requestMatchers("/api/food-companies", "/api/food-companies/search").authenticated()
                .requestMatchers("/gestionnaires/me").authenticated()
                .requestMatchers("/demandes/my").hasRole("CLIENT")
                .requestMatchers("/demandes/historique").hasRole("CLIENT")
                .requestMatchers("/formations/{id}/interest").hasRole("CLIENT")
                .requestMatchers("/formations/interested").hasRole("CLIENT")
                .requestMatchers("/formations/by-category/{categoryId}").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers("/demandes/update-full/{id}").hasRole("CLIENT")

                
                



                .requestMatchers("/demandes/{id}/rate").hasRole("CLIENT")
                .requestMatchers("/api/clients/by-username/{username}").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers("/api/users/me/{id}/formations/count").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers("/api/users/me/{id}/demandes/count").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")

                // Your count endpoints
                .requestMatchers("/api/users/me/demandes/count").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers("/api/users/me/formations/count").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")

                // Client-only endpoints
                .requestMatchers("/demandes/create").hasRole("CLIENT")
                .requestMatchers("/demandes/client/{clientId}").hasRole("CLIENT")
                .requestMatchers("/api/profile").hasRole("CLIENT")
                .requestMatchers("/api/notifications").hasRole("CLIENT")
                .requestMatchers("/api/client/formations").hasRole("CLIENT")
                .requestMatchers("/formations/{id}/like").hasRole("CLIENT")
                .requestMatchers(HttpMethod.PUT, "/api/usersk/me").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")

                // Gestionnaire-only endpoints
                .requestMatchers(
                    "/demandes/gestionnaire/{gestionnaireId}",
                    "/demandes/gestionnaire/{gestionnaireId}/search",
                    "/demandes/shared-with/{gestionnaireId}"
                ).hasRole("GESTIONNAIRE")
                .requestMatchers(
                    "/demandes/{demandeId}/share/{gestionnaireId}",
                    "/demandes/{demandeId}/status"
                ).hasRole("GESTIONNAIRE")
                .requestMatchers("/demandes/unassigned").hasRole("GESTIONNAIRE")
                .requestMatchers("/demandes/{demandeId}/choose").hasRole("GESTIONNAIRE")

                // Admin-only endpoints
                .requestMatchers("/api/categories/**").hasRole("ADMIN")
                .requestMatchers("/api/formateurs/**").hasRole("ADMIN")
                .requestMatchers("/api/food-companies/**").hasRole("ADMIN")
                .requestMatchers("/api/reminders/**").hasRole("ADMIN")
                .requestMatchers(
                    "/demandes/all",
                    "/demandes/{id}",
                    "/demandes/search",
                    "/demandes/search2"
                ).hasRole("ADMIN")
                .requestMatchers(
                    "/demandes/update/{id}",
                    "/demandes/delete/{id}"
                ).hasRole("CLIENT")
                .requestMatchers("/api/clients/**").hasAnyRole("ADMIN", "GESTIONNAIRE", "CLIENT")
                .requestMatchers("/api/events/**").hasAnyRole("ADMIN", "GESTIONNAIRE")
                .requestMatchers("/formations/**").hasAnyRole("ADMIN", "GESTIONNAIRE")
                .requestMatchers("/api/groups/**").hasAnyRole("ADMIN", "GESTIONNAIRE")
                .requestMatchers("/gestionnaires/**").hasRole("GESTIONNAIRE")
                .requestMatchers("/formations/{id}/stats").hasAnyRole("ADMIN", "GESTIONNAIRE")

                // Count clients in a formation
                .requestMatchers(HttpMethod.GET, "/api/formations/{id}/clients/count")
                    .hasAnyRole("ADMIN", "GESTIONNAIRE")

                // Search groups by name
                .requestMatchers(HttpMethod.GET, "/api/groups/searchByName")
                    .hasAnyRole("ADMIN", "GESTIONNAIRE")

                // Count clients in a group
                .requestMatchers(HttpMethod.GET, "/api/groups/{groupId}/clients/count")
                    .hasAnyRole("ADMIN", "GESTIONNAIRE")

                // Get clients by formation
                .requestMatchers(HttpMethod.GET, "/api/clients/by-formation/{formationId}")
                    .hasAnyRole("ADMIN", "GESTIONNAIRE")

                // Get clients by group
                .requestMatchers(HttpMethod.GET, "/api/clients/by-group/{groupId}")
                    .hasAnyRole("ADMIN", "GESTIONNAIRE")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(customJwtConverter()))
            );

        return http.build();
    }

    @Bean
    public CustomJwtConverter customJwtConverter() {
        return new CustomJwtConverter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}