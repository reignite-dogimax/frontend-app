import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MascotaService } from '../../../../application/services/mascota.service';
import { HistorialMedicoService } from '../../../../application/services/historial-medico.service';
import { RecomendacionesService } from '../../../../application/services/recomendaciones.service';
import { Mascota } from '../../../../domain/models/mascota.model';
import { HistorialMedico } from '../../../../domain/models/historial-medico.model';
import { Vacuna } from '../../../../domain/models/historial-medico.model';
import { Recomendacion } from '../../../../domain/models/recomendacion.model';

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
    MatTabsModule
  ],
  templateUrl: './mascota-detail.component.html',
  styleUrl: './mascota-detail.component.css'
})
export class MascotaDetailComponent implements OnInit {
  mascota: Mascota | null = null;
  historial: HistorialMedico[] = [];
  vacunas: Vacuna[] = [];
  recomendaciones: Recomendacion[] = [];
  loading = false;
  error: string | null = null;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private historialService: HistorialMedicoService,
    private recomendacionesService: RecomendacionesService
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

    this.mascotaService.getMascotaById(id).subscribe({
      next: (mascota) => {
        this.mascota = mascota;
        this.loadRelatedData(id);
      },
      error: (error) => {
        this.error = 'Error al cargar la mascota';
        this.loading = false;
        console.error('Error loading mascota:', error);
      }
    });
  }

  loadRelatedData(mascotaId: number): void {
    // Cargar historial médico
    this.historialService.getHistorialByMascota(mascotaId).subscribe({
      next: (historial) => {
        this.historial = historial;
      },
      error: (error) => {
        console.error('Error loading historial:', error);
      }
    });

    // Cargar vacunas
    this.historialService.getVacunasByMascota(mascotaId).subscribe({
      next: (vacunas) => {
        this.vacunas = vacunas;
      },
      error: (error) => {
        console.error('Error loading vacunas:', error);
      }
    });

    // Cargar recomendaciones
    this.recomendacionesService.getRecomendacionesByMascota(mascotaId).subscribe({
      next: (recomendaciones) => {
        this.recomendaciones = recomendaciones;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recomendaciones:', error);
        this.loading = false;
      }
    });
  }

  getEdadMascota(fechaNacimiento?: Date): string {
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
    switch (prioridad) {
      case 'Critica': return 'chip-critical';
      case 'Alta': return 'chip-high';
      case 'Media': return 'chip-medium';
      case 'Baja': return 'chip-low';
      default: return 'chip-medium';
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'Vacuna': return 'vaccines';
      case 'Consulta': return 'medical_services';
      case 'Cirugia': return 'healing';
      case 'Examen': return 'science';
      case 'Tratamiento': return 'medication';
      default: return 'medical_services';
    }
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  goBack(): void {
    this.router.navigate(['/mi-perro/mascotas']);
  }

  generarRecomendaciones(): void {
    if (!this.mascota) return;
    
    // Simular generación de recomendaciones
    console.log('Generando recomendaciones para:', this.mascota.nombre);
    // En una implementación real, aquí se llamaría al servicio de IA
  }

  marcarCompletada(recomendacionId: number): void {
    this.recomendacionesService.marcarCompletada(recomendacionId).subscribe({
      next: (recomendacion) => {
        // Actualizar la recomendación en la lista local
        const index = this.recomendaciones.findIndex(r => r.id === recomendacionId);
        if (index !== -1) {
          this.recomendaciones[index] = recomendacion;
        }
      },
      error: (error) => {
        console.error('Error marcando recomendación como completada:', error);
      }
    });
  }
}
