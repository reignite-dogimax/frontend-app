import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { GestionStore } from '../../../../application/gestion.store';
import { Mascota } from '../../../../domain/model/mascota.entity';
import { HistorialMedico } from '../../../../domain/model/historial-medico.entity';
import { Recomendacion } from '../../../../domain/model/recomendacion.entity';

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
  historial: any[] = [];
  vacunas: any[] = [];
  recomendaciones: any[] = [];
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
    // Los datos relacionados se cargan automáticamente desde el store
    // Los signals ya están configurados para filtrar por mascotaId
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
    this.router.navigate(['/gestion-mascotas/mascotas']);
  }

  generarRecomendaciones(): void {
    if (!this.mascota) return;
    
    // Simular generación de recomendaciones
    console.log('Generando recomendaciones para:', this.mascota.nombre);
    // En una implementación real, aquí se llamaría al servicio de IA
  }

  marcarCompletada(recomendacionId: number): void {
    // Simular marcado como completada
    const index = this.recomendaciones.findIndex((r: any) => r.id === recomendacionId);
    if (index !== -1) {
      this.recomendaciones[index] = {
        ...this.recomendaciones[index],
        completada: true,
        fechaCompletada: new Date()
      };
    }
  }
}
