import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationItem } from '../domain/notification.entity';
import { NOTIFICATION_REPOSITORY, NotificationRepository } from '../domain/notification.repository';

@Injectable({ providedIn: 'root' })
export class MarkAsReadUseCase {
  constructor(@Inject(NOTIFICATION_REPOSITORY) private readonly repo: NotificationRepository) {}
  execute(id: number): Observable<NotificationItem> {
    return this.repo.markAsRead(id);
  }
}

