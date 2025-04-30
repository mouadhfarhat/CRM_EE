package com.cmdpfe.gere_demande.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.cmdpfe.gere_demande.Entity.FoodCompany;
import com.cmdpfe.gere_demande.Repository.FoodCompanyRepository;

@RestController
@RequestMapping("/api/food-companies")
public class FoodCompanyController {

    @Autowired
    private FoodCompanyRepository foodCompanyRepository;

    @PostMapping
    public FoodCompany createFoodCompany(@RequestBody FoodCompany foodCompany) {
        return foodCompanyRepository.save(foodCompany);
    }

    @GetMapping
    public List<FoodCompany> getAllFoodCompanies() {
        return foodCompanyRepository.findAll();
    }

    @GetMapping("/search")
    public List<FoodCompany> searchFoodCompanies(@RequestParam("query") String query) {
        return foodCompanyRepository.findByNameContainingIgnoreCase(query);
    }

    @PutMapping("/{id}")
    public FoodCompany updateFoodCompany(@PathVariable Long id, @RequestBody FoodCompany updatedCompany) {
        FoodCompany company = foodCompanyRepository.findById(id).orElseThrow();
        company.setName(updatedCompany.getName());
        company.setContactInfo(updatedCompany.getContactInfo());
        return foodCompanyRepository.save(company);
    }

    @DeleteMapping("/{id}")
    public void deleteFoodCompany(@PathVariable Long id) {
        foodCompanyRepository.deleteById(id);
    }
}