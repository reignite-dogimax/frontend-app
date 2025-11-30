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
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-appointment-list',
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
    MatButton,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatTooltip
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements AfterViewChecked {
  readonly store = inject(AppointmentsStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'mascotaId', 'fechaHora', 'motivo', 'estado', 'veterinaryStatus', 'veterinary', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    // Sort appointments by date (most recent first)
    const sortedAppointments = [...this.store.appointments()].sort((a, b) => 
      new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    );
    const source = new MatTableDataSource(sortedAppointments);
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  editAppointment(id: number) {
    this.router.navigate(['appointments/pet-lover', id, 'edit']).then();
  }

  canEdit(appointment: any): boolean {
    // Cannot edit if veterinaryStatus is COMPLETED or REJECTED, or if estado is Cancelada
    return appointment.veterinaryStatus !== 'COMPLETED' && 
           appointment.veterinaryStatus !== 'REJECTED' &&
           appointment.estado !== 'Cancelada';
  }

  deleteAppointment(id: number) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.store.deleteAppointment(id).subscribe();
    }
  }

  navigateToNew() {
    this.router.navigate(['appointments/pet-lover/new']).then();
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
