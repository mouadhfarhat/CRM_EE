package com.cmdpfe.demande.config;

import com.cmdpfe.demande.jwt.CustomJwtConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
            		.ignoringRequestMatchers("/api/clients/register", "/sync-user")
                )
            .authorizeHttpRequests(authorize -> authorize
                // Public endpoints (no authentication)
                .requestMatchers("/sync-user").permitAll()  // Allow unauthenticated access to /sync-user
                .requestMatchers("/api/clients/register").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/formations", "/formations/search", "/formations/{id}").permitAll()
                .requestMatchers("/api/categories", "/api/categories/search").permitAll()
                // Authenticated endpoints
                .requestMatchers("/api/events/all", "/api/events/{id}").authenticated()
                .requestMatchers("/api/formateurs", "/api/formateurs/search").authenticated()
                .requestMatchers("/api/food-companies", "/api/food-companies/search").authenticated()
                .requestMatchers("/gestionnaires/me").authenticated()

                // Client-only endpoints
                .requestMatchers("/demandes/create").hasRole("CLIENT")
                .requestMatchers("/demandes/client/{clientId}").hasRole("CLIENT")
                .requestMatchers("/api/profile").hasRole("CLIENT")
                .requestMatchers("/api/notifications").hasRole("CLIENT")
                .requestMatchers("/api/client/formations").hasRole("CLIENT")
                .requestMatchers("/formations/{id}/like").hasRole("CLIENT")
                // Gestionnaire-only endpoints
                .requestMatchers("/demandes/gestionnaire/{gestionnaireId}",
                                "/demandes/gestionnaire/{gestionnaireId}/search",
                                "/demandes/shared-with/{gestionnaireId}").hasRole("GESTIONNAIRE")
                .requestMatchers("/demandes/{demandeId}/share/{gestionnaireId}",
                                "/demandes/{demandeId}/status").hasRole("GESTIONNAIRE")
                .requestMatchers("/demandes/unassigned").hasRole("GESTIONNAIRE")
                .requestMatchers("/demandes/{demandeId}/choose").hasRole("GESTIONNAIRE")
                
                // Admin-only endpoints
                .requestMatchers("/api/categories/**").hasRole("ADMIN")
                .requestMatchers("/api/formateurs/**").hasRole("ADMIN")
                .requestMatchers("/api/food-companies/**").hasRole("ADMIN")
                .requestMatchers("/api/reminders/**").hasRole("ADMIN")
                .requestMatchers("/demandes/all", "/demandes/{id}",
                                "/demandes/search", "/demandes/search2").hasRole("ADMIN")
                .requestMatchers("/demandes/update/{id}", "/demandes/delete/{id}").hasRole("ADMIN")
                .requestMatchers("/clients/**").hasRole("ADMIN")
                .requestMatchers("/api/events/**").hasRole("ADMIN")
                .requestMatchers("/formations/**").hasRole("ADMIN")
                .requestMatchers("/api/groups/**").hasRole("ADMIN")
                .requestMatchers("/gestionnaires/**").hasAnyAuthority("ADMIN", "GESTIONNAIRE")                // Default: require login
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