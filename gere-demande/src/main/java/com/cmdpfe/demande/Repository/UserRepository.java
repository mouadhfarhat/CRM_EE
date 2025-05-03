package com.cmdpfe.demande.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmdpfe.demande.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

	
}

