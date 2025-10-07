import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { NotificationItem } from '../domain/notification.entity';
import { NotificationAssembler } from './notification-assembler';
import { NotificationResource, NotificationsResponse } from './notifications-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class NotificationsApiEndpoint extends BaseApiEndpoint<NotificationItem, NotificationResource, NotificationsResponse, NotificationAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}${environment.notificationsEndpoint}`, new NotificationAssembler());
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.http.patch<NotificationResource>(`${this.endpointUrl}/${id}`, { leido: true }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to mark notification as read'))
    );
  }

  markAllAsRead(ids: number[]): Observable<NotificationItem[]> {
    return forkJoin(ids.map(id => this.markAsRead(id)));
  }
}

