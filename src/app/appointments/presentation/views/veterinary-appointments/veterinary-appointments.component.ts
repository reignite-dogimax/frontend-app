import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { Router } from '@angular/router';
import { MatError } from '@angular/material/form-field';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCard, MatCardAvatar, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';
import { FollowupAppointmentsComponent } from '../followup-appointments/followup-appointments.component';

@Component({
  selector: 'app-veterinary-appointments',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatError,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatTooltip,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardAvatar,
    FollowupAppointmentsComponent
  ],
  templateUrl: './veterinary-appointments.component.html',
  styleUrl: './veterinary-appointments.component.css'
})
export class VeterinaryAppointmentsComponent implements AfterViewChecked {
  readonly store = inject(AppointmentsStore);
  protected router = inject(Router);
  private authStorage = inject(AuthStorageService);

  displayedColumns: string[] = ['id', 'mascotaId', 'fechaHora', 'motivo', 'estado', 'veterinaryStatus', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtrar solo citas aceptadas del veterinario actual
  dataSource = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser) {
      return new MatTableDataSource([]);
    }

    // Filtrar citas: veterinaryStatus = 'ACCEPTED' y asignadas a este veterinario
    const filteredAppointments = this.store.appointments().filter(apt => 
      apt.veterinaryStatus === 'ACCEPTED' && 
      apt.veterinaryId === currentUser.id
    );

    // Sort appointments by date (most recent first)
    const sortedAppointments = filteredAppointments.sort((a, b) => 
      new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    );

    const source = new MatTableDataSource(sortedAppointments);
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  /**
   * Navigate to complete/register appointment form
   */
  completeAppointment(id: number) {
    this.router.navigate(['appointments/veterinary', id, 'complete']).then();
  }

  /**
   * Navigate to create follow-up appointment
   */
  createFollowUp(appointmentId: number) {
    this.router.navigate(['appointments/veterinary/followup'], { 
      queryParams: { fromAppointment: appointmentId } 
    }).then();
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

  ngAfterViewChecked() {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}
