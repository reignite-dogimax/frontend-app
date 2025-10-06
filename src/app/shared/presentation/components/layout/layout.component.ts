import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
<<<<<<< HEAD
=======
import { NotificationBellComponent } from '../../../../notifications/presentation/notification-bell/notification-bell.component';
>>>>>>> refs/heads/feature/gestión_de_notificaciones


@Component({
  selector: 'app-layout',
<<<<<<< HEAD
=======
  standalone: true,
>>>>>>> refs/heads/feature/gestión_de_notificaciones
  imports: [
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
<<<<<<< HEAD
=======
    NotificationBellComponent,
>>>>>>> refs/heads/feature/gestión_de_notificaciones
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
  options = [
    {link: '/home', label: 'option.home'},
    {link: '/about', label: 'option.about'},
    {link: '/learning/categories', label: 'option.categories'},
    {link: '/learning/courses', label: 'option.courses'}
  ]
}
