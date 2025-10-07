import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MascotaService } from '../../../../application/services/mascota.service';
import { TranslatePipe } from '@ngx-translate/core';
import { HistorialMedicoService } from '../../../../application/services/historial-medico.service';
import { RecomendacionesService } from '../../../../application/services/recomendaciones.service';
import { Mascota } from '../../../../domain/models/mascota.model';

@Component({
  selector: 'app-gestion-mascotas-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    TranslatePipe
  ],
  templateUrl: './gestion-mascotas-dashboard.component.html',
  styleUrl: './gestion-mascotas-dashboard.component.css'
})
export class GestionMascotasDashboardComponent implements OnInit {
  mascotas: Mascota[] = [];
  totalMascotas = 0;
  totalHistorial = 0;
  totalRecomendaciones = 0;
  loading = false;

  constructor(
    private mascotaService: MascotaService,
    private historialService: HistorialMedicoService,
    private recomendacionesService: RecomendacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    const usuarioId = 501; // En una app real vendría del servicio de autenticación

    // Cargar mascotas
    this.mascotaService.getMascotasByUsuario(usuarioId).subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.totalMascotas = mascotas.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  navigateToMascotas(): void {
    this.router.navigate(['/gestion-mascotas/mascotas']);
  }

  navigateToNuevaMascota(): void {
    this.router.navigate(['/gestion-mascotas/mascotas/nueva']);
  }
}
