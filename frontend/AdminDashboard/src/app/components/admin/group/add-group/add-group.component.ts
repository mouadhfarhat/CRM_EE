import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';
import { Client } from '../../../../domains/client';
import { Formation } from '../../../../domains/formation';
import { ListClientGroupComponent } from '../list-client-group/list-client-group.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface GroupTab {
  id: string;
  name: string;
  active: boolean;
  clients: Client[];
}

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [ListClientGroupComponent, CommonModule, FormsModule, DragDropModule],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  groupTabs: GroupTab[] = [];
  groupCounter = 1;
  draggedClient: Client | null = null;
  assignedClientIds: number[] = [];

  formations: Formation[] = [];
  selectedFormationId: number | undefined;
  eligibleClients: Client[] = [];
imageCache: { [key: number]: SafeUrl } = {}; // cache for performance

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.addNewGroup();
    this.loadFormationsByDeadline();
  }



  getClientImage(client: any): SafeUrl {
  // If already cached
  if (this.imageCache[client.id]) return this.imageCache[client.id];

  const imageUrl = client.imageUrl
    ? `http://localhost:8080${client.imageUrl}?t=${new Date().getTime()}`
    : `http://localhost:8080/images/users/default.png`;

  this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
    const objectURL = URL.createObjectURL(blob);
    this.imageCache[client.id] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  });

  return `assets/loading.gif`; // temporary placeholder while loading
}

  loadFormationsByDeadline(): void {
    this.http.get<Formation[]>('http://localhost:8080/api/groups/formations/deadline')
      .subscribe({
        next: (data) => this.formations = data,
        error: (err) => console.error('Failed to load formations', err)
      });
  }

  loadEligibleClients(): void {
    if (!this.selectedFormationId) {
      alert("Please select a formation.");
      return;
    }

    const url = `http://localhost:8080/api/groups/demandes/eligible?formationId=${this.selectedFormationId}`;
    this.http.get<Client[]>(url).subscribe({
      next: (data) => this.eligibleClients = data,
      error: (err) => console.error('Failed to load eligible clients', err)
    });
  }

  addNewGroup() {
    this.groupTabs.forEach(tab => tab.active = false);
    const nextGroupNumber = this.getNextSequentialGroupNumber();
    const newTab: GroupTab = {
      id: `group${nextGroupNumber}`,
      name: `Group ${nextGroupNumber}`,
      active: true,
      clients: []
    };
    this.groupTabs.push(newTab);
  }

  deleteLastGroup() {
    if (this.groupTabs.length <= 1) {
      alert("At least one group must remain.");
      return;
    }

    const removedGroup = this.groupTabs.pop();
    if (removedGroup?.active && this.groupTabs.length > 0) {
      this.groupTabs[this.groupTabs.length - 1].active = true;
    }

    this.updateAssignedClients();
  }

  getNextSequentialGroupNumber(): number {
    if (this.groupTabs.length === 0) return 1;
    const currentNumbers = this.groupTabs.map(tab => {
      const match = tab.name.match(/Group (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    let nextNumber = 1;
    while (currentNumbers.includes(nextNumber)) nextNumber++;
    return nextNumber;
  }

  activateTab(selectedTab: GroupTab) {
    this.groupTabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
  }

  onDragClient(client: Client) {
    this.draggedClient = client;
  }

  dropClient() {
    if (this.draggedClient) {
      const activeTab = this.groupTabs.find(tab => tab.active);
      if (activeTab) {
        // Remove client from all other groups
        this.groupTabs.forEach(tab => {
          tab.clients = tab.clients.filter(c => c.id !== this.draggedClient!.id);
        });

        // Add to active group if not already there
        if (!activeTab.clients.some(c => c.id === this.draggedClient!.id)) {
          activeTab.clients.push({ ...this.draggedClient });
        }

        this.updateAssignedClients();
      }
      this.draggedClient = null;
    }
  }

  removeFromGroup(group: GroupTab, client: Client) {
    const index = group.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      group.clients.splice(index, 1);
      this.updateAssignedClients();
    }
  }

  updateAssignedClients() {
    this.assignedClientIds = [];
    for (const tab of this.groupTabs) {
      for (const client of tab.clients) {
        if (!this.assignedClientIds.includes(client.id)) {
          this.assignedClientIds.push(client.id);
        }
      }
    }
  }

  saveGroups() {
    if (!this.selectedFormationId) {
      alert("Formation is required.");
      return;
    }

    // Send a POST request for each group
    for (const tab of this.groupTabs) {
      if (tab.clients.length === 0) {
        alert(`Group "${tab.name}" has no clients. Please add clients or remove the group.`);
        return;
      }

      const clientIds = tab.clients.map(c => c.id);
      const url = `http://localhost:8080/api/groups?formationId=${this.selectedFormationId}&name=${encodeURIComponent(tab.name)}&clientIds=${clientIds.join(',')}`;
      
      this.http.post(url, {}).subscribe({
        next: () => console.log(`Group ${tab.name} saved successfully.`),
        error: (err) => {
          console.error(`Failed to save group ${tab.name}`, err);
          alert(`Failed to save group ${tab.name}.`);
        }
      });
    }

    alert("All groups saved successfully.");
  }
  newGroupName: string = '';




  updateGroupName(tab: GroupTab, newName: string) {
    if (newName.trim() === '') {
      alert("Group name cannot be empty.");
      return;
    }
    tab.name = newName.trim();
  }
}