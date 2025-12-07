import { Injectable } from '@angular/core';
import { ECSPrimengTableNotificationService } from 'ecs-primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ECSPrimengTableNotificationService {
  constructor(private readonly sharedService: SharedService) {
    super();
  }
  showToast(
    severity: string,
    title: string,
    message: string
  ): void {
    this.sharedService.showToast(severity, title, message, 5000, false, true, false);
  }
  clearToasts(): void {
    this.sharedService.clearToasts();
  }
}