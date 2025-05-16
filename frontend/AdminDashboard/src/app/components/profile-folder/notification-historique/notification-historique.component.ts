import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification1/notification.service';
import { NotificationType } from '../../../domains/enums';
import { Notification } from '../../../domains/notification.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-notification-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-historique.component.html',
  styleUrl: './notification-historique.component.css'
})
export class NotificationHistoriqueComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getClientId().subscribe(clientId => {
      this.notificationService.getClientNotifications(clientId).subscribe(data => {
        this.notifications = data;
      });
    });
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.NEW_COURSE: return '📚';
      case NotificationType.GROUP_CREATED: return '👥';
      case NotificationType.CALENDAR_EVENT: return '🗓️';
      case NotificationType.REMINDER: return '⏰';
      case NotificationType.STATUS_UPDATE: return '🔄';
      case NotificationType.RATING_REQUEST: return '⭐';
      default: return '🔔';
    }
  }
}
