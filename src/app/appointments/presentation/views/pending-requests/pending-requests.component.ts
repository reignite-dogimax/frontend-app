import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';
import { AcceptRejectModalComponent } from '../accept-reject-modal/accept-reject-modal.component';
import { AppointmentsApi } from '../../../infrastructure/appointments-api';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    TranslateModule
  ],
  template: `
    @if (pendingCount() > 0) {
      <mat-card class="pending-banner">
        <mat-card-content>
          <div class="banner-header">
            <mat-icon [matBadge]="pendingCount()" matBadgeColor="warn" class="notification-icon">
              notifications_active
            </mat-icon>
            <div class="banner-text">
              <h3>{{ 'appointments.pendingRequests.title' | translate }}</h3>
              <p>{{ 'appointments.pendingRequests.subtitle' | translate: { count: pendingCount() } }}</p>
            </div>
          </div>

          <div class="requests-container">
            @for (appointment of pendingAppointments(); track appointment.id) {
              <mat-card class="request-card">
                <mat-card-content class="request-content">
                  <div class="request-info">
                    <div class="info-row">
                      <mat-icon>pets</mat-icon>
                      <span><strong>{{ 'appointments.table.petId' | translate }}:</strong> {{ appointment.mascotaId }}</span>
                    </div>
                    <div class="info-row">
                      <mat-icon>calendar_today</mat-icon>
                      <span><strong>{{ 'appointments.table.datetime' | translate }}:</strong> {{ appointment.fechaHora | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                    <div class="info-row">
                      <mat-icon>description</mat-icon>
                      <span><strong>{{ 'appointments.table.reason' | translate }}:</strong> {{ appointment.motivo }}</span>
                    </div>
                  </div>

                  <button 
                    mat-raised-button 
                    color="primary" 
                    (click)="openReviewModal(appointment)">
                    <mat-icon>visibility</mat-icon>
                    {{ 'appointments.pendingRequests.review' | translate }}
                  </button>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .pending-banner {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border-left: 4px solid #ff9800;
      margin-bottom: 24px;
    }

    .banner-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;

      .notification-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: #ff9800;
        animation: pulse 2s infinite;
      }

      .banner-text {
        flex: 1;

        h3 {
          margin: 0;
          color: #e65100;
          font-size: 20px;
          font-weight: 600;
        }

        p {
          margin: 4px 0 0 0;
          color: #f57c00;
          font-size: 14px;
        }
      }
    }

    .requests-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .request-card {
      background: white;
      border: 1px solid #ffb74d;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
      }
    }

    .request-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .request-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

        mat-icon {
          color: #ff9800;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        strong {
          color: #555;
        }

        span {
          color: #333;
        }
      }
    }

    button {
      mat-icon {
        margin-right: 4px;
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `]
})
export class PendingRequestsComponent {
  private readonly store = inject(AppointmentsStore);
  private readonly authStorage = inject(AuthStorageService);
  private readonly dialog = inject(MatDialog);
  private readonly appointmentsApi = inject(AppointmentsApi);

  // Filtrar citas pendientes para el veterinario actual
  pendingAppointments = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser) return [];

    return this.store.appointments().filter(apt => 
      apt.veterinaryStatus === 'PENDING' && 
      apt.veterinaryId === currentUser.id
    );
  });

  pendingCount = computed(() => this.pendingAppointments().length);

  openReviewModal(appointment: any) {
    const dialogRef = this.dialog.open(AcceptRejectModalComponent, {
      width: '500px',
      data: appointment,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.updateVeterinaryStatus(appointment.id, result.action);
      }
    });
  }

  private updateVeterinaryStatus(appointmentId: number, status: string) {
    this.appointmentsApi.updateVeterinaryStatus(appointmentId, status).subscribe({
      next: () => {
        // Refresh appointments list
        this.store.loadAppointments();
      },
      error: (error) => {
        console.error('Error updating veterinary status:', error);
        alert('Error al actualizar el estado de la cita');
      }
    });
  }
}
