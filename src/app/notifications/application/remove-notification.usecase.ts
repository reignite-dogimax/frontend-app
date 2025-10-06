import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NOTIFICATION_REPOSITORY, NotificationRepository } from '../domain/notification.repository';

@Injectable({ providedIn: 'root' })
export default class RemoveNotificationUseCase {
  constructor(@Inject(NOTIFICATION_REPOSITORY) private readonly repo: NotificationRepository) {}
  execute(id: number): Observable<void> {
    return this.repo.remove(id);
  }
}

