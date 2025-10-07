import { BaseResource } from '../../shared/infrastructure/base-response';

export interface NotificationResource extends BaseResource {
  id: number;
  usuarioId: number | null;
  mensaje: string;
  tipo: string;
  leido: boolean;
  createdAt?: string | null;
}

export interface NotificationsResponse {
  notificaciones: NotificationResource[];
}

