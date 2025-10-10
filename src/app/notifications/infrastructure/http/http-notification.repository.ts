import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationRepository } from '../../domain/notification.repository';
import { NotificationItem } from '../../domain/notification.entity';
import { forkJoin, map, Observable } from 'rxjs';
import { NotificationDto } from './notification.dto';
import { notificationFromDto } from '../mappers/notification.mapper';

@Injectable({ providedIn: 'root' })
export class HttpNotificationRepository implements NotificationRepository {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://dogimax-api.arroz.dev/notificaciones';

  list(): Observable<NotificationItem[]> {
    return this.http.get<NotificationDto[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(notificationFromDto))
    );
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.http.patch<NotificationDto>(`${this.baseUrl}/${id}`, { leido: true }).pipe(
      map(notificationFromDto)
    );
  }

  markAllAsRead(ids: number[]): Observable<NotificationItem[]> {
    return forkJoin(ids.map(id => this.markAsRead(id)));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
