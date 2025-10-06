import {Component, inject, signal} from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
=======
>>>>>>> refs/heads/feature/gestión_de_notificaciones
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './shared/presentation/components/layout/layout.component';

@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet, Layout],
=======
  standalone: true,
  imports: [Layout],
>>>>>>> refs/heads/feature/gestión_de_notificaciones
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('learning-center');
  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }
}
