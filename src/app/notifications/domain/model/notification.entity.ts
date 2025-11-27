import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface NotificationItem extends BaseEntity {
  userId: number | null;
  message: string;
  type: string;
  isRead: boolean;
  createdAt?: string | null;
}

