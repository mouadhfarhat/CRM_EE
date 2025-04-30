package com.cmdpfe.gere_demande.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmdpfe.gere_demande.Entity.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
	


	    @Query("SELECT c FROM Client c WHERE (:username IS NULL OR LOWER(c.username) LIKE LOWER(CONCAT('%', :username, '%')))")
	    List<Client> searchClients(@Param("username") String username);
	

}
