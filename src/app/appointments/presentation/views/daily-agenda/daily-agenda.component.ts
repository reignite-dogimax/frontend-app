import { Component, computed, inject, ViewChild, OnInit, effect } from '@angular/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatProgressSpinner,
    MatError,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './daily-agenda.component.html',
  styleUrl: './daily-agenda.component.css'
})
export class DailyAgendaComponent implements OnInit {
  readonly store = inject(AppointmentsStore);
  private authStorage = inject(AuthStorageService);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'mascotaId', 'fechaHora', 'motivo', 'estado', 'veterinaryStatus', 'timeRemaining'];

  // Get today's appointments for the current veterinarian
  todayAppointments = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser || currentUser.rol?.toLowerCase() !== 'veterinary') {
      return { data: [] };
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Filter appointments for today and this veterinarian (accepted appointments)
    const filtered = this.store.appointments().filter(apt => {
      const appointmentDate = new Date(apt.fechaHora);
      return appointmentDate >= todayStart && 
             appointmentDate <= todayEnd && 
             apt.veterinaryId === currentUser.id &&
             apt.veterinaryStatus === 'ACCEPTED';
    });

    // Sort by time (earliest first)
    const sorted = filtered.sort((a, b) => 
      new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );

    return { data: sorted };
  });

  dataSource = computed(() => {
    const dataSource = new MatTableDataSource(this.todayAppointments().data);
    
    // Apply sort and paginator after data is set
    setTimeout(() => {
      if (this.sort) {
        dataSource.sort = this.sort;
      }
      if (this.paginator) {
        dataSource.paginator = this.paginator;
      }
    });

    return dataSource;
  });

  ngOnInit(): void {
    // Load appointments if not already loaded
    if (!this.store.appointments().length) {
      this.store.loadAppointments();
    }
  }

  /**
   * Calculate time remaining until appointment
   */
  getTimeRemaining(appointmentDateTime: string): string {
    const now = new Date();
    const appointmentTime = new Date(appointmentDateTime);
    const diffMs = appointmentTime.getTime() - now.getTime();
    
    if (diffMs < 0) {
      return 'Pasada';
    }
    
    if (diffMs < 60000) { // Less than 1 minute
      return 'Ahora';
    }
    
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffHours > 0) {
      const remainingMinutes = diffMinutes % 60;
      return remainingMinutes > 0 ? `${diffHours}h ${remainingMinutes}m` : `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  }

  /**
   * Get status indicator for time remaining
   */
  getTimeStatus(appointmentDateTime: string): 'past' | 'now' | 'soon' | 'later' {
    const now = new Date();
    const appointmentTime = new Date(appointmentDateTime);
    const diffMs = appointmentTime.getTime() - now.getTime();
    
    if (diffMs < 0) return 'past';
    if (diffMs < 60000) return 'now'; // Less than 1 minute
    if (diffMs < 900000) return 'soon'; // Less than 15 minutes
    return 'later';
  }

  /**
   * Get next appointment
   */
  getNextAppointment() {
    const now = new Date();
    return this.todayAppointments().data.find(apt => 
      new Date(apt.fechaHora).getTime() > now.getTime()
    );
  }

  // Helper method to get pet name from ID
  getPetName(petId: number): string {
    const petNames: { [key: number]: string } = {
      1: 'Max',
      2: 'Luna', 
      3: 'Charlie',
      4: 'Bella',
      5: 'Rocky',
      6: 'Mia'
    };
    return petNames[petId] || `Mascota ${petId}`;
  }
}