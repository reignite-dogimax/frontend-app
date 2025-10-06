import { NotificationItem } from '../../domain/notification.entity';
import { NotificationDto } from '../http/notification.dto';

export function notificationFromDto(dto: NotificationDto): NotificationItem {
  return {
    id: dto.id,
    usuarioId: dto.usuarioId,
    mensaje: dto.mensaje,
    tipo: dto.tipo,
    leido: dto.leido,
    createdAt: dto.createdAt ?? null
  };
}

export function notificationToDto(entity: NotificationItem): NotificationDto {
  return {
    id: entity.id,
    usuarioId: entity.usuarioId,
    mensaje: entity.mensaje,
    tipo: entity.tipo,
    leido: entity.leido,
    createdAt: entity.createdAt ?? null
  };
}
