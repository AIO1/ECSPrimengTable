import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.html'
})
export class App {
  protected readonly spinnerService = inject(SpinnerService);
  isUserAdmin = false;
}