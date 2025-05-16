package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.Client;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
	


	    @Query("SELECT c FROM Client c WHERE (:username IS NULL OR LOWER(c.username) LIKE LOWER(CONCAT('%', :username, '%')))")
	    List<Client> searchClients(@Param("username") String username);

//		Optional<Client> findBysecondEmail(String email);

		boolean existsByEmail(String email);
	    Client findByEmail(String email);	
	    Client findByKeycloakId(String keycloakId);

		Optional<Client> findByUsername(String username);

		@Query("SELECT COUNT(c) FROM Client c JOIN c.interested f WHERE f.id = :formationId")
		long countByFormationId(@Param("formationId") Long formationId);

		@Query("SELECT c FROM Client c JOIN c.interested f WHERE f.id = :formationId")
		List<Client> findByFormationId(@Param("formationId") Long formationId);

		@Query("SELECT c FROM Client c JOIN c.groups g WHERE g.id = :groupId")
		List<Client> findByGroupId(@Param("groupId") Long groupId);



}
