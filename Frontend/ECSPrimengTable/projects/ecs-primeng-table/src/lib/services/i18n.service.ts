import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateDefaultParser, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { EMPTY, merge } from 'rxjs';

/** Translates UI text only; never changes column keys, data or persisted view names. */
@Injectable({ providedIn: 'root' })
export class ECSPrimengTableI18nService {
  private readonly translate = inject(TranslateService, { optional: true });
  private readonly prime = inject(PrimeNG, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly parser = new TranslateDefaultParser();
  private connected = false;
  private primeDefaults: Record<string, any> | undefined;
  private appliedPrimeTranslations = false;
  readonly changes = this.translate
    ? merge(this.translate.onLangChange, this.translate.onTranslationChange, this.translate.onFallbackLangChange)
    : EMPTY;

  text(key: string | null | undefined, params?: Record<string, any>): string {
    if (!key) return '';
    const value = this.translate?.instant(key, params);
    // Literal English keys also serve as defaults, including interpolated counters.
    if (typeof value === 'string' && value !== key) return value;
    return this.parser.interpolate(key, params) ?? key;
  }

  /** Optional dictionary section "primeng" configures the application's shared PrimeNG locale. */
  connectPrimeNG(): void {
    if (this.connected || !this.prime || !this.translate) return;
    this.connected = true;
    this.primeDefaults = structuredClone(this.prime.translation);
    this.syncPrimeNG();
    this.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.syncPrimeNG());
  }

  private syncPrimeNG(): void {
    const value = this.translate!.instant('primeng');
    const defined = value && typeof value === 'object' && !Array.isArray(value);
    if (!defined && !this.appliedPrimeTranslations) return;
    const defaults = this.primeDefaults!;
    const overrides = defined ? value : {};
    this.prime!.setTranslation({
      ...defaults, ...overrides,
      aria: { ...defaults['aria'], ...overrides['aria'] }
    });
    this.appliedPrimeTranslations = !!defined;
  }
}
