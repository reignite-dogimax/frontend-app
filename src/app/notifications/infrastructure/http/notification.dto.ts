export interface NotificationDto {
  id: number;
  userId: number | null;
  message: string;
  type: string;
  isRead: boolean;
  createdAt?: string | null;
}

