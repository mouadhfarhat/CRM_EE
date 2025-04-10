package com.espritentreprise.dto;

import lombok.Data;

@Data
public class FormationDTO {
    private Long id;
    private String title;
    private String domain;
    private int capacity;
}
