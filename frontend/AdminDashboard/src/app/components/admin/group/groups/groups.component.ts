import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../services/client/client.service';
import { FormationService } from '../../../../services/formation/formation.service';
import { Client } from '../../../../domains/client';
import { Formation } from '../../../../domains/formation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientGroupService } from '../../../../services/cleint-group/client-group.service';
import { ClientGroup } from '../../../../domains/clients-group.model';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [ClientService, FormationService, ClientGroupService],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  viewMode: 'formation' | 'group' = 'formation'; // ⬅ toggle state
  searchKeyword = '';

  selectedFormationId: number | null = null;
  selectedGroupId: number | null = null;

  formations: Formation[] = [];
  filteredFormations: Formation[] = [];

  groups: ClientGroup[] = [];
  filteredGroups: ClientGroup[] = [];

  clients: Client[] = [];
  filteredClients: Client[] = [];

  searchClientKeyword = '';


  formationStats: { [key: number]: { groupCount: number, demandeClientCount: number } } = {};

  constructor(
    private clientService: ClientService,
    private formationService: FormationService,
    private groupService: ClientGroupService
  ) {}

ngOnInit(): void {
  this.loadFormations();
  this.loadGroups(); // ⬅ load all groups at first
  this.loadClients();
}


  switchView(view: 'formation' | 'group') {
    this.viewMode = view;
    this.searchKeyword = '';
    this.selectedGroupId = null;

    if (view === 'group') {
      if (this.selectedFormationId !== null) {
        this.groupService.getByFormation(this.selectedFormationId).subscribe(data => {
          this.groups = data;
          this.filteredGroups = data;
          this.filterList();
        });
      } else {
        this.loadGroups(); // show all groups if no formation is selected
      }
    }

    this.filterList();
  }

  loadFormations() {
    this.formationService.getFormations().subscribe(data => {
      this.formations = data;
      this.filteredFormations = data;

      for (let formation of data) {
        this.formationService.getFormationStats(formation.id!).subscribe(stats => {
          this.formationStats[formation.id!] = stats;
        });
      }
    });
  }

  loadGroups() {
    this.groupService.getAll().subscribe(data => {
      this.groups = data;
      this.filteredGroups = data;
    });
  }

  loadClients() {
    this.clientService.getAll().subscribe((data: Client[]) => {
      this.clients = data;
      this.filteredClients = data;
    });
  }

  filterList() {
    const keyword = this.searchKeyword.toLowerCase();

    if (this.viewMode === 'formation') {
      this.filteredFormations = this.formations.filter(f => f.name.toLowerCase().includes(keyword));
    } else {
      this.filteredGroups = this.groups.filter(g => g.name.toLowerCase().includes(keyword));
    }
  }

  selectFormation(formation: Formation) {
    // Toggle selection
    if (this.selectedFormationId === formation.id) {
      // Deselect
      this.selectedFormationId = null;
      this.loadGroups(); // reload all groups
      this.filteredClients = this.clients; // reset clients list
    } else {
      // Select
      this.selectedFormationId = formation.id;

      

      // Load groups for this formation if viewMode is 'group'
      if (this.viewMode === 'group') {
        this.groupService.getByFormation(formation.id!).subscribe(data => {
          this.groups = data;
          this.filteredGroups = data;
          this.filterList();
        });
      }
    }

    console.log('Selected Formation ID:', this.selectedFormationId);
  }

  selectGroup(group: ClientGroup) {
    if (this.selectedGroupId === group.id) {
      // Deselect group
      this.selectedGroupId = null;
      this.filteredClients = this.clients;
    } else {
      // Select new group
      this.selectedGroupId = group.id;
      this.clientService.getByGroup(group.id).subscribe((data: Client[]) => {
        this.filteredClients = data;
      });
    }

    console.log('Selected Group ID:', this.selectedGroupId);
  }


filterClients() {
  const keyword = this.searchClientKeyword.toLowerCase();

  if (keyword.trim() === '') {
    // Restore to last known list: either filtered by group or full list
    if (this.selectedGroupId !== null) {
      this.clientService.getByGroup(this.selectedGroupId).subscribe((data: Client[]) => {
        this.filteredClients = data;
      });
    } else {
      this.filteredClients = this.clients;
    }
  } else {
    this.filteredClients = this.filteredClients.filter(client =>
      client.username.toLowerCase().includes(keyword)
    );
  }
}

deleteGroup(groupId: number) {
  if (confirm('Are you sure you want to delete this group?')) {
    this.groupService.deleteGroup(groupId).subscribe(() => {
      this.loadGroups();
      if (this.selectedGroupId === groupId) {
        this.selectedGroupId = null;
        this.filteredClients = this.clients;
      }
    });
  }
}

removeClientFromGroup(clientId: number) {
  if (this.selectedGroupId !== null) {
    this.groupService.removeClientFromGroup(this.selectedGroupId, clientId).subscribe(() => {
      const selectedGroup = this.filteredGroups.find(g => g.id === this.selectedGroupId);
      if (selectedGroup) {
        this.selectGroup(selectedGroup);
      }
    });
  }
}


eligibleClients: Client[] = [];
filteredEligibleClients: Client[] = [];
searchEligibleClientKeyword = '';

addClientToGroup() {
  if (this.selectedGroupId === null) {
    console.warn('No group selected.');
    return;
  }

  const selectedGroup = this.groups.find(g => g.id === this.selectedGroupId);
  let formationId = selectedGroup?.formation?.id;

  // ✅ fallback to selectedFormationId if not found
  if (!formationId && this.selectedFormationId !== null) {
    formationId = this.selectedFormationId;
  }

  if (!formationId) {
    console.warn('No formationId found.');
    return;
  }

  this.groupService.getEligibleClients(formationId).subscribe(clients => {
    this.eligibleClients = clients;
    this.filteredEligibleClients = clients;
    this.openAddClientModal();
  });
}

openAddClientModal() {
  const modalEl = document.getElementById('addClientModal');
  if (modalEl) {
    modalEl.style.display = 'block';
    modalEl.classList.add('show');
    document.body.classList.add('modal-open');

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}




filterEligibleClients() {
  const keyword = this.searchEligibleClientKeyword.toLowerCase();
  this.filteredEligibleClients = this.eligibleClients.filter(c =>
    c.username.toLowerCase().includes(keyword)
  );
}
confirmAddClientToGroup(clientId: number) {
  if (this.selectedGroupId === null) return;

  this.groupService
    .addClientToGroup(this.selectedGroupId, clientId)
    .subscribe(() => {
      // re-load that group’s clients
      const selectedGroup = this.filteredGroups.find(g => g.id === this.selectedGroupId);
      if (selectedGroup) this.selectGroup(selectedGroup);

      // close the modal
      this.closeAddClientModal();
    });
}



closeAddClientModal() {
  const modalEl = document.getElementById('addClientModal');
  if (modalEl) {
    modalEl.classList.remove('show');
    modalEl.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
  }
}





}
