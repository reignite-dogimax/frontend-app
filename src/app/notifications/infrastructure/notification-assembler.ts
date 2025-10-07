import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { NotificationItem } from '../domain/notification.entity';
import { NotificationResource, NotificationsResponse } from './notifications-response';

export class NotificationAssembler implements BaseAssembler<NotificationItem, NotificationResource, NotificationsResponse> {
  toEntityFromResource(resource: NotificationResource): NotificationItem {
    return {
      id: resource.id,
      usuarioId: resource.usuarioId,
      mensaje: resource.mensaje,
      tipo: resource.tipo,
      leido: resource.leido,
      createdAt: resource.createdAt ?? null
    };
  }

  toResourceFromEntity(entity: NotificationItem): NotificationResource {
    return {
      id: entity.id,
      usuarioId: entity.usuarioId,
      mensaje: entity.mensaje,
      tipo: entity.tipo,
      leido: entity.leido,
      createdAt: entity.createdAt ?? null
    };
  }

  toEntitiesFromResponse(response: NotificationsResponse): NotificationItem[] {
    return response.notificaciones.map(resource => this.toEntityFromResource(resource));
  }
}

