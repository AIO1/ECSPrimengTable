import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { ECSPrimengTableI18nService } from '../services/i18n.service';
import { Subscription } from 'rxjs';

/** Supports English defaults and live dictionary updates without mutating the source value. */
@Pipe({ name: 'ecsTranslate', standalone: true, pure: false })
export class ECSTableTranslatePipe implements PipeTransform, OnDestroy {
  private readonly subscription: Subscription;
  constructor(private i18n: ECSPrimengTableI18nService, changeDetector: ChangeDetectorRef) {
    this.subscription = i18n.changes.subscribe(() => changeDetector.markForCheck());
  }
  transform(key: string | null | undefined, params?: Record<string, any>): string {
    return this.i18n.text(key, params);
  }
  ngOnDestroy(): void { this.subscription.unsubscribe(); }
}
