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
    MatPaginator
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements AfterViewChecked {
  readonly store = inject(AppointmentsStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'mascotaId', 'fechaHora', 'motivo', 'estado', 'veterinary', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.appointments());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  editAppointment(id: number) {
    this.router.navigate(['appointments', id, 'edit']).then();
  }

  deleteAppointment(id: number) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.store.deleteAppointment(id);
    }
  }

  navigateToNew() {
    this.router.navigate(['appointments/new']).then();
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
