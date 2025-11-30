import { Component, computed, inject, OnInit, ViewChild, signal } from '@angular/core';
import { AppointmentsStore } from '../../../application/appointments.store';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuthStorageService } from '../../../../iam/infrastructure/auth-storage.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChip, MatChipSet } from '@angular/material/chips';

interface PetHistory {
  petId: number;
  petName: string;
  totalAppointments: number;
  firstAppointment: Date;
  lastAppointment: Date;
  completedAppointments: any[];
}

@Component({
  selector: 'app-patient-history',
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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatChip,
    MatChipSet
  ],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent implements OnInit {
  readonly store = inject(AppointmentsStore);
  private authStorage = inject(AuthStorageService);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedPetId = signal<number | null>(null);
  displayedColumns: string[] = ['fechaHora', 'motivo', 'estado', 'veterinaryStatus', 'details'];

  // Get all pets that this veterinarian has treated
  petsHistory = computed(() => {
    const currentUser = this.authStorage.getUser();
    if (!currentUser || currentUser.rol?.toLowerCase() !== 'veterinary') {
      return [];
    }

    // Get all appointments for this veterinarian
    const veterinarianAppointments = this.store.appointments().filter(apt => 
      apt.veterinaryId === currentUser.id
    );

    // Group by pet
    const petMap = new Map<number, PetHistory>();
    
    veterinarianAppointments.forEach(apt => {
      const petId = apt.mascotaId;
      if (!petMap.has(petId)) {
        petMap.set(petId, {
          petId: petId,
          petName: this.getPetName(petId),
          totalAppointments: 0,
          firstAppointment: new Date(apt.fechaHora),
          lastAppointment: new Date(apt.fechaHora),
          completedAppointments: []
        });
      }

      const petHistory = petMap.get(petId)!;
      const appointmentDate = new Date(apt.fechaHora);
      
      // Update first and last appointment dates
      if (appointmentDate < petHistory.firstAppointment) {
        petHistory.firstAppointment = appointmentDate;
      }
      if (appointmentDate > petHistory.lastAppointment) {
        petHistory.lastAppointment = appointmentDate;
      }
      
      petHistory.totalAppointments++;
      petHistory.completedAppointments.push(apt);
    });

    // Convert to array and sort by last appointment date (most recent first)
    return Array.from(petMap.values()).sort((a, b) => 
      b.lastAppointment.getTime() - a.lastAppointment.getTime()
    );
  });

  // Get selected pet's detailed history
  selectedPetHistory = computed(() => {
    const petId = this.selectedPetId();
    if (!petId) return null;
    
    return this.petsHistory().find(pet => pet.petId === petId) || null;
  });

  // Data source for the appointments table
  appointmentsDataSource = computed(() => {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return new MatTableDataSource([]);
    
    // Sort appointments by date (most recent first)
    const sortedAppointments = petHistory.completedAppointments.sort((a, b) => 
      new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    );
    
    const dataSource = new MatTableDataSource(sortedAppointments);
    
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
    if (!this.store.appointments().length) {
      this.store.loadAppointments();
    }
  }

  onPetSelected(): void {
    // Data will be updated automatically via computed signals
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'primary';
      case 'accepted': return 'accent';
      case 'pending': return 'warn';
      case 'rejected': return 'warn';
      default: return 'primary';
    }
  }

  getAppointmentsByMonth() {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return [];

    const monthlyData = new Map<string, number>();
    
    petHistory.completedAppointments.forEach(apt => {
      const date = new Date(apt.fechaHora);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
    });

    return Array.from(monthlyData.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getMostCommonReasons() {
    const petHistory = this.selectedPetHistory();
    if (!petHistory) return [];

    const reasonCount = new Map<string, number>();
    
    petHistory.completedAppointments.forEach(apt => {
      const reason = apt.motivo;
      reasonCount.set(reason, (reasonCount.get(reason) || 0) + 1);
    });

    return Array.from(reasonCount.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 most common reasons
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