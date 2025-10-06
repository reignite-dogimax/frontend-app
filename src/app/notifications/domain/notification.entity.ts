export interface NotificationItem {
  id: number;
  usuarioId: number | null;
  mensaje: string;
  tipo: string;
  leido: boolean;
  createdAt?: string | null;
}

