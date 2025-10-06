import {Component, inject, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './shared/presentation/components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
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
