import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationItem } from '../domain/notification.entity';
import { NOTIFICATION_REPOSITORY, NotificationRepository } from '../domain/notification.repository';

@Injectable({ providedIn: 'root' })
export class MarkAllAsReadUseCase {
  constructor(@Inject(NOTIFICATION_REPOSITORY) private readonly repo: NotificationRepository) {}
  execute(ids: number[]): Observable<NotificationItem[]> {
    if (!ids?.length) return of([]);
    return this.repo.markAllAsRead(ids);
  }
}

