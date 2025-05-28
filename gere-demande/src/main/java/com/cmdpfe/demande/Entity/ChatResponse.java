package com.cmdpfe.demande.Entity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatResponse {
    private String response;
    private String timestamp;
    private boolean success;

    public ChatResponse() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        this.success = true;
    }

    public ChatResponse(String response) {
        this();
        this.response = response;
    }
    
    public ChatResponse(String response, boolean success) {
        this();
        this.response = response;
        this.success = success;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
    
    public String getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}