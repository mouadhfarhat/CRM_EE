package com.cmdpfe.gere_demande.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmdpfe.gere_demande.Entity.Client;
import com.cmdpfe.gere_demande.Entity.Demande;
import com.cmdpfe.gere_demande.Entity.DemandeStatut;
import com.cmdpfe.gere_demande.Entity.DemandeType;
import com.cmdpfe.gere_demande.Entity.DepartmentType;
import com.cmdpfe.gere_demande.Entity.Gestionnaire;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {

    // Find demandes shared with a specific gestionnaire
    List<Demande> findBySharedWithId(Long gestionnaireId);

    // Find gestionnaires by DemandeType department
    @Query("SELECT g FROM Gestionnaire g WHERE g.department = :department")
    List<Gestionnaire> findGestionnairesByDepartment(@Param("department") DemandeType department);

    // Find demandes by client
    List<Demande> findByClientId(Long clientId);

    // Find demandes assigned to a gestionnaire
    List<Demande> findByGestionnaireAssigneId(Long gestionnaireId);

    Optional<Demande> findById(Long id);

    // Returns clients who made a demande for a given formation, type, and statut
    @Query("SELECT d.client FROM Demande d " +
           "WHERE d.formation.id = :formationId " +
           "AND d.type = :type " +
           "AND d.statut = :statut")
    List<Client> findByEligibleClients(
        @Param("formationId") Long formationId,
        @Param("type") DemandeType type,
        @Param("statut") DemandeStatut statut
    );

    // Search demandes by various optional criteria
    @Query("SELECT d FROM Demande d " +
           "WHERE (:title IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:description IS NULL OR LOWER(d.description) LIKE LOWER(CONCAT('%', :description, '%'))) " +
           "AND (:clientName IS NULL OR LOWER(d.client.username) LIKE LOWER(CONCAT('%', :clientName, '%'))) " +
           "AND (:statut IS NULL OR d.statut = :statut) " +
           "AND (:type IS NULL OR d.type = :type)")
    List<Demande> searchDemandes(
        @Param("title") String title,
        @Param("description") String description,
        @Param("clientName") String clientName,
        @Param("statut") DemandeStatut statut,
        @Param("type") DemandeType type
    );

    // Search demandes assigned to a gestionnaire with filters
    @Query("SELECT d FROM Demande d WHERE " +
           "d.gestionnaireAssigne.id = :gestionnaireId AND " +
           "(:title IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:description IS NULL OR LOWER(d.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
           "(:clientName IS NULL OR LOWER(d.client.username) LIKE LOWER(CONCAT('%', :clientName, '%'))) AND " +
           "(:statut IS NULL OR d.statut = :statut) AND " +
           "(:type IS NULL OR d.type = :type)")
    List<Demande> searchByGestionnaire(
        @Param("gestionnaireId") Long gestionnaireId,
        @Param("title") String title,
        @Param("description") String description,
        @Param("clientName") String clientName,
        @Param("statut") DemandeStatut statut,
        @Param("type") DemandeType type
    );

    // Filter demandes by formation and type with DONE status
    @Query("SELECT DISTINCT d.client FROM Demande d " +
           "WHERE d.formation.id = :formationId " +
           "AND d.type = :type " +
           "AND d.statut = com.cmdpfe.gere_demande.Entity.DemandeStatut.TERMINE")
    List<Client> findClientsByFormationAndTypeAndDoneStatus(
        @Param("formationId") Long formationId,
        @Param("type") DemandeType type
    );

    // Notify clients who requested by category and REJOINDRE type
    @Query("SELECT DISTINCT d.client FROM Demande d " +
           "WHERE d.type = com.cmdpfe.gere_demande.Entity.DemandeType.REJOINDRE " +
           "AND d.formation.category.id = :catId")
    List<Client> findClientsRequestingCategory(@Param("catId") Long categoryId);
}
