import { Component, OnInit } from '@angular/core';
import { ListClientGroupComponent } from '../list-client-group/list-client-group.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';
import { Client } from '../../../../domains/client';

interface GroupTab {
  id: string;
  name: string;
  active: boolean;
  clients: Client[];
}

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [
    ListClientGroupComponent,
    HttpClientModule,
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.css'
})
export class AddGroupComponent implements OnInit {
  groupTabs: GroupTab[] = [];
  groupCounter = 1;
  draggedClient: Client | null = null;
  
  // Track assigned client IDs
  assignedClientIds: number[] = [];

  ngOnInit() {
    // Initialize with first group
    this.addNewGroup();
  }

  addNewGroup() {
    // Deactivate all existing tabs
    this.groupTabs.forEach(tab => tab.active = false);
    
    // Get the next available sequential number
    const nextGroupNumber = this.getNextSequentialGroupNumber();
    
    // Create new tab with sequential numbering
    const newTab: GroupTab = {
      id: `group${nextGroupNumber}`,
      name: `Group ${nextGroupNumber}`,
      active: true,
      clients: []
    };
    
    this.groupTabs.push(newTab);
  }
  // Helper method to get the next available group number
  getNextSequentialGroupNumber(): number {
    // If no groups exist, start with 1
    if (this.groupTabs.length === 0) {
      return 1;
    }
    
    // Get all current group numbers from the group names
    const currentNumbers = this.groupTabs.map(tab => {
      // Extract number from "Group X" format
      const match = tab.name.match(/Group (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    // Find the first missing number in sequence
    let nextNumber = 1;
    while (currentNumbers.includes(nextNumber)) {
      nextNumber++;
    }
    
    return nextNumber;
  }

  deleteLastGroup() {
    if (this.groupTabs.length <= 1) {
      // Don't delete if it's the only tab
      return;
    }
    
    // Remove the last tab
    const removedTab = this.groupTabs.pop();
    
    // If the removed tab was active, activate the new last tab
    if (removedTab?.active) {
      const lastIndex = this.groupTabs.length - 1;
      if (lastIndex >= 0) {
        this.groupTabs[lastIndex].active = true;
      }
    }
    
    // Update assigned clients
    this.updateAssignedClients();
  }

  activateTab(selectedTab: GroupTab) {
    this.groupTabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
  }

  // Drag and Drop methods
  onDragClient(client: Client) {
    this.draggedClient = client;
  }

  dropClient() {
    if (this.draggedClient) {
      // Find active tab
      const activeTab = this.groupTabs.find(tab => tab.active);
      
      if (activeTab) {
        // Check if client already exists in this tab
        const clientExists = activeTab.clients.some(c => c.id === this.draggedClient!.id);
        
        if (!clientExists) {
          // Add client to the active tab
          activeTab.clients.push({...this.draggedClient});
          
          // Update assigned clients
          this.updateAssignedClients();
        }
      }
      
      this.draggedClient = null;
    }
  }

  // Method to remove a client from a group
  removeFromGroup(group: GroupTab, client: Client) {
    const index = group.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      group.clients.splice(index, 1);
      
      // Update assigned clients
      this.updateAssignedClients();
    }
  }

  // Get the active tab
  getActiveTab(): GroupTab | undefined {
    return this.groupTabs.find(tab => tab.active);
  }
  
  // Update the list of assigned client IDs
  updateAssignedClients() {
    // Get all client IDs from all groups
    this.assignedClientIds = [];
    
    for (const tab of this.groupTabs) {
      for (const client of tab.clients) {
        if (!this.assignedClientIds.includes(client.id)) {
          this.assignedClientIds.push(client.id);
        }
      }
    }
  }
}