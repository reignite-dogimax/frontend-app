import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MascotaService } from '../../../../application/services/mascota.service';
import { Mascota } from '../../../../domain/models/mascota.model';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './mascota-list.component.html',
  styleUrl: './mascota-list.component.css'
})
export class MascotaListComponent implements OnInit {
  mascotas: Mascota[] = [];
  loading = false;
  error: string | null = null;

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.loadMascotas();
  }

  loadMascotas(): void {
    this.loading = true;
    this.error = null;
    
    // Por ahora usamos un usuarioId fijo, en una app real vendría del servicio de autenticación
    const usuarioId = 501;
    
    this.mascotaService.getMascotasByUsuario(usuarioId).subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las mascotas';
        this.loading = false;
        console.error('Error loading mascotas:', error);
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
}




