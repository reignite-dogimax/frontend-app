import { computed, Injectable, signal, inject } from '@angular/core';
import { NotificationItem } from '../../domain/notification.entity';
import { ListNotificationsUseCase } from '../../application/list-notifications.usecase';
import { MarkAsReadUseCase } from '../../application/mark-as-read.usecase';
import { MarkAllAsReadUseCase } from '../../application/mark-all-as-read.usecase';
import RemoveNotificationUseCase from '../../application/remove-notification.usecase';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly _items = signal<NotificationItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  // Nuevo: flag para evitar recargas infinitas cuando la lista viene vacía
  private readonly _loaded = signal(false);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly unreadCount = computed(() => this._items().filter(n => !n.leido).length);
  readonly unreadItems = computed(() => this._items().filter(n => !n.leido));

  // Use cases inyectados según DDD
  private readonly listNotifications: ListNotificationsUseCase = inject(ListNotificationsUseCase);
  private readonly markAsReadUc: MarkAsReadUseCase = inject(MarkAsReadUseCase);
  private readonly markAllAsReadUc: MarkAllAsReadUseCase = inject(MarkAllAsReadUseCase);
  private readonly removeNotificationUc: RemoveNotificationUseCase = inject(RemoveNotificationUseCase);

  async load() {
    // Si ya se intentó cargar y no estamos forzando, evita repetir
    if (this._loaded() || this._loading()) return;

    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.listNotifications.execute());
      this._items.set(data ?? []);
    } catch (e: any) {
      this._error.set(e?.message ?? 'Error loading notifications');
    } finally {
      this._loading.set(false);
      // Marcamos como que ya se intentó cargar (aunque la lista esté vacía o haya error)
      this._loaded.set(true);
    }
  }

  // Método opcional para forzar recarga manual si se requiere en el futuro
  async reload() {
    this._loaded.set(false);
    await this.load();
  }

  async markAsRead(id: number) {
    try {
      await firstValueFrom(this.markAsReadUc.execute(id));
      this._items.update(list => list.map(n => n.id === id ? { ...n, leido: true } : n));
    } catch {}
  }

  async markAllAsRead() {
    const ids = this._items().filter(n => !n.leido).map(n => n.id);
    try {
      if (ids.length === 0) return;
      await firstValueFrom(this.markAllAsReadUc.execute(ids));
      this._items.update(list => list.map(n => ({ ...n, leido: true })));
    } catch {}
  }

  async remove(id: number) {
    try {
      await firstValueFrom(this.removeNotificationUc.execute(id));
      this._items.update(list => list.filter(n => n.id !== id));
    } catch {}
  }
}
