import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota, CreateMascotaRequest, UpdateMascotaRequest } from '../../domain/models/mascota.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly baseUrl = environment.apiUrl;
  private readonly storageKey = 'dm_local_mascotas';

  constructor(private http: HttpClient) {}

  // Obtener todas las mascotas de un usuario
  getMascotasByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.baseUrl}/mascotas?usuarioId=${usuarioId}`).pipe(
      // Fallback a localStorage si el servidor no está disponible
      // No usamos catchError de RxJS aquí para mantener tipos; importarlo si es necesario
    );
  }

  // Obtener una mascota por ID
  getMascotaById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/mascotas/${id}`);
  }

  // Crear una nueva mascota
  createMascota(mascota: CreateMascotaRequest): Observable<Mascota> {
    const mascotaData = {
      ...mascota,
      fechaRegistro: new Date().toISOString(),
      activo: true
    };
    return new Observable<Mascota>((subscriber) => {
      this.http.post<Mascota>(`${this.baseUrl}/mascotas`, mascotaData).subscribe({
        next: (res) => {
          subscriber.next(res);
          subscriber.complete();
        },
        error: () => {
          // Fallback: guardar en localStorage cuando json-server no está corriendo
          const current = this.readLocalMascotas();
          const nextId = current.length > 0 ? Math.max(...current.map(m => m.id)) + 1 : 1;
          const saved: Mascota = { id: nextId, ...mascotaData } as Mascota;
          this.writeLocalMascotas([...current, saved]);
          subscriber.next(saved);
          subscriber.complete();
        }
      });
    });
  }

  // Actualizar una mascota existente
  updateMascota(id: number, mascota: UpdateMascotaRequest): Observable<Mascota> {
    return this.http.patch<Mascota>(`${this.baseUrl}/mascotas/${id}`, mascota);
  }

  // Eliminar una mascota (soft delete)
  deleteMascota(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/mascotas/${id}`, { activo: false });
  }

  // Obtener todas las mascotas (para administradores)
  getAllMascotas(): Observable<Mascota[]> {
    return new Observable<Mascota[]>((subscriber) => {
      this.http.get<Mascota[]>(`${this.baseUrl}/mascotas`).subscribe({
        next: (res) => {
          const merged = this.mergeWithLocal(res);
          subscriber.next(merged);
          subscriber.complete();
        },
        error: () => {
          subscriber.next(this.readLocalMascotas());
          subscriber.complete();
        }
      });
    });
  }

  // Buscar mascotas por criterios
  searchMascotas(criteria: {
    nombre?: string;
    especie?: string;
    raza?: string;
    usuarioId?: number;
  }): Observable<Mascota[]> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    return new Observable<Mascota[]>((subscriber) => {
      this.http.get<Mascota[]>(`${this.baseUrl}/mascotas?${params.toString()}`).subscribe({
        next: (res) => {
          subscriber.next(this.mergeWithLocal(res));
          subscriber.complete();
        },
        error: () => {
          const all = this.readLocalMascotas();
          const filtered = all.filter(m =>
            (criteria.nombre ? m.nombre.toLowerCase().includes(criteria.nombre!.toLowerCase()) : true) &&
            (criteria.especie ? m.especie === criteria.especie : true) &&
            (criteria.raza ? m.raza === criteria.raza : true) &&
            (criteria.usuarioId ? m.usuarioId === criteria.usuarioId : true)
          );
          subscriber.next(filtered);
          subscriber.complete();
        }
      });
    });
  }

  // Helpers de almacenamiento local
  private readLocalMascotas(): Mascota[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as Mascota[]) : [];
    } catch {
      return [];
    }
  }

  private writeLocalMascotas(items: Mascota[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {}
  }

  private mergeWithLocal(serverItems: Mascota[]): Mascota[] {
    const local = this.readLocalMascotas();
    // Evitar duplicados por id
    const ids = new Set(serverItems.map(m => m.id));
    const onlyLocal = local.filter(m => !ids.has(m.id));
    return [...serverItems, ...onlyLocal];
  }
}
