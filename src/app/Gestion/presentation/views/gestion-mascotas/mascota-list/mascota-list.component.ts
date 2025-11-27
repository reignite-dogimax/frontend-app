import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestionStore } from '../../../../application/gestion.store';
import { TranslatePipe } from '@ngx-translate/core';
import { Pet } from '../../../../domain/model/pet.entity';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './mascota-list.component.html',
  styleUrl: './mascota-list.component.css'
})
export class MascotaListComponent implements OnInit {
  mascotas: any;
  loading: any;
  error: any;

  constructor(
    private gestionStore: GestionStore,
    private router: Router
  ) {
    // Inicializar las propiedades después de que el constructor haya inyectado gestionStore
    this.mascotas = this.gestionStore.mascotas;
    this.loading = this.gestionStore.loading;
    this.error = this.gestionStore.error;
  }

  ngOnInit(): void {
    // Los datos se cargan automáticamente en el constructor del store
    console.log('MascotaListComponent initialized with:', {
      mascotas: this.mascotas(),
      loading: this.loading(),
      error: this.error()
    });
  }

  getEdadMascota(fechaNacimiento?: string): string {
    if (!fechaNacimiento) return 'Edad no especificada';
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edadEnMeses = Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    
    if (edadEnMeses < 12) {
      return `${edadEnMeses} ${edadEnMeses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(edadEnMeses / 12);
      const mesesRestantes = edadEnMeses % 12;
      return mesesRestantes > 0 ? `${años} ${años === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : `${años} ${años === 1 ? 'año' : 'años'}`;
    }
  }

  getEspecieIcon(especie: string): string {
    const especieLower = especie?.toLowerCase() || '';
    if (especieLower.includes('dog') || especieLower.includes('perro')) return 'pets';
    if (especieLower.includes('cat') || especieLower.includes('gato')) return 'pets';
    return 'pets';
  }

  onEditClick(event: Event, mascotaId: number): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Edit button clicked for pet:', mascotaId);
    console.log('Navigating to:', `/gestion-mascotas/mascotas/${mascotaId}/editar`);
    this.router.navigate(['/gestion-mascotas/mascotas', mascotaId, 'editar']);
  }

  onDetailClick(event: Event, mascotaId: number): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Detail button clicked for pet:', mascotaId);
    console.log('Navigating to:', `/gestion-mascotas/mascotas/${mascotaId}`);
    this.router.navigate(['/gestion-mascotas/mascotas', mascotaId]);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallbackIcon = img.nextElementSibling as HTMLElement;
    if (fallbackIcon) {
      fallbackIcon.style.display = 'flex';
    }
  }
}
