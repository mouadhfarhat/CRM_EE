import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  OnInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormationService } from '../../services/formation.service';
import { Formation } from '../../models/formation.model';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { catchError, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CalendrierEventService } from '../../services/calendrier-event.service';
import { EventStatus, EventType, RecurrenceType } from '../../models/enums';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { CalendrierEvent } from '../../models/CalendrierEvent .model';
import { Gestionnaire } from '../../models/gestionnaire.model';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarRef!: ElementRef;
  private calendar: Calendar | null = null;
  private isBrowser = false;

  // Form properties
  selectedColor: string = '#007bff';
  formations: Formation[] = [];
  clients: Client[] = [];
  eventTypes = Object.values(EventType);
  selectedClientIds: number[] = [];
  selectedFormationId?: number;
  formationSearchTerm: string = '';
  clientSearchTerm: string = '';
  filteredClients: Client[] = [];
  filteredFormations: Formation[] = [];

  newEvent: Partial<CalendrierEvent> = {
    startTime: '',
    endTime: '',
    type: EventType.OTHER,
    reminderMinutesBefore: 0
  };

  colorOptions = [
    { name: 'primary', value: '#007bff' },
    { name: 'warning', value: '#ffc107' },
    { name: 'success', value: '#28a745' },
    { name: 'danger', value: '#dc3545' },
    { name: 'muted', value: '#6c757d' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private formationService: FormationService,
    private eventService: CalendrierEventService,
    private clientService: ClientService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadClients();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadAndInitCalendar();
    }
  }

  ngOnDestroy(): void {
    this.destroyCalendar();
  }

  private async loadAndInitCalendar(): Promise<void> {
    try {
      const { Calendar } = await import('@fullcalendar/core');
      const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
      const interactionPlugin = (await import('@fullcalendar/interaction')).default;

      this.calendarRef.nativeElement.innerHTML = '';

      // Fetch data separately with proper typing
      const events = await this.eventService.getAllEvents()
        .pipe(
          take(1),
          catchError(() => of([] as CalendrierEvent[]))
        )
        .toPromise();

      const formations = await this.formationService.getFormations()
        .pipe(
          take(1),
          catchError(() => of([] as Formation[]))
        )
        .toPromise();

      // Map events
      const eventEntries = (events || []).map((e: CalendrierEvent) => ({
        id: e.id?.toString(),
        title: e.title,
        start: new Date(e.startTime).toISOString(),
        end: new Date(e.endTime).toISOString(),
        backgroundColor: e.backgroundColor || '#3788d8',
        borderColor: e.borderColor || '#3788d8',
        textColor: '#fff',
        display: 'block',
        allDay: false,
        extendedProps: {
          clients: e.clients,
          formation: e.formation,
          type: e.type
        }
      }));

      // Map formations
      const formationEntries = (formations || []).map((f: Formation) => ({
        id: `formation-${f.id}`,
        title: f.title || 'No Title',
        start: f.dateDebut,
        end: f.dateFin,
        allDay: true,
        extendedProps: {
          description: f.description || '',
          name: f.name || '',
          isFormation: true
        },
        backgroundColor: '#28a745',
        borderColor: '#28a745'
      }));

      this.calendar = new Calendar(this.calendarRef.nativeElement, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        height: 'auto',
        contentHeight: 'auto',
        events: [...eventEntries, ...formationEntries],
        eventClick: this.handleEventClick.bind(this)
      });

      this.calendar.render();
    } catch (error) {
      console.error('Failed to initialize calendar:', error);
    }
  }

  private loadFormations(): void {
    this.formationService.searchFormations(this.formationSearchTerm).pipe(
      catchError(error => {
        console.error('Error loading formations:', error);
        return of([] as Formation[]);
      })
    ).subscribe(formations => {
      this.formations = formations;
      this.filteredFormations = [...formations];
    });
  }

  private loadClients(): void {
    this.clientService.searchClients(this.clientSearchTerm).pipe(
      catchError(error => {
        console.error('Error loading clients:', error);
        return of([] as Client[]);
      })
    ).subscribe(clients => {
      this.clients = clients;
      this.filteredClients = [...clients];
    });
  }

  onFormationSearch(): void {
    if (!this.formationSearchTerm) {
      this.filteredFormations = [...this.formations];
      return;
    }
    const term = this.formationSearchTerm.toLowerCase();
    this.filteredFormations = this.formations.filter(formation => 
      formation.name.toLowerCase().includes(term) || 
      formation.description.toLowerCase().includes(term)    );
  }

  onClientSearch(): void {
    if (!this.clientSearchTerm) {
      this.filteredClients = [...this.clients];
      return;
    }
    const term = this.clientSearchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.username.toLowerCase().includes(term) ||
      (client.email && client.email.toLowerCase().includes(term))
    );
  }

  private destroyCalendar(): void {
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }
  }

  editableEvent: any = {};

  editableClientIds: number[] = [];

  isEditModalOpen: boolean = false;

  private convertDate(date: Date): string {
    if (!date) return '';
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 16); // format: yyyy-MM-ddTHH:mm
  }


  updateEvent(): void {
    const updated = {
      ...this.editableEvent,
      clients: this.clients.filter(c => this.editableClientIds.includes(c.id)),
      formation: this.formations.find(f => f.id === this.editableEvent.formation?.id) || null
    };
  
    this.eventService.updateEvent(updated.id, updated).subscribe({
      next: () => {
        this.isEditModalOpen = false;
        this.loadAndInitCalendar();
      },
      error: err => console.error("Error updating event", err)
    });
  }
  
  
  

  
  private handleEventClick(info: any): void {
    const event = info.event;
    const isFormation = event.extendedProps?.isFormation;
  
    if (isFormation) {
      alert(
        `📘 Formation: ${event.title}\n` +
        `Start: ${event.start?.toLocaleDateString()}\n` +
        `End: ${event.end?.toLocaleDateString() || 'N/A'}\n` +
        `Description: ${event.extendedProps.description || 'N/A'}`
      );
      return;
    }
  
    this.editableEvent = {
      id: event.id,
      title: event.title,
      startTime: this.convertDate(event.start),
      endTime: this.convertDate(event.end),
      type: event.extendedProps?.type || '',
      formation: event.extendedProps?.formation || {},
      clients: event.extendedProps?.clients || [],
      reminderMinutesBefore: event.extendedProps?.reminderMinutesBefore || 0,
      backgroundColor: event.backgroundColor || '#007bff',
      borderColor: event.borderColor || '#007bff'
    };
  
    this.editableClientIds = this.editableEvent.clients.map((c: Client) => c.id);
  
    // ✅ Open modal
    this.isEditModalOpen = true;
  }


  deleteEvent() {
    if (!this.editableEvent?.id) return;
  
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.editableEvent.id).subscribe({
        next: () => {
          // Remove the event from the calendar
          const calendarApi = this.calendar;
          const existingEvent = calendarApi?.getEventById(this.editableEvent.id);
          if (existingEvent) {
            existingEvent.remove();
          }
  
          // Close the modal and reset
          this.isEditModalOpen = false;
          this.editableEvent = null;
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event. Please try again.');
        }
      });
    }
  }
  
  
  

  selectColor(event: Event, color: string): void {
    event.preventDefault();
    this.selectedColor = color;
    const colorLinks = document.querySelectorAll('.fc-color-picker li');
    colorLinks.forEach(el => el.classList.remove('selected'));
    const clickedLi = (event.target as HTMLElement).closest('li');
    if (clickedLi) {
      clickedLi.classList.add('selected');
    }
  }

  isClientSelected(clientId: number): boolean {
    return this.selectedClientIds.includes(clientId);
  }

  toggleClientSelection(clientId: number): void {
    const index = this.selectedClientIds.indexOf(clientId);
    if (index === -1) {
      this.selectedClientIds.push(clientId);
    } else {
      this.selectedClientIds.splice(index, 1);
    }
  }

  private resetForm(): void {
    this.newEvent = {
      startTime: '',
      endTime: '',
      type: EventType.OTHER,
      reminderMinutesBefore: 0
    };
    this.selectedColor = '#007bff';
    this.selectedClientIds = [];
    this.selectedFormationId = undefined;
    this.formationSearchTerm = '';
    this.clientSearchTerm = '';
    this.filteredClients = [...this.clients];
    this.filteredFormations = [...this.formations];
  }

  async createEvent(title: string): Promise<void> {
    if (!title.trim() || !this.newEvent.startTime || !this.newEvent.endTime) {
      alert('Please fill all required fields');
      return;
    }

    const eventToCreate: CalendrierEvent = {
      title,
      startTime: this.newEvent.startTime!,
      endTime: this.newEvent.endTime!,
      type: this.newEvent.type as EventType,
      recurrence: RecurrenceType.NONE,
      status: EventStatus.SCHEDULED,
      reminderMinutesBefore: this.newEvent.reminderMinutesBefore ?? 0,
      backgroundColor: this.selectedColor,
      borderColor: this.selectedColor,
      formation: this.selectedFormationId ? { id: this.selectedFormationId } as Formation : undefined,
      clients: this.selectedClientIds.map(id => ({ id } as Client)),
      gestionnaire: { id: 5 } as Gestionnaire // Default gestionnaire
    };

    try {
      const savedEvent = await this.eventService.addEvent(eventToCreate).toPromise();
      if (!savedEvent) return;

      this.calendar?.addEvent({
        id: savedEvent.id?.toString(),
        title: savedEvent.title,
        start: savedEvent.startTime,
        end: savedEvent.endTime,
        backgroundColor: savedEvent.backgroundColor,
        borderColor: savedEvent.borderColor,
        textColor: '#fff',
        display: 'block',
        allDay: false,
        extendedProps: {
          clients: savedEvent.clients,
          formation: savedEvent.formation,
          type: savedEvent.type
        }
      });

      this.resetForm();
      alert('Event added successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Error creating event. Please check console for details.');
    }
  }
}