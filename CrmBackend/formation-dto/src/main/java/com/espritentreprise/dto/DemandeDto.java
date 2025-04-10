package com.espritentreprise.formationdto;

import lombok.Data;

@Data
public class DemandeDto {
    private Long id;
    private String type;
    private String statut;
    private String description;
    private Long formationId;
    private Long clientId;
}
