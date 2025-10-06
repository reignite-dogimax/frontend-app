import { Component, effect, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { NotificationsStore } from '../../state/notifications.store';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

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
      if (!this.store.items().length && !this.store.loading()) {
        this.store.load();
      }
    });
  }
}
