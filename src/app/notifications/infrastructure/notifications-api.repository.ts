import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { NotificationRepository } from '../domain/notification.repository';
import { NotificationItem } from '../domain/notification.entity';
import { NotificationsApi } from './notifications-api';

@Injectable({ providedIn: 'root' })
export class NotificationsApiRepository implements NotificationRepository {
  constructor(private readonly api: NotificationsApi) {}

  list(): Observable<NotificationItem[]> {
    return this.api.getNotifications();
  }

  listByUserId(userId: number): Observable<NotificationItem[]> {
    return this.api.getNotificationsByUserId(userId);
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.api.markAsRead(id);
  }

  markAllAsRead(ids: number[]): Observable<NotificationItem[]> {
    // El API endpoint ya soporta markAllAsRead, pero dejamos fallback por si cambia
    return this.api.markAllAsRead(ids);
  }

  remove(id: number): Observable<void> {
    return this.api.delete(id);
  }
}

