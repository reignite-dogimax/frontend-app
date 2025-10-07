import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { NotificationsApiEndpoint } from './notifications-api-endpoint';
import { Observable } from 'rxjs';
import { NotificationItem } from '../domain/notification.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsApi extends BaseApi {
  private readonly endpoint: NotificationsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.endpoint = new NotificationsApiEndpoint(http);
  }

  getNotifications(): Observable<NotificationItem[]> {
    return this.endpoint.getAll();
  }

  getNotification(id: number): Observable<NotificationItem> {
    return this.endpoint.getById(id);
  }

  create(notification: NotificationItem): Observable<NotificationItem> {
    return this.endpoint.create(notification);
  }

  update(notification: NotificationItem): Observable<NotificationItem> {
    return this.endpoint.update(notification, notification.id);
  }

  delete(id: number): Observable<void> {
    return this.endpoint.delete(id);
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.endpoint.markAsRead(id);
  }

  markAllAsRead(ids: number[]): Observable<NotificationItem[]> {
    return this.endpoint.markAllAsRead(ids);
  }
}

