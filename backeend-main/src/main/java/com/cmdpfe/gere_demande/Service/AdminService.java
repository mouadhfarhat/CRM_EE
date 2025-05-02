package com.cmdpfe.gere_demande.Service;

import com.cmdpfe.gere_demande.Entity.Admin;
import com.cmdpfe.gere_demande.Entity.RegularAdmin;
import com.cmdpfe.gere_demande.Entity.SuperAdmin;
import com.cmdpfe.gere_demande.Exception.AccessDeniedException;
import com.cmdpfe.gere_demande.Exception.AdminNotFoundException;
import com.cmdpfe.gere_demande.Exception.AuthenticationException;
import com.cmdpfe.gere_demande.Repository.AdminRepository;
import com.cmdpfe.gere_demande.Repository.RegularAdminRepository;
import com.cmdpfe.gere_demande.Repository.SuperAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final RegularAdminRepository regularAdminRepository;
    private final SuperAdminRepository superAdminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository, 
                      RegularAdminRepository regularAdminRepository,
                      SuperAdminRepository superAdminRepository) {
        this.adminRepository = adminRepository;
        this.regularAdminRepository = regularAdminRepository;
        this.superAdminRepository = superAdminRepository;
    }

    // Authentication
    public Admin authenticate(String username, String password) throws AuthenticationException {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (password.equals(admin.getPassword()) && admin.isActive()) {
                // Update last login time
                admin.setLastLogin(new Date());
                adminRepository.save(admin);
                return admin;
            }
        }
        throw new AuthenticationException("Invalid credentials or account is deactivated");
    }
    
    // SuperAdmin operations for managing RegularAdmins
    public RegularAdmin createAdmin(RegularAdmin newAdmin, Long superAdminId) throws AccessDeniedException {
        SuperAdmin superAdmin = getSuperAdminById(superAdminId);
        newAdmin.setCreatedBy(superAdmin);
        
        return regularAdminRepository.save(newAdmin);
    }
    
    public List<RegularAdmin> getAllAdmins(Long superAdminId) throws AccessDeniedException {
        // Verify the requestor is a SuperAdmin
        getSuperAdminById(superAdminId);
        return regularAdminRepository.findAll();
    }
    
    public RegularAdmin getAdminById(Long adminId, Long superAdminId) throws AccessDeniedException, AdminNotFoundException {
        // Verify the requestor is a SuperAdmin
        getSuperAdminById(superAdminId);
        
        Optional<RegularAdmin> adminOpt = regularAdminRepository.findById(adminId);
        if (adminOpt.isPresent()) {
            return adminOpt.get();
        }
        throw new AdminNotFoundException("Admin with ID " + adminId + " not found");
    }
    
    public RegularAdmin updateAdmin(Long adminId, RegularAdmin adminDetails, Long superAdminId) 
            throws AccessDeniedException, AdminNotFoundException {
        // Verify the requestor is a SuperAdmin
        SuperAdmin superAdmin = getSuperAdminById(superAdminId);
        
        RegularAdmin admin = getAdminById(adminId, superAdminId);
        
        // Update fields
        admin.setUsername(adminDetails.getUsername());
        admin.setEmail(adminDetails.getEmail());
        if (adminDetails.getPassword() != null && !adminDetails.getPassword().isEmpty()) {
            admin.setPassword(adminDetails.getPassword());
        }
        admin.setFirstname(adminDetails.getFirstname());
        admin.setLastname(adminDetails.getLastname());
        admin.setPhoneNumber(adminDetails.getPhoneNumber());
        admin.setDepartment(adminDetails.getDepartment());
        admin.setActive(adminDetails.isActive());
        
        return regularAdminRepository.save(admin);
    }
    
    public void deleteAdmin(Long adminId, Long superAdminId) throws AccessDeniedException, AdminNotFoundException {
        // Verify the requestor is a SuperAdmin
        getSuperAdminById(superAdminId);
        
        RegularAdmin admin = getAdminById(adminId, superAdminId);
        regularAdminRepository.delete(admin);
    }
    
    // Helper method to verify and get SuperAdmin by ID
    private SuperAdmin getSuperAdminById(Long superAdminId) throws AccessDeniedException {
        Optional<SuperAdmin> superAdminOpt = superAdminRepository.findById(superAdminId);
        if (!superAdminOpt.isPresent()) {
            throw new AccessDeniedException("Access denied. Only Super Admins can perform this operation.");
        }
        return superAdminOpt.get();
    }
}