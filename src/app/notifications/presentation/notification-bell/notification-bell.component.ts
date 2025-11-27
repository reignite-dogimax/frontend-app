import { Component, effect, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { NotificationsStore } from '../state/notifications.store';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationItem } from '../../domain/notification.entity';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [MatIcon, MatIconButton, MatBadge, MatMenu, MatMenuItem, MatMenuTrigger, NgFor, NgIf, SlicePipe, RouterLink, MatButton, TranslatePipe],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent {
  store = inject(NotificationsStore);

  constructor() {
    effect(() => {
      if (!this.store.loaded() && !this.store.loading()) {
        this.store.load();
      }
    });
  }

  handleNotificationClick(notification: NotificationItem) {
    if (!notification.isRead) {
      this.store.markAsRead(notification.id);
    }
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'RecordatorioCita': 'event',
      'RecordatorioPago': 'payment',
      'Promocion': 'local_offer',
      'ResultadoExamen': 'assignment',
      'Confirmacion': 'check_circle',
      'RecordatorioSalud': 'health_and_safety',
      'Encuesta': 'poll',
      'AnuncioGeneral': 'campaign',
      'NotificacionCompra': 'shopping_cart',
      'Bienvenida': 'waving_hand'
    };
    return icons[type] || 'notifications';
  }

  getTypeColor(type: string): string {
    return 'transparent';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'RecordatorioCita': 'notifications.types.appointment',
      'RecordatorioPago': 'notifications.types.payment',
      'Promocion': 'notifications.types.promotion',
      'ResultadoExamen': 'notifications.types.exam',
      'Confirmacion': 'notifications.types.confirmation',
      'RecordatorioSalud': 'notifications.types.health',
      'Encuesta': 'notifications.types.survey',
      'AnuncioGeneral': 'notifications.types.announcement',
      'NotificacionCompra': 'notifications.types.purchase',
      'Bienvenida': 'notifications.types.welcome'
    };
    return labels[type] || 'notifications.types.general';
  }

  getTimeAgo(date: Date | string | null | undefined): string {
    if (!date) return '';
    
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays}d`;
  }
}
