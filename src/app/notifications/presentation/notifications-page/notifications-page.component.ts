import { Component, computed, inject, signal } from '@angular/core';
import { NotificationsStore } from '../state/notifications.store';
import { NgFor, NgIf } from '@angular/common';
import { MatList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NgFor, NgIf, MatList, MatListItem, MatListItemIcon, MatListItemTitle, MatIcon, MatButton, MatButtonToggleGroup, MatButtonToggle, TranslatePipe],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent {
  store = inject(NotificationsStore);
  filter = signal<'all' | 'unread'>('all');

  readonly filtered = computed(() => {
    const list = this.store.items();
    return this.filter() === 'unread' ? list.filter(n => !n.leido) : list;

  });

  ngOnInit() {
    // Evita relanzar si ya se intentó cargar
    if (!this.store.loaded()) {
      this.store.load();
    }
  }

  icon(tipo: string, leido: boolean) {
    if (!leido) return 'circle_notifications';
    switch (tipo) {
      case 'RecordatorioCita': return 'calendar_today';
      case 'RecordatorioPago': return 'payment';
      case 'Promocion': return 'local_offer';
      case 'ResultadoExamen': return 'science';
      case 'Confirmacion': return 'check_circle';
      case 'RecordatorioSalud': return 'health_and_safety';
      case 'Encuesta': return 'poll';
      case 'AnuncioGeneral': return 'campaign';
      case 'NotificacionCompra': return 'shopping_bag';
      case 'Bienvenida': return 'person_add';
      default: return 'notifications';
    }
  }
}
