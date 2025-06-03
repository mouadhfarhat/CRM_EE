import { Directive, ElementRef, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { HeatmapTrackingService } from './HeatmapTracking.service';

@Directive({
  selector: '[appTrackInteraction]',
  standalone: true
})
export class TrackingDirective implements OnInit, OnDestroy {
  @Input() trackType: string = 'click';
  @Input() formationId?: number;
  @Input() categoryId?: number;
  @Input() trackScrollDepth: boolean = false;
  @Input() trackTimeSpent: boolean = false;

  private startTime: number = 0;
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private scrollTimer: any;

  constructor(
    private el: ElementRef,
    private HeatmapTrackingService: HeatmapTrackingService
  ) {}

  ngOnInit() {
    if (this.trackTimeSpent) {
      this.startTime = Date.now();
    }

    if (this.trackScrollDepth) {
      this.setupScrollTracking();
    }
  }

  ngOnDestroy() {
    if (this.trackTimeSpent && this.startTime > 0) {
      const timeSpent = Date.now() - this.startTime;
      this.HeatmapTrackingService.trackInteraction({
        eventType: 'time_spent',
        elementId: this.getElementId(),
        elementType: this.getElementType(),
        timeSpent: Math.round(timeSpent / 1000), // Convert to seconds
        formationId: this.formationId,
        categoryId: this.categoryId
      });
    }

    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.trackType === 'click' || this.trackType === 'all') {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.HeatmapTrackingService.trackClick(
        this.getElementId(),
        this.getElementType(),
        Math.round(x),
        Math.round(y)
      );

      // Also track the interaction with additional context
      this.HeatmapTrackingService.trackInteraction({
        eventType: 'click',
        elementId: this.getElementId(),
        elementType: this.getElementType(),
        xCoordinate: Math.round(x),
        yCoordinate: Math.round(y),
        formationId: this.formationId,
        categoryId: this.categoryId
      });
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.trackType === 'hover' || this.trackType === 'all') {
      this.HeatmapTrackingService.trackInteraction({
        eventType: 'hover',
        elementId: this.getElementId(),
        elementType: this.getElementType(),
        formationId: this.formationId,
        categoryId: this.categoryId
      });
    }
  }

  @HostListener('focus')
  onFocus() {
    if (this.trackType === 'focus' || this.trackType === 'all') {
      this.HeatmapTrackingService.trackInteraction({
        eventType: 'focus',
        elementId: this.getElementId(),
        elementType: this.getElementType(),
        formationId: this.formationId,
        categoryId: this.categoryId
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.trackScrollDepth) {
      this.calculateScrollDepth();
    }
  }

  private setupScrollTracking() {
    // Track scroll depth periodically
    setInterval(() => {
      this.calculateScrollDepth();
    }, 1000);
  }

  private calculateScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    this.scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
    
    // Track significant scroll milestones
    if (this.scrollDepth > this.maxScrollDepth && this.scrollDepth % 25 === 0) {
      this.maxScrollDepth = this.scrollDepth;
      this.HeatmapTrackingService.trackScrollDepth(this.scrollDepth);
    }
  }

  private getElementId(): string {
    return this.el.nativeElement.id || 
           this.el.nativeElement.className || 
           this.el.nativeElement.tagName.toLowerCase() + '_' + Date.now();
  }

  private getElementType(): string {
    const element = this.el.nativeElement;
    
    if (element.tagName === 'BUTTON') return 'button';
    if (element.tagName === 'A') return 'link';
    if (element.tagName === 'INPUT') return 'input';
    if (element.tagName === 'SELECT') return 'select';
    if (element.classList.contains('card')) return 'card';
    if (element.classList.contains('formation-item')) return 'formation';
    if (element.classList.contains('category-item')) return 'category';
    
    return element.tagName.toLowerCase();
  }