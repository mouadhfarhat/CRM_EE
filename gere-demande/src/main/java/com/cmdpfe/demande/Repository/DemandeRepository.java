package com.cmdpfe.demande.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cmdpfe.demande.Entity.Client;
import com.cmdpfe.demande.Entity.Demande;
import com.cmdpfe.demande.Entity.DemandeStatut;
import com.cmdpfe.demande.Entity.DemandeType;
import com.cmdpfe.demande.Entity.DepartmentType;
import com.cmdpfe.demande.Entity.Gestionnaire;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {

    
	List<Demande> findBySharedWithId(Long gestionnaireId);

    @Query("SELECT g FROM Gestionnaire g WHERE g.department = :department")
    List<Gestionnaire> findGestionnairesByDepartment(@Param("department") DemandeType department);
    
    List<Demande> findByClientId(Long clientId);

    List<Demande> findByGestionnaireAssigneId(Long gestionnaireId);
    

    Optional<Demande> findById(Long id);
    List<Demande> findByGestionnaireAssigneIsNull();
    
    
    
    
    @Query("""
    		SELECT d.client
    		FROM Demande d
    		WHERE d.formation.id = :formationId
    		  AND d.type = :type
    		  AND d.statut = :statut
    		  AND d.client.id NOT IN (
    		    SELECT DISTINCT c.id
    		    FROM ClientGroup g
    		    JOIN g.clients c
    		    WHERE g.formation.id = :formationId
    		  )
    		""")
    	List<Client> findEligibleClients(@Param("formationId") Long formationId,
    	                                 @Param("type") DemandeType type,
    	                                 @Param("statut") DemandeStatut statut);

    
    /*
 // Returns clients who made a "rejoindre" demande and whose status is TERMINE
    @Query("SELECT d.client FROM Demande d " +
           "WHERE d.formation.id = :formationId " +
           "AND d.type = :type " +
           "AND d.statut = :statut")
    List<Client> findEligibleClients(
        @Param("formationId") Long formationId,
        @Param("type") DemandeType type,
        @Param("statut") DemandeStatut statut
    );*/

    @Query("SELECT g FROM Gestionnaire g WHERE g.department = :department")
    List<Gestionnaire> findGestionnairesByDepartment(@Param("department") DepartmentType department);
    
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

//search by gestionnaire demande
    
    @Query("SELECT d FROM Demande d WHERE " +
            "d.gestionnaireAssigne.id = :gestionnaireId AND " +
            "(:title IS NULL OR d.title LIKE %:title%) AND " +
            "(:description IS NULL OR d.description LIKE %:description%) AND " +
            "(:clientName IS NULL OR d.client.username LIKE %:clientName%) AND " +
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
    
    
    // filter demande by formation id and the type of demande ,status = done 
    
    @Query("SELECT DISTINCT d.client FROM Demande d " +
            "WHERE d.formation.id = :formationId " +
            "AND d.type = :type " +
            "AND d.statut = 'TERMINE'")
     List<Client> findClientsByFormationAndTypeAndDoneStatus(
         @Param("formationId") Long formationId,
         @Param("type") DemandeType type
     );
    
    
    
    //notify the client to a new formation 
    @Query("""
    	      SELECT DISTINCT d.client 
    	        FROM Demande d 
    	       WHERE d.type = com.cmdpfe.demande.Entity.DemandeType.REJOINDRE
    	         AND d.formation.category.id = :catId
    	    """)
    	    List<Client> findClientsRequestingCategory(@Param("catId") Long categoryId);
    long countByClient_KeycloakId(String keycloakId);
    
    List<Demande> findByClient_IdOrderByCreatedAtDesc(Long clientId);

    
    //historique 
    List<Demande> findByClientIdAndType(Long clientId, DemandeType type);

	long countByClient_Id(Long id);
	
	@Query("""
		    SELECT d FROM Demande d
		    WHERE LOWER(d.client.username) LIKE LOWER(CONCAT('%', :username, '%'))
		""")
		List<Demande> searchDemandesByClientUsername(@Param("username") String username);

	
	
	@Query("""
		    SELECT d FROM Demande d
		    WHERE LOWER(d.gestionnaireAssigne.username) LIKE LOWER(CONCAT('%', :username, '%'))
		""")
		List<Demande> searchDemandesByGestionnaireUsername(@Param("username") String username);


}

