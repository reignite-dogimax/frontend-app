import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { GestionStore } from '../../../../application/gestion.store';
import { Pet } from '../../../../domain/model/pet.entity';
import { MedicalHistory } from '../../../../domain/model/medical-history.entity';
import { Recommendation } from '../../../../domain/model/recommendation.entity';

@Component({
  selector: 'app-mascota-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './mascota-detail.component.html',
  styleUrl: './mascota-detail.component.css'
})
export class MascotaDetailComponent implements OnInit {
  mascota: Pet | null = null;
  historial: MedicalHistory[] = [];
  vacunas: MedicalHistory[] = [];
  recomendaciones: Recommendation[] = [];
  loading = false;
  error: string | null = null;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gestionStore: GestionStore
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const mascotaId = +params['id'];
      if (mascotaId) {
        this.loadMascota(mascotaId);
      }
    });
  }

  loadMascota(id: number): void {
    this.loading = true;
    this.error = null;

    // Usar el store para obtener la mascota
    const mascotaSignal = this.gestionStore.getMascotaById(id);
    const mascota = mascotaSignal();
    
    if (mascota) {
      this.mascota = mascota;
      this.loadRelatedData(id);
    } else {
      this.error = 'Mascota no encontrada';
      this.loading = false;
    }
  }

  loadRelatedData(mascotaId: number): void {
    // Obtener historiales médicos del store
    const historialesSignal = this.gestionStore.getHistorialesByMascota(mascotaId);
    const historiales = historialesSignal();
    this.historial = historiales;
    
    // Filtrar vacunas del historial médico (tipo "Vacuna")
    this.vacunas = historiales.filter(h => h.recordType?.toLowerCase() === 'vacuna');
    
    // Obtener recomendaciones del store
    const recomendacionesSignal = this.gestionStore.getRecomendacionesByMascota(mascotaId);
    this.recomendaciones = recomendacionesSignal();
    
    console.log('Historiales cargados:', this.historial);
    console.log('Vacunas cargadas:', this.vacunas);
    console.log('Recomendaciones cargadas:', this.recomendaciones);
    
    this.loading = false;
  }

  getEdadMascota(fechaNacimiento?: string): string {
    if (!fechaNacimiento) return 'Edad no especificada';
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edadEnMeses = Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (edadEnMeses < 12) {
      return `${edadEnMeses} meses`;
    } else {
      const años = Math.floor(edadEnMeses / 12);
      const mesesRestantes = edadEnMeses % 12;
      return mesesRestantes > 0 ? `${años} años y ${mesesRestantes} meses` : `${años} años`;
    }
  }

  getEspecieIcon(especie: string): string {
    return especie.toLowerCase() === 'perro' ? 'pets' : 'pets';
  }

  getPrioridadColor(prioridad: string): string {
    const prioridadUpper = prioridad?.toUpperCase();
    switch (prioridadUpper) {
      case 'CRITICAL':
      case 'CRITICA':
        return 'chip-critical';
      case 'HIGH':
      case 'ALTA':
        return 'chip-high';
      case 'MEDIUM':
      case 'MEDIA':
        return 'chip-medium';
      case 'LOW':
      case 'BAJA':
        return 'chip-low';
      default:
        return 'chip-medium';
    }
  }

  getTipoIcon(tipo: string): string {
    const tipoUpper = tipo?.toUpperCase();
    switch (tipoUpper) {
      case 'VACCINATION':
      case 'VACUNA':
        return 'vaccines';
      case 'CONSULTATION':
      case 'CONSULTA':
        return 'medical_services';
      case 'SURGERY':
      case 'CIRUGIA':
        return 'healing';
      case 'EXAM':
      case 'EXAMEN':
        return 'science';
      case 'TREATMENT':
      case 'TRATAMIENTO':
        return 'medication';
      default:
        return 'medical_services';
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  goBack(): void {
    this.router.navigate(['/gestion-mascotas/mascotas']);
  }

  generarRecomendaciones(): void {
    if (!this.mascota) return;
    
    // Simular generación de recomendaciones
    console.log('Generando recomendaciones para:', this.mascota.name);
    // En una implementación real, aquí se llamaría al servicio de IA
  }

  marcarCompletada(recomendacionId: number): void {
    const index = this.recomendaciones.findIndex(r => r.id === recomendacionId);
    if (index !== -1) {
      // Crear una nueva instancia de Recommendation con isCompleted actualizado
      const recomendacion = this.recomendaciones[index];
      const recomendacionActualizada = new Recommendation({
        ...recomendacion,
        id: recomendacion.id,
        petId: recomendacion.petId,
        type: recomendacion.type,
        title: recomendacion.title,
        description: recomendacion.description,
        priority: recomendacion.priority,
        generationDate: recomendacion.generationDate,
        expirationDate: recomendacion.expirationDate,
        isCompleted: true,
        completionDate: new Date(),
        aiSource: recomendacion.aiSource,
        confidence: recomendacion.confidence,
        parameters: recomendacion.parameters
      });
      
      // Actualizar en el store
      this.gestionStore.updateRecomendacion(recomendacionActualizada);
      
      // Actualizar localmente
      this.recomendaciones[index] = recomendacionActualizada;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
