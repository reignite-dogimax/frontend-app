import { BaseResource } from '../../shared/infrastructure/base-response';

export interface NotificationResource extends BaseResource {
  id: number;
  userId: number | null;
  message: string;
  type: string;
  isRead: boolean;
  createdAt?: string | null;
}

export interface NotificationsResponse {
  notificaciones: NotificationResource[];
}

