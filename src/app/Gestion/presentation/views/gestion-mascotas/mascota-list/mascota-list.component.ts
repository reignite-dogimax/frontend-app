import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestionStore } from '../../../../application/gestion.store';
import { TranslatePipe } from '@ngx-translate/core';
import { Mascota } from '../../../../domain/model/mascota.entity';

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

  constructor(private gestionStore: GestionStore) {
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
}
