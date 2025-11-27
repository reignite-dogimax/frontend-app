import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { GestionStore } from '../../../../application/gestion.store';
import { TranslatePipe } from '@ngx-translate/core';
import { Pet } from '../../../../domain/model/pet.entity';

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
  mascotas: any;
  totalMascotas: any;
  totalHistorial: any;
  totalRecomendaciones: any;
  loading: any;
  error: any;

  constructor(
    private gestionStore: GestionStore,
    private router: Router
  ) {
    // Inicializar las propiedades después de que el constructor haya inyectado gestionStore
    this.mascotas = this.gestionStore.mascotas;
    this.totalMascotas = this.gestionStore.mascotaCount;
    this.totalHistorial = this.gestionStore.historialCount;
    this.totalRecomendaciones = this.gestionStore.recomendacionCount;
    this.loading = this.gestionStore.loading;
    this.error = this.gestionStore.error;
  }

  ngOnInit(): void {
    // Los datos se cargan automáticamente en el constructor del store
    console.log('GestionStore initialized with:', {
      mascotas: this.mascotas(),
      totalMascotas: this.totalMascotas(),
      totalHistorial: this.totalHistorial(),
      totalRecomendaciones: this.totalRecomendaciones(),
      loading: this.loading(),
      error: this.error()
    });
  }

  navigateToMascotas(): void {
    this.router.navigate(['/gestion-mascotas/mascotas']);
  }

  navigateToNuevaMascota(): void {
    this.router.navigate(['/gestion-mascotas/mascotas/nueva']);
  }
}
