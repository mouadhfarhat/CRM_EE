package com.cmdpfe.gere_demande.Entity;

import jakarta.persistence.*;
@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private CalendrierEvent event;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public CalendrierEvent getEvent() {
		return event;
	}

	public void setEvent(CalendrierEvent event) {
		this.event = event;
	}

	public Attachment(Long id, String fileName, String filePath, CalendrierEvent event) {
		super();
		this.id = id;
		this.fileName = fileName;
		this.filePath = filePath;
		this.event = event;
	}

	public Attachment() {
		super();
		// TODO Auto-generated constructor stub
	}
}
