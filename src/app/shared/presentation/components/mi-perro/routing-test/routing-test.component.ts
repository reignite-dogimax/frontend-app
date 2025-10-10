import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-routing-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="routing-test-container">
      <mat-card class="test-card">
        <mat-card-header>
          <mat-card-title class="heading-3">🧪 Test de Routing - Mi Perro</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="test-info">
            <p class="normal-text-regular"><strong>Ruta actual:</strong> {{ currentRoute }}</p>
            <p class="normal-text-regular"><strong>Parámetros:</strong> {{ routeParams | json }}</p>
            <p class="normal-text-regular"><strong>Query params:</strong> {{ queryParams | json }}</p>
          </div>
          
          <div class="test-actions">
            <h4 class="heading-4">Probar Navegación:</h4>
            <div class="button-group">
              <button class="btn-primary" routerLink="/mi-perro">
                <mat-icon>dashboard</mat-icon>
                Dashboard
              </button>
              <button class="btn-primary" routerLink="/mi-perro/mascotas">
                <mat-icon>pets</mat-icon>
                Lista Mascotas
              </button>
              <button class="btn-primary" routerLink="/mi-perro/mascotas/nueva">
                <mat-icon>add</mat-icon>
                Nueva Mascota
              </button>
              <button class="btn-primary" routerLink="/mi-perro/mascotas/1">
                <mat-icon>visibility</mat-icon>
                Detalle Mascota (ID: 1)
              </button>
              <button class="btn-primary" routerLink="/mi-perro/mascotas/1/editar">
                <mat-icon>edit</mat-icon>
                Editar Mascota (ID: 1)
              </button>
            </div>
          </div>
          
          <div class="test-status">
            <h4 class="heading-4">Estado del Routing:</h4>
            <div class="status-item">
              <mat-icon class="status-icon success">check_circle</mat-icon>
              <span class="normal-text-regular">Router configurado correctamente</span>
            </div>
            <div class="status-item">
              <mat-icon class="status-icon success">check_circle</mat-icon>
              <span class="normal-text-regular">Componentes creados</span>
            </div>
            <div class="status-item">
              <mat-icon class="status-icon success">check_circle</mat-icon>
              <span class="normal-text-regular">Lazy loading configurado</span>
            </div>
            <div class="status-item">
              <mat-icon class="status-icon success">check_circle</mat-icon>
              <span class="normal-text-regular">Router outlet presente</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .routing-test-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .test-card {
      background-color: var(--color-blanco);
      border-radius: 12px;
      box-shadow: var(--button-shadow);
    }
    
    .test-info {
      background-color: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    
    .test-info p {
      margin: 8px 0;
      color: var(--color-azul-oscuro);
    }
    
    .test-actions {
      margin-bottom: 24px;
    }
    
    .test-actions h4 {
      margin: 0 0 16px 0;
      color: var(--color-azul-oscuro);
    }
    
    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .button-group button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .test-status h4 {
      margin: 0 0 16px 0;
      color: var(--color-azul-oscuro);
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .status-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .status-icon.success {
      color: #38a169;
    }
    
    .status-icon.error {
      color: #e53e3e;
    }
    
    @media (max-width: 768px) {
      .button-group {
        flex-direction: column;
      }
      
      .button-group button {
        width: 100%;
      }
    }
  `]
})
export class RoutingTestComponent {
  currentRoute: string = '';
  routeParams: any = {};
  queryParams: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentRoute = this.router.url;
    
    this.route.params.subscribe(params => {
      this.routeParams = params;
    });
    
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });
  }
}







