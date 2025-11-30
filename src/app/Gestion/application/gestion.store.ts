import { computed, Injectable, Signal, signal } from '@angular/core';
import { Pet } from '../domain/model/pet.entity';
import { MedicalHistory } from '../domain/model/medical-history.entity';
import { Recommendation } from '../domain/model/recommendation.entity';
import { GestionApi } from '../infrastructure/gestion-api';
import { Observable, retry, tap } from 'rxjs';

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
  
  private readonly mascotasSignal = signal<Pet[]>([]);
  readonly mascotas = this.mascotasSignal.asReadonly();
  
  private readonly historialesSignal = signal<MedicalHistory[]>([]);
  readonly historiales = this.historialesSignal.asReadonly();
  
  private readonly recomendacionesSignal = signal<Recommendation[]>([]);
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
   * Retrieves a pet by its ID as a signal.
   * @param id - The ID of the pet.
   * @returns A Signal containing the Pet object or undefined if not found.
   */
  getMascotaById(id: number): Signal<Pet | undefined> {
    return computed(() => id ? this.mascotas().find(m => m.id === id) : undefined);
  }

  /**
   * Retrieves a medical history by its ID as a signal.
   * @param id - The ID of the medical history.
   * @returns A Signal containing the MedicalHistory object or undefined if not found.
   */
  getHistorialById(id: number): Signal<MedicalHistory | undefined> {
    return computed(() => id ? this.historiales().find(h => h.id === id) : undefined);
  }

  /**
   * Retrieves a recommendation by its ID as a signal.
   * @param id - The ID of the recommendation.
   * @returns A Signal containing the Recommendation object or undefined if not found.
   */
  getRecomendacionById(id: number): Signal<Recommendation | undefined> {
    return computed(() => id ? this.recomendaciones().find(r => r.id === id) : undefined);
  }

  /**
   * Retrieves pets by user ID as a signal.
   * @param usuarioId - The ID of the user.
   * @returns A Signal containing filtered Pet array.
   */
  getMascotasByUsuario(usuarioId: number): Signal<Pet[]> {
    return computed(() => this.mascotas().filter(m => m.userId === usuarioId));
  }

  /**
   * Retrieves medical histories by pet ID as a signal.
   * @param mascotaId - The ID of the pet.
   * @returns A Signal containing filtered MedicalHistory array.
   */
  getHistorialesByMascota(mascotaId: number): Signal<MedicalHistory[]> {
    return computed(() => this.historiales().filter(h => h.petId === mascotaId));
  }

  /**
   * Retrieves recommendations by pet ID as a signal.
   * @param mascotaId - The ID of the pet.
   * @returns A Signal containing filtered Recommendation array.
   */
  getRecomendacionesByMascota(mascotaId: number): Signal<Recommendation[]> {
    return computed(() => this.recomendaciones().filter(r => r.petId === mascotaId));
  }

  /**
   * Adds a new pet.
   * @param mascota - The pet to add.
   * @returns Observable that completes when the pet is created
   */
  addMascota(mascota: Pet): Observable<Pet> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.createMascota(mascota).pipe(
      retry(2),
      tap({
        next: createdMascota => {
          this.mascotasSignal.update(mascotas => [...mascotas, createdMascota]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create pet'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Updates an existing pet.
   * @param updatedMascota - The pet to update.
   * @returns Observable that completes when the pet is updated
   */
  updateMascota(updatedMascota: Pet): Observable<Pet> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.updateMascota(updatedMascota).pipe(
      retry(2),
      tap({
        next: updated => {
          this.mascotasSignal.update(mascotas =>
            mascotas.map(m => m.id === updated.id ? updated : m)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update pet'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Deletes a pet by ID.
   * @param id - The ID of the pet to delete.
   * @returns Observable that completes when the pet is deleted
   */
  deleteMascota(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.deleteMascota(id).pipe(
      retry(2),
      tap({
        next: () => {
          this.mascotasSignal.update(mascotas => mascotas.filter(m => m.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete pet'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Adds a new medical history.
   * @param historial - The medical history to add.
   * @returns Observable that completes when the medical history is created
   */
  addHistorial(historial: MedicalHistory): Observable<MedicalHistory> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.createHistorial(historial).pipe(
      retry(2),
      tap({
        next: created => {
          this.historialesSignal.update(historiales => [...historiales, created]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create medical history'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Updates an existing medical history.
   * @param updatedHistorial - The medical history to update.
   * @returns Observable that completes when the medical history is updated
   */
  updateHistorial(updatedHistorial: MedicalHistory): Observable<MedicalHistory> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.updateHistorial(updatedHistorial).pipe(
      retry(2),
      tap({
        next: updated => {
          this.historialesSignal.update(historiales =>
            historiales.map(h => h.id === updated.id ? updated : h)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update medical history'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Deletes a medical history by ID.
   * @param id - The ID of the medical history to delete.
   * @returns Observable that completes when the medical history is deleted
   */
  deleteHistorial(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.deleteHistorial(id).pipe(
      retry(2),
      tap({
        next: () => {
          this.historialesSignal.update(historiales => historiales.filter(h => h.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete medical history'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Adds a new recommendation.
   * @param recomendacion - The recommendation to add.
   * @returns Observable that completes when the recommendation is created
   */
  addRecomendacion(recomendacion: Recommendation): Observable<Recommendation> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.createRecomendacion(recomendacion).pipe(
      retry(2),
      tap({
        next: created => {
          this.recomendacionesSignal.update(recomendaciones => [...recomendaciones, created]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create recommendation'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Updates an existing recommendation.
   * @param updatedRecomendacion - The recommendation to update.
   * @returns Observable that completes when the recommendation is updated
   */
  updateRecomendacion(updatedRecomendacion: Recommendation): Observable<Recommendation> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.updateRecomendacion(updatedRecomendacion).pipe(
      retry(2),
      tap({
        next: updated => {
          this.recomendacionesSignal.update(recomendaciones =>
            recomendaciones.map(r => r.id === updated.id ? updated : r)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update recommendation'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Deletes a recomendacion by ID.
   * @param id - The ID of the recomendacion to delete.
   * @returns Observable that completes when the recommendation is deleted
   */
  deleteRecomendacion(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.gestionApi.deleteRecomendacion(id).pipe(
      retry(2),
      tap({
        next: () => {
          this.recomendacionesSignal.update(recomendaciones => recomendaciones.filter(r => r.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete recommendation'));
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Sets the mascotas data.
   * @param mascotas - Array of pets to set.
   */
  setMascotas(mascotas: Pet[]): void {
    this.mascotasSignal.set(mascotas);
  }

  /**
   * Sets the historiales data.
   * @param historiales - Array of medical histories to set.
   */
  setHistoriales(historiales: MedicalHistory[]): void {
    this.historialesSignal.set(historiales);
  }

  /**
   * Sets the recomendaciones data.
   * @param recomendaciones - Array of recommendations to set.
   */
  setRecomendaciones(recomendaciones: Recommendation[]): void {
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
    this.gestionApi.getMascotas().subscribe({
      next: mascotas => {
        console.log('GestionStore: Mascotas loaded successfully:', mascotas.length, 'items');
        this.mascotasSignal.set(mascotas);
      },
      error: err => {
        console.error('GestionStore: Error loading mascotas:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load mascotas'));
      }
    });
  }

  /**
   * Loads all historiales from the API.
   */
  private loadHistoriales(): void {
    console.log('GestionStore: Loading historiales from API...');
    this.gestionApi.getHistoriales().subscribe({
      next: historiales => {
        console.log('GestionStore: Historiales loaded successfully:', historiales.length, 'items');
        this.historialesSignal.set(historiales);
      },
      error: err => {
        console.error('GestionStore: Error loading historiales:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load historiales'));
      }
    });
  }

  /**
   * Loads all recomendaciones from the API.
   */
  private loadRecomendaciones(): void {
    console.log('GestionStore: Loading recomendaciones from API...');
    this.gestionApi.getRecomendaciones().subscribe({
      next: recomendaciones => {
        console.log('GestionStore: Recomendaciones loaded successfully:', recomendaciones.length, 'items');
        this.recomendacionesSignal.set(recomendaciones);
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
