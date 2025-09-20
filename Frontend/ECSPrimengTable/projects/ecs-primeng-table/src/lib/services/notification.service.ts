import { Injectable } from '@angular/core';

/**
 * Abstract service for handling notifications in **ECS Primeng table**.
 * 
 * Provides a consistent interface for displaying and clearing toast notifications.
 * Implementations must define how the notifications are managed.
 */
@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableNotificationService {

  /**
   * Displays a toast notification.
   * 
   * @param severity The severity level of the notification (e.g., 'success', 'info', 'warn', 'error').
   * @param title The title of the toast message.
   * @param message The detailed message of the toast.
   */
  abstract showToast(
    severity: string,
    title: string,
    message: string
  ): void;
  
  /**
   * Clears all currently displayed toast notifications.
   */
  abstract clearToasts(): void;
}