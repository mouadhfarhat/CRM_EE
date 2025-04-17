import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, FooterComponent],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarRef!: ElementRef;
  private calendar: any = null;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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
    const { Calendar } = await import('@fullcalendar/core');
    const dayGridPlugin = (await import('@fullcalendar/daygrid')).default;
    const interactionPlugin = (await import('@fullcalendar/interaction')).default;

    this.calendarRef.nativeElement.innerHTML = '';

    this.calendar = new Calendar(this.calendarRef.nativeElement, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      height: 'auto',
      contentHeight: 'auto',
      events: [] // You can replace this later with real events
    });

    this.calendar.render();
  }

  private destroyCalendar(): void {
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }
  }
}
