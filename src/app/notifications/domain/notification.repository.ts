import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationItem } from './notification.entity';

export interface NotificationRepository {
  list(): Observable<NotificationItem[]>;
  markAsRead(id: number): Observable<NotificationItem>;
  markAllAsRead(ids: number[]): Observable<NotificationItem[]>;
  remove(id: number): Observable<void>;
}

export const NOTIFICATION_REPOSITORY = new InjectionToken<NotificationRepository>('NOTIFICATION_REPOSITORY');

