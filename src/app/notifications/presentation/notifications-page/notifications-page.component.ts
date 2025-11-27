import { Component, computed, inject, signal } from '@angular/core';
import { NotificationsStore } from '../state/notifications.store';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NgFor, NgIf, MatIcon, MatButton, MatButtonToggleGroup, MatButtonToggle, TranslatePipe],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class NotificationsPageComponent {
  store = inject(NotificationsStore);
  filter = signal<'all' | 'unread'>('all');

  readonly filtered = computed(() => {
    const list = this.store.items();
    return this.filter() === 'unread' ? list.filter(n => !n.isRead) : list;
  });

  readonly groupedNotifications = computed(() => {
    const notifications = this.filtered();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    return {
      today: notifications.filter(n => {
        const notifDate = new Date(n.createdAt || Date.now());
        return notifDate >= today;
      }),
      yesterday: notifications.filter(n => {
        const notifDate = new Date(n.createdAt || Date.now());
        return notifDate >= yesterday && notifDate < today;
      }),
      older: notifications.filter(n => {
        const notifDate = new Date(n.createdAt || Date.now());
        return notifDate < yesterday;
      })
    };
  });

  ngOnInit() {
    if (!this.store.loaded()) {
      this.store.load();
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
