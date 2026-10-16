import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    FormsModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.html'
})
export class App {
  readonly translate = inject(TranslateService);
  isSpinnerVisible: boolean = false;
  isUserAdmin = false;
  constructor(private readonly spinnerService: SpinnerService) {
    this.spinnerService.spinner$.subscribe(visible => {
      setTimeout(() => {
        this.isSpinnerVisible = visible;
      }, 1);
    });
  }
}
