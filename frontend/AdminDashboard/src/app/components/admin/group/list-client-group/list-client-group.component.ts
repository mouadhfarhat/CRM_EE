import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Client } from '../../../../domains/client';
import { ClientService } from '../../../../services/client/client.service';
import { DragDropModule } from 'primeng/dragdrop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-list-client-group',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DragDropModule, HttpClientModule],
  providers: [ClientService],
  templateUrl: './list-client-group.component.html',
  styleUrl: './list-client-group.component.css'
})
export class ListClientGroupComponent implements OnInit {
  @Input() clients: Client[] = []; // Accept clients as input
  @Input() assignedClientIds: number[] = [];
  @Output() dragClientEvent = new EventEmitter<Client>();
  
  draggedClient: Client | null = null;
imageCache: { [key: number]: SafeUrl } = {}; // cache for performance

  constructor(private http: HttpClient,private clientService: ClientService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Only load all clients if no input is provided

  }

  // Getter to filter out assigned clients
  get availableClients(): Client[] {
    return this.clients.filter(client => !this.assignedClientIds.includes(client.id));
  }



  dragStart(client: Client): void {
    this.draggedClient = client;
    this.dragClientEvent.emit(client);
  }

  dragEnd(): void {
    this.draggedClient = null;
  }

  getInterests(client: Client): string {
    return client.interested?.length ? client.interested.map(f => f.title).join(', ') : 'No interests listed';
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
}