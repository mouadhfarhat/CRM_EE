package com.espritentreprise.dto;

import lombok.Data;

@Data
public class DemandeRequestDTO {
    private Long clientId;
    private Long formationId;
    private String message;
}
