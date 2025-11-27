import { NotificationItem } from '../../domain/notification.entity';
import { NotificationDto } from '../http/notification.dto';

export function notificationFromDto(dto: NotificationDto): NotificationItem {
  return {
    id: dto.id,
    userId: dto.userId,
    message: dto.message,
    type: dto.type,
    isRead: dto.isRead,
    createdAt: dto.createdAt ?? null
  };
}

export function notificationToDto(entity: NotificationItem): NotificationDto {
  return {
    id: entity.id,
    userId: entity.userId,
    message: entity.message,
    type: entity.type,
    isRead: entity.isRead,
    createdAt: entity.createdAt ?? null
  };
}
