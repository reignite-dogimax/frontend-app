import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { NotificationItem } from '../domain/notification.entity';
import { NotificationResource, NotificationsResponse } from './notifications-response';

export class NotificationAssembler implements BaseAssembler<NotificationItem, NotificationResource, NotificationsResponse> {
  toEntityFromResource(resource: NotificationResource): NotificationItem {
    return {
      id: resource.id,
      userId: resource.userId,
      message: resource.message,
      type: resource.type,
      isRead: resource.isRead,
      createdAt: resource.createdAt ?? null
    };
  }

  toResourceFromEntity(entity: NotificationItem): NotificationResource {
    return {
      id: entity.id,
      userId: entity.userId,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead,
      createdAt: entity.createdAt ?? null
    };
  }

  toEntitiesFromResponse(response: NotificationsResponse): NotificationItem[] {
    return response.notificaciones.map(resource => this.toEntityFromResource(resource));
  }
}

