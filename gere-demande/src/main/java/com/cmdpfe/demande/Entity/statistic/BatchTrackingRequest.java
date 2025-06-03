package com.cmdpfe.demande.Entity.statistic;

import java.util.List;

public class BatchTrackingRequest {
	 private List<InteractionTrackingRequest> interactions;
	 
	 public BatchTrackingRequest() {}
	 
	 public List<InteractionTrackingRequest> getInteractions() { return interactions; }
	 public void setInteractions(List<InteractionTrackingRequest> interactions) { 
	     this.interactions = interactions; 
	 }
	}