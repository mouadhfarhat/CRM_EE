package com.cmdpfe.gere_demande.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.gere_demande.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	
	
}

