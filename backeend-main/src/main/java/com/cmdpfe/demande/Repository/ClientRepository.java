package com.cmdpfe.demande.Repository;

import com.cmdpfe.demande.Entity.Client;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
	


	    @Query("SELECT c FROM Client c WHERE (:username IS NULL OR LOWER(c.username) LIKE LOWER(CONCAT('%', :username, '%')))")
	    List<Client> searchClients(@Param("username") String username);
	

}
