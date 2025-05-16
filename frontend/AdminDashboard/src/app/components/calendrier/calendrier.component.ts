import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormationService } from '../../services/formation/formation.service';
import { Formation } from '../../domains/formation';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { catchError, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CalendrierEventService } from '../../services/calendrier/calendrier-event.service';
import { FormsModule } from '@angular/forms';
import { Gestionnaire } from '../../domains/gestionnaire.model';
import { EventStatus, RecurrenceType, EventType } from '../../domains/enums';
import { HttpClient } from '@angular/common/http';
import { ClientGroup } from '../../domains/clients-group.model';
import { CalendrierEvent } from '../../domains/CalendrierEvent .model';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [FormationService, CalendrierEventService],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css'],
})
export class CalendrierComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarRef!: ElementRef;
  private calendar: Calendar | null = null;
  private isBrowser = false;

  // Form properties (Add Event)
  selectedColor: string = '#007bff';
  formations: Formation[] = [];
  groups: ClientGroup[] = [];
  eventTypes = Object.values(EventType);
  selectedGroupIds: number[] = [];
  selectedFormationId?: number;
  formationSearchTerm: string = '';
  filteredFormations: Formation[] = [];

  // Edit modal properties
  editGroups: ClientGroup[] = [];
  editableGroupIds: number[] = [];
  isEditModalOpen: boolean = false;
  editableEvent: any = {};

  // Gestionnaire properties
  private currentGestionnaireId: number | null = null;

  newEvent: Partial<CalendrierEvent> = {
    title: '',
    startTime: '',
    endTime: '',
    type: EventType.OTHER,
    reminderMinutesBefore: 0,
  };

  colorOptions = [
    { name: 'Primary', value: '#007bff' },
    { name: 'Warning', value: '#ffc107' },
    { name: 'Success', value: '#28a745' },
    { name: 'Danger', value: '#dc3545' },
    { name: 'Muted', value: '#6c757d' },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private formationService: FormationService,
    private eventService: CalendrierEventService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.getCurrentGestionnaire();
    this.loadFormations();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadAndInitCalendar();
    }
  }

  ngOnDestroy(): void {
    this.destroyCalendar();
  }

  private getCurrentGestionnaire(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:8080/gestionnaires/me', { headers }).subscribe({
      next: (g) => {
        console.log('Gestionnaire from Oracle:', g);
        this.currentGestionnaireId = g.id;
      },
      error: (err) => {
        console.error('Failed to fetch current gestionnaire', err);
      },
    });
  }

  private getGestionnaireId(): number {
    if (this.currentGestionnaireId === null) {
      throw new Error('Gestionnaire ID not yet loaded.');
    }
    return this.currentGestionnaireId;
  }

  private async loadAndInitCalendar(): Promise<void> {
    try {
      const { Calendar } = await import('@fullcalendar/core');
      const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
      const interactionPlugin = (await import('@fullcalendar/interaction')).default;

      this.calendarRef.nativeElement.innerHTML = '';

      // Fetch events with error handling
      const events = await this.eventService
        .getAllEvents()
        .pipe(
          take(1),
          catchError((error) => {
            console.error('Failed to fetch events:', error);
            return of([] as CalendrierEvent[]);
          })
        )
        .toPromise();

      // Fetch formations with error handling
      const formations = await this.formationService
        .getFormations()
        .pipe(
          take(1),
          catchError((error) => {
            console.error('Failed to fetch formations:', error);
            return of([] as Formation[]);
          })
        )
        .toPromise();

      // Map events, avoiding nested properties that may be undefined
      const eventEntries = (events || []).map((e: CalendrierEvent) => ({
        id: e.id?.toString() || `event-${Math.random()}`,
        title: e.title || 'Untitled Event',
        start: e.startTime ? new Date(e.startTime).toISOString() : new Date().toISOString(),
        end: e.endTime ? new Date(e.endTime).toISOString() : new Date().toISOString(),
        backgroundColor: e.backgroundColor || '#3788d8',
        borderColor: e.borderColor || '#3788d8',
        textColor: '#fff',
        display: 'block',
        allDay: false,
        extendedProps: {
          groups: e.groups ? e.groups.map((g) => ({ id: g.id, name: g.name })) : [],
          formation: e.formation ? { id: e.formation.id, title: e.formation.title } : null,
          type: e.type || EventType.OTHER,
        },
      }));

      // Map formations, avoiding nested properties
      const formationEntries = (formations || []).map((f: Formation) => ({
        id: `formation-${f.id || Math.random()}`,
        title: f.title || 'No Title',
        start: f.dateDebut || new Date(),
        end: f.dateFin || f.dateDebut || new Date(),
        allDay: true,
        extendedProps: {
          description: f.description || '',
          name: f.name || '',
          isFormation: true,
        },
        backgroundColor: '#28a745',
        borderColor: '#28a745',
      }));

      this.calendar = new Calendar(this.calendarRef.nativeElement, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        height: 'auto',
        contentHeight: 'auto',
        events: [...eventEntries, ...formationEntries],
        eventClick: this.handleEventClick.bind(this),
      });

      this.calendar.render();
    } catch (error) {
      console.error('Failed to initialize calendar:', error);
      alert('Failed to load calendar. Please check console for details.');
    }
  }

  private loadFormations(): void {
    this.formationService
      .searchFormations(this.formationSearchTerm)
      .pipe(
        catchError((error) => {
          console.error('Error loading formations:', error);
          return of([] as Formation[]);
        })
      )
      .subscribe((formations) => {
        this.formations = formations;
        this.filteredFormations = [...formations];
      });
  }

  // Add Event: Formation and Group Selection
  onFormationSearch(): void {
    if (!this.formationSearchTerm) {
      this.filteredFormations = [...this.formations];
      return;
    }
    const term = this.formationSearchTerm.toLowerCase();
    this.filteredFormations = this.formations.filter(
      (formation) =>
        (formation.name?.toLowerCase().includes(term) ||
        formation.description?.toLowerCase().includes(term))
    );
  }

  onFormationSelect(formationId: number | undefined): void {
    this.selectedFormationId = formationId;
    this.selectedGroupIds = [];
    this.groups = [];
    if (formationId) {
      this.loadGroupsByFormation(formationId);
    }
  }

  private loadGroupsByFormation(formationId: number): void {
    this.http
      .get<ClientGroup[]>(`http://localhost:8080/api/groups/by-formation/${formationId}`)
      .pipe(
        catchError((error) => {
          console.error('Error loading groups:', error);
          return of([] as ClientGroup[]);
        })
      )
      .subscribe((groups) => {
        this.groups = groups;
      });
  }

  toggleGroupSelection(groupId: number): void {
    const index = this.selectedGroupIds.indexOf(groupId);
    if (index === -1) {
      this.selectedGroupIds.push(groupId);
    } else {
      this.selectedGroupIds.splice(index, 1);
    }
  }

  isGroupSelected(groupId: number): boolean {
    return this.selectedGroupIds.includes(groupId);
  }

  selectAllGroups(): void {
    this.selectedGroupIds = this.groups.map((group) => group.id);
  }

  deselectAllGroups(): void {
    this.selectedGroupIds = [];
  }

  // Edit Event: Formation and Group Selection
  onEditFormationSelect(formationId: number | undefined): void {
    this.editableEvent.formation.id = formationId;
    this.editableGroupIds = [];
    this.editGroups = [];
    if (formationId) {
      this.loadEditGroupsByFormation(formationId);
    }
  }

  private loadEditGroupsByFormation(formationId: number): void {
    this.http
      .get<ClientGroup[]>(`http://localhost:8080/api/groups/by-formation/${formationId}`)
      .pipe(
        catchError((error) => {
          console.error('Error loading groups for edit:', error);
          return of([] as ClientGroup[]);
        })
      )
      .subscribe((groups) => {
        this.editGroups = groups;
      });
  }

  toggleEditGroupSelection(groupId: number): void {
    const index = this.editableGroupIds.indexOf(groupId);
    if (index === -1) {
      this.editableGroupIds.push(groupId);
    } else {
      this.editableGroupIds.splice(index, 1);
    }
  }

  isEditGroupSelected(groupId: number): boolean {
    return this.editableGroupIds.includes(groupId);
  }

  selectAllEditGroups(): void {
    this.editableGroupIds = this.editGroups.map((group) => group.id);
  }

  deselectAllEditGroups(): void {
    this.editableGroupIds = [];
  }

  private destroyCalendar(): void {
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }
  }

  private convertDate(date: Date): string {
    if (!date) return '';
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 16);
  }

  updateEvent(): void {
    if (
      !this.editableEvent.title?.trim() ||
      !this.editableEvent.startTime ||
      !this.editableEvent.endTime ||
      !this.editableEvent.formation?.id
    ) {
      alert('Please fill all required fields (title, start time, end time, formation)');
      return;
    }

    const updatedEvent: Partial<CalendrierEvent> = {
      id: this.editableEvent.id,
      title: this.editableEvent.title,
      startTime: new Date(this.editableEvent.startTime).toISOString(),
      endTime: new Date(this.editableEvent.endTime).toISOString(),
      type: this.editableEvent.type,
      status: EventStatus.SCHEDULED,
      formation: { id: this.editableEvent.formation.id } as Formation,
      groups: this.editableGroupIds.map((id) => ({ id } as ClientGroup)),
      backgroundColor: this.editableEvent.backgroundColor,
      borderColor: this.editableEvent.backgroundColor,
    };

    this.http
      .put<CalendrierEvent>(`http://localhost:8080/api/events/${updatedEvent.id}`, updatedEvent)
      .pipe(
        catchError((error) => {
          console.error('Error updating event:', error);
          throw error;
        })
      )
      .subscribe({
        next: (savedEvent) => {
          if (!savedEvent.id || !savedEvent.title) {
            alert('Event is missing required fields');
            return;
          }

          const calendarApi = this.calendar;
          const eventId = savedEvent.id.toString();
          const existingEvent = calendarApi?.getEventById(eventId);
          if (existingEvent) {
            existingEvent.remove();
          }

          calendarApi?.addEvent({
            id: eventId,
            title: savedEvent.title,
            start: savedEvent.startTime || new Date(),
            end: savedEvent.endTime || new Date(),
            backgroundColor: savedEvent.backgroundColor || '#3b82f6',
            borderColor: savedEvent.borderColor || '#3b82f6',
            textColor: '#fff',
            display: 'block',
            allDay: false,
            extendedProps: {
              groups: savedEvent.groups ? savedEvent.groups.map((g) => ({ id: g.id, name: g.name })) : [],
              formation: savedEvent.formation ? { id: savedEvent.formation.id, title: savedEvent.formation.title } : null,
              type: savedEvent.type || 'default',
            },
          });

          this.isEditModalOpen = false;
          alert('Event updated successfully!');
        },
        error: (err) => {
          console.error('Error updating event:', err);
          alert(err.error?.message || 'Error updating event.');
        },
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
      type: event.extendedProps?.type || EventType.OTHER,
      formation: event.extendedProps?.formation || { id: undefined },
      groups: event.extendedProps?.groups || [],
      backgroundColor: event.backgroundColor || '#007bff',
    };

    this.editableGroupIds = this.editableEvent.groups.map((g: ClientGroup) => g.id);
    this.formationSearchTerm = '';
    this.filteredFormations = [...this.formations];
    if (this.editableEvent.formation.id) {
      this.loadEditGroupsByFormation(this.editableEvent.formation.id);
    }
    this.isEditModalOpen = true;
  }

  deleteEvent(): void {
    if (!this.editableEvent?.id) return;

    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.editableEvent.id).subscribe({
        next: () => {
          const calendarApi = this.calendar;
          const existingEvent = calendarApi?.getEventById(this.editableEvent.id);
          if (existingEvent) {
            existingEvent.remove();
          }
          this.isEditModalOpen = false;
          this.editableEvent = null;
          alert('Event deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event. Please try again.');
        },
      });
    }
  }

  selectColor(event: Event, color: string): void {
    event.preventDefault();
    this.selectedColor = color;
  }

  private resetForm(): void {
    this.newEvent = {
      title: '',
      startTime: '',
      endTime: '',
      type: EventType.OTHER,
      reminderMinutesBefore: 0,
    };
    this.selectedColor = '#007bff';
    this.selectedGroupIds = [];
    this.selectedFormationId = undefined;
    this.formationSearchTerm = '';
    this.filteredFormations = [...this.formations];
    this.groups = [];
  }

  async createEvent(title: string): Promise<void> {
    if (
      !title.trim() ||
      !this.newEvent.startTime ||
      !this.newEvent.endTime ||
      !this.selectedFormationId
    ) {
      alert('Please fill all required fields (title, start time, end time, formation)');
      return;
    }

    if (this.currentGestionnaireId === null) {
      alert('Gestionnaire ID not loaded. Please try again.');
      return;
    }

    const eventToCreate: Partial<CalendrierEvent> = {
      title,
      startTime: new Date(this.newEvent.startTime!).toISOString(),
      endTime: new Date(this.newEvent.endTime!).toISOString(),
      type: this.newEvent.type as EventType,
      status: EventStatus.SCHEDULED,
      formation: { id: this.selectedFormationId } as Formation,
      groups: this.selectedGroupIds.map((id) => ({ id } as ClientGroup)),
      gestionnaire: { id: this.getGestionnaireId() } as Gestionnaire,
      backgroundColor: this.selectedColor,
      borderColor: this.selectedColor,
      reminderMinutesBefore: this.newEvent.reminderMinutesBefore ?? 0,
    };

    try {
      const savedEvent = await this.http
        .post<CalendrierEvent>('http://localhost:8080/api/events/add', eventToCreate)
        .pipe(
          catchError((error) => {
            console.error('Error creating event:', error);
            throw error;
          })
        )
        .toPromise();

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
          groups: savedEvent.groups ? savedEvent.groups.map((g) => ({ id: g.id, name: g.name })) : [],
          formation: savedEvent.formation ? { id: savedEvent.formation.id, title: savedEvent.formation.title } : null,
          type: savedEvent.type,
        },
      });

      this.resetForm();
      alert('Event added successfully!');
    } catch (err: any) {
      console.error('Error creating event:', err);
      alert(
        err.error?.message ||
          'Error creating event. Please check console for details.'
      );
    }
  }
}