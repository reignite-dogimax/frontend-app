import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../../domain/model/appointment.entity';

@Component({
  selector: 'app-accept-reject-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslateModule,
    DatePipe
  ],
  template: `
    <h2 mat-dialog-title>{{ 'appointments.acceptReject.title' | translate }}</h2>
    
    <mat-dialog-content>
      <mat-card class="appointment-details">
        <mat-card-content>
          <div class="detail-row">
            <mat-icon>pets</mat-icon>
            <span class="label">{{ 'appointments.table.petId' | translate }}:</span>
            <span class="value">{{ data.mascotaId }}</span>
          </div>
          
          <div class="detail-row">
            <mat-icon>calendar_today</mat-icon>
            <span class="label">{{ 'appointments.table.datetime' | translate }}:</span>
            <span class="value">{{ data.fechaHora | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          
          <div class="detail-row">
            <mat-icon>description</mat-icon>
            <span class="label">{{ 'appointments.table.reason' | translate }}:</span>
            <span class="value">{{ data.motivo }}</span>
          </div>
          
          @if (data.notas) {
            <div class="detail-row">
              <mat-icon>note</mat-icon>
              <span class="label">{{ 'appointments.form.notes' | translate }}:</span>
              <span class="value">{{ data.notas }}</span>
            </div>
          }
        </mat-card-content>
      </mat-card>

      @if (processing()) {
        <div class="processing-message">
          <mat-icon>hourglass_empty</mat-icon>
          {{ 'appointments.acceptReject.processing' | translate }}
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="processing()">
        {{ 'appointments.form.actions.cancel' | translate }}
      </button>
      <button 
        mat-raised-button 
        color="warn" 
        (click)="onReject()"
        [disabled]="processing()">
        <mat-icon>close</mat-icon>
        {{ 'appointments.acceptReject.reject' | translate }}
      </button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onAccept()"
        [disabled]="processing()">
        <mat-icon>check</mat-icon>
        {{ 'appointments.acceptReject.accept' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }

    .appointment-details {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }

      mat-icon {
        color: #666;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .label {
        font-weight: 600;
        min-width: 120px;
        color: #555;
      }

      .value {
        flex: 1;
        color: #333;
      }
    }

    .processing-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      margin-top: 16px;
      color: #666;

      mat-icon {
        animation: spin 1s linear infinite;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    mat-dialog-actions {
      padding: 16px 20px;
      gap: 8px;

      button {
        mat-icon {
          margin-right: 4px;
        }
      }
    }
  `]
})
export class AcceptRejectModalComponent {
  readonly dialogRef = inject(MatDialogRef<AcceptRejectModalComponent>);
  readonly data: Appointment = inject(MAT_DIALOG_DATA);
  
  processing = signal(false);

  onCancel(): void {
    this.dialogRef.close();
  }

  onAccept(): void {
    this.processing.set(true);
    this.dialogRef.close({ action: 'ACCEPTED' });
  }

  onReject(): void {
    this.processing.set(true);
    this.dialogRef.close({ action: 'REJECTED' });
  }
}
