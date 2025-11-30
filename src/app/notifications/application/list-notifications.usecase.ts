import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationItem } from '../domain/notification.entity';
import { NOTIFICATION_REPOSITORY, NotificationRepository } from '../domain/notification.repository';

@Injectable({ providedIn: 'root' })
export class ListNotificationsUseCase {
  constructor(@Inject(NOTIFICATION_REPOSITORY) private readonly repo: NotificationRepository) {}
  
  execute(userId?: number): Observable<NotificationItem[]> {
    return userId ? this.repo.listByUserId(userId) : this.repo.list();
  }
}

