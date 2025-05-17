package com.cmdpfe.demande.Controller;

import com.cmdpfe.demande.Entity.Demande;
import com.cmdpfe.demande.Entity.Task;
import com.cmdpfe.demande.Repository.DemandeRepository;
import com.cmdpfe.demande.Repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DemandeRepository demandeRepository;

    @PostMapping("/add/{demandeId}/{gestionnaireId}")
    public ResponseEntity<?> addTask(
            @PathVariable Long demandeId,
            @PathVariable Long gestionnaireId,
            @RequestBody Task taskRequest) {

        Optional<Demande> optionalDemande = demandeRepository.findById(demandeId);
        if (optionalDemande.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Demande demande = optionalDemande.get();


        Task task = new Task();
        task.setContent(taskRequest.getContent());
        task.setCompleted(false);
        task.setDemande(demande);

        return ResponseEntity.ok(taskRepository.save(task));
    }


    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(taskId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-demande/{demandeId}")
    public ResponseEntity<List<Task>> getTasksByDemande(@PathVariable Long demandeId) {
        return ResponseEntity.ok(taskRepository.findByDemandeId(demandeId));
    }
    
    @GetMapping("/demandes-with-tasks/by-gestionnaire/{gestionnaireId}")
    public ResponseEntity<List<Demande>> getDemandesWithTasksByGestionnaire(@PathVariable Long gestionnaireId) {
        List<Demande> demandes = demandeRepository.findByGestionnaireAssigneId(gestionnaireId);

        List<Demande> demandesWithTasks = demandes.stream()
                .filter(d -> d.getTasks() != null && !d.getTasks().isEmpty())
                .toList();

        return ResponseEntity.ok(demandesWithTasks);
    }

}
