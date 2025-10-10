import { computed, Injectable, Signal, signal } from '@angular/core';
import { Mascota } from '../domain/model/mascota.entity';
import { HistorialMedico } from '../domain/model/historial-medico.entity';
import { Recomendacion } from '../domain/model/recomendacion.entity';
import { GestionApi } from '../infrastructure/gestion-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

/**
 * State management store for Gestion using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class GestionStore {
  readonly mascotaCount = computed(() => this.mascotas().length);
  readonly historialCount = computed(() => this.historiales().length);
  readonly recomendacionCount = computed(() => this.recomendaciones().length);
  
  private readonly mascotasSignal = signal<Mascota[]>([]);
  readonly mascotas = this.mascotasSignal.asReadonly();
  
  private readonly historialesSignal = signal<HistorialMedico[]>([]);
  readonly historiales = this.historialesSignal.asReadonly();
  
  private readonly recomendacionesSignal = signal<Recomendacion[]>([]);
  readonly recomendaciones = this.recomendacionesSignal.asReadonly();
  
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private gestionApi: GestionApi) {
    this.loadMascotas();
    this.loadHistoriales();
    this.loadRecomendaciones();
  }

  /**
   * Retrieves a mascota by its ID as a signal.
   * @param id - The ID of the mascota.
   * @returns A Signal containing the Mascota object or undefined if not found.
   */
  getMascotaById(id: number): Signal<Mascota | undefined> {
    return computed(() => id ? this.mascotas().find(m => m.id === id) : undefined);
  }

  /**
   * Retrieves a historial by its ID as a signal.
   * @param id - The ID of the historial.
   * @returns A Signal containing the HistorialMedico object or undefined if not found.
   */
  getHistorialById(id: number): Signal<HistorialMedico | undefined> {
    return computed(() => id ? this.historiales().find(h => h.id === id) : undefined);
  }

  /**
   * Retrieves a recomendacion by its ID as a signal.
   * @param id - The ID of the recomendacion.
   * @returns A Signal containing the Recomendacion object or undefined if not found.
   */
  getRecomendacionById(id: number): Signal<Recomendacion | undefined> {
    return computed(() => id ? this.recomendaciones().find(r => r.id === id) : undefined);
  }

  /**
   * Retrieves mascotas by usuario ID as a signal.
   * @param usuarioId - The ID of the usuario.
   * @returns A Signal containing filtered Mascota array.
   */
  getMascotasByUsuario(usuarioId: number): Signal<Mascota[]> {
    return computed(() => this.mascotas().filter(m => m.usuarioId === usuarioId));
  }

  /**
   * Retrieves historiales by mascota ID as a signal.
   * @param mascotaId - The ID of the mascota.
   * @returns A Signal containing filtered HistorialMedico array.
   */
  getHistorialesByMascota(mascotaId: number): Signal<HistorialMedico[]> {
    return computed(() => this.historiales().filter(h => h.mascotaId === mascotaId));
  }

  /**
   * Retrieves recomendaciones by mascota ID as a signal.
   * @param mascotaId - The ID of the mascota.
   * @returns A Signal containing filtered Recomendacion array.
   */
  getRecomendacionesByMascota(mascotaId: number): Signal<Recomendacion[]> {
    return computed(() => this.recomendaciones().filter(r => r.mascotaId === mascotaId));
  }

  /**
   * Adds a new mascota.
   * @param mascota - The mascota to add.
   */
  addMascota(mascota: Mascota): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.gestionApi.createMascota(mascota).pipe(retry(2)).subscribe({
      next: createdMascota => {
        this.mascotasSignal.update(mascotas => [...mascotas, createdMascota]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create mascota'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing mascota.
   * @param updatedMascota - The mascota to update.
   */
  updateMascota(updatedMascota: Mascota): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mascotasSignal.update(mascotas =>
      mascotas.map(m => m.id === updatedMascota.id ? updatedMascota : m)
    );
    this.loadingSignal.set(false);
  }

  /**
   * Deletes a mascota by ID.
   * @param id - The ID of the mascota to delete.
   */
  deleteMascota(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mascotasSignal.update(mascotas => mascotas.filter(m => m.id !== id));
    this.loadingSignal.set(false);
  }

  /**
   * Adds a new historial.
   * @param historial - The historial to add.
   */
  addHistorial(historial: HistorialMedico): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historialesSignal.update(historiales => [...historiales, historial]);
    this.loadingSignal.set(false);
  }

  /**
   * Updates an existing historial.
   * @param updatedHistorial - The historial to update.
   */
  updateHistorial(updatedHistorial: HistorialMedico): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historialesSignal.update(historiales =>
      historiales.map(h => h.id === updatedHistorial.id ? updatedHistorial : h)
    );
    this.loadingSignal.set(false);
  }

  /**
   * Deletes a historial by ID.
   * @param id - The ID of the historial to delete.
   */
  deleteHistorial(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historialesSignal.update(historiales => historiales.filter(h => h.id !== id));
    this.loadingSignal.set(false);
  }

  /**
   * Adds a new recomendacion.
   * @param recomendacion - The recomendacion to add.
   */
  addRecomendacion(recomendacion: Recomendacion): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.recomendacionesSignal.update(recomendaciones => [...recomendaciones, recomendacion]);
    this.loadingSignal.set(false);
  }

  /**
   * Updates an existing recomendacion.
   * @param updatedRecomendacion - The recomendacion to update.
   */
  updateRecomendacion(updatedRecomendacion: Recomendacion): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.recomendacionesSignal.update(recomendaciones =>
      recomendaciones.map(r => r.id === updatedRecomendacion.id ? updatedRecomendacion : r)
    );
    this.loadingSignal.set(false);
  }

  /**
   * Deletes a recomendacion by ID.
   * @param id - The ID of the recomendacion to delete.
   */
  deleteRecomendacion(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.recomendacionesSignal.update(recomendaciones => recomendaciones.filter(r => r.id !== id));
    this.loadingSignal.set(false);
  }

  /**
   * Sets the mascotas data.
   * @param mascotas - Array of mascotas to set.
   */
  setMascotas(mascotas: Mascota[]): void {
    this.mascotasSignal.set(mascotas);
  }

  /**
   * Sets the historiales data.
   * @param historiales - Array of historiales to set.
   */
  setHistoriales(historiales: HistorialMedico[]): void {
    this.historialesSignal.set(historiales);
  }

  /**
   * Sets the recomendaciones data.
   * @param recomendaciones - Array of recomendaciones to set.
   */
  setRecomendaciones(recomendaciones: Recomendacion[]): void {
    this.recomendacionesSignal.set(recomendaciones);
  }

  /**
   * Sets the loading state.
   * @param loading - The loading state.
   */
  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  /**
   * Sets the error state.
   * @param error - The error message or null.
   */
  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  /**
   * Loads all mascotas from the API.
   */
  private loadMascotas(): void {
    console.log('GestionStore: Loading mascotas from API...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.gestionApi.getMascotas().pipe(takeUntilDestroyed()).subscribe({
      next: mascotas => {
        console.log('GestionStore: Mascotas loaded successfully:', mascotas);
        this.mascotasSignal.set(mascotas);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('GestionStore: Error loading mascotas:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load mascotas'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all historiales from the API.
   */
  private loadHistoriales(): void {
    console.log('GestionStore: Loading historiales from API...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.gestionApi.getHistoriales().pipe(takeUntilDestroyed()).subscribe({
      next: historiales => {
        console.log('GestionStore: Historiales loaded successfully:', historiales);
        this.historialesSignal.set(historiales);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('GestionStore: Error loading historiales:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load historiales'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all recomendaciones from the API.
   */
  private loadRecomendaciones(): void {
    console.log('GestionStore: Loading recomendaciones from API...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.gestionApi.getRecomendaciones().pipe(takeUntilDestroyed()).subscribe({
      next: recomendaciones => {
        console.log('GestionStore: Recomendaciones loaded successfully:', recomendaciones);
        this.recomendacionesSignal.set(recomendaciones);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('GestionStore: Error loading recomendaciones:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load recomendaciones'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
