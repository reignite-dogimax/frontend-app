import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface NotificationItem extends BaseEntity {
  usuarioId: number | null;
  mensaje: string;
  tipo: string;
  leido: boolean;
  createdAt?: string | null;
}

