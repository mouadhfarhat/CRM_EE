package com.cmdpfe.gere_demande.Controller;

import com.cmdpfe.gere_demande.Entity.RegularAdmin;
import com.cmdpfe.gere_demande.Exception.AccessDeniedException;
import com.cmdpfe.gere_demande.Exception.AdminNotFoundException;
import com.cmdpfe.gere_demande.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    
    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody RegularAdmin newAdmin, 
                                       @RequestHeader("X-SuperAdmin-ID") Long superAdminId) {
        try {
            RegularAdmin createdAdmin = adminService.createAdmin(newAdmin, superAdminId);
            return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllAdmins(@RequestHeader("X-SuperAdmin-ID") Long superAdminId) {
        try {
            List<RegularAdmin> admins = adminService.getAllAdmins(superAdminId);
            return new ResponseEntity<>(admins, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id, 
                                        @RequestHeader("X-SuperAdmin-ID") Long superAdminId) {
        try {
            RegularAdmin admin = adminService.getAdminById(id, superAdminId);
            return new ResponseEntity<>(admin, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (AdminNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, 
                                       @RequestBody RegularAdmin adminDetails,
                                       @RequestHeader("X-SuperAdmin-ID") Long superAdminId) {
        try {
            RegularAdmin updatedAdmin = adminService.updateAdmin(id, adminDetails, superAdminId);
            return new ResponseEntity<>(updatedAdmin, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (AdminNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id, 
                                       @RequestHeader("X-SuperAdmin-ID") Long superAdminId) {
        try {
            adminService.deleteAdmin(id, superAdminId);
            return new ResponseEntity<>("Admin deleted successfully", HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (AdminNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}