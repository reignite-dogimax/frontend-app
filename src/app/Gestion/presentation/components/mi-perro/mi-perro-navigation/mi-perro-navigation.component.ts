import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mi-perro-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './mi-perro-navigation.component.html',
  styleUrl: './mi-perro-navigation.component.css'
})
export class MiPerroNavigationComponent {
  constructor(private router: Router) {}

  get currentRoute(): string {
    return this.router.url;
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  getSelectedTabIndex(): number {
    if (this.currentRoute.includes('/mi-perro/mascotas')) {
      return 0;
    }
    return 0;
  }
}
