import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {NotificationBellComponent} from '../../../../notifications/presentation/notification-bell/notification-bell.component';
import {AuthStorageService} from '../../../../iam/infrastructure/auth-storage.service';
import {AuthStateService} from '../../../../iam/application/auth-state.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDivider} from '@angular/material/divider';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-layout',

  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbar,
    MatIconButton,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcher,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatIcon,
    NotificationBellComponent,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
  private authStorage = inject(AuthStorageService);
  private authState = inject(AuthStateService);
  private router = inject(Router);

  // Observable para saber si el usuario está autenticado
  isAuthenticated$ = this.authState.isAuthenticated$;
  currentUser$ = this.authState.currentUser$;

  // Observables para detectar el rol del usuario de forma reactiva
  isVeterinarian$ = this.currentUser$.pipe(
    map(user => user?.rol?.toLowerCase() === 'veterinary')
  );

  isPetLover$ = this.currentUser$.pipe(
    map(user => user?.rol?.toLowerCase() !== 'veterinary')
  );

  options = [
    {link: '/home', label: 'option.home'},
    {link: '/about', label: 'option.about'},
    {link: '/learning/categories', label: 'option.categories'},
    {link: '/learning/courses', label: 'option.courses'}
  ]

  /**
   * Check if current route is login or register
   */
  get isAuthPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/register';
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authStorage.clear();
    this.authState.clearUser();
    this.router.navigate(['/login']);
  }
}
