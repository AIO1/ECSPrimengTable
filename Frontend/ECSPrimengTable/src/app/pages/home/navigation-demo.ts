import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, Injectable, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ECSPrimengTableStateService } from 'ecs-primeng-table';

@Injectable()
export class NavigationDemoSettings {
  readonly persistence = { enabled: true, key: 'demo-people' };
}

@Component({
  selector: 'ecs-navigation-scope',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, TranslatePipe],
  providers: [ECSPrimengTableStateService, NavigationDemoSettings],
  template: `
    <section style="padding: 12px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
      <label>{{ 'Language' | translate }}
        <select [attr.aria-label]="'Language' | translate" [ngModel]="translate.getCurrentLang()" (ngModelChange)="translate.use($event)">
          <option value="es">Español</option><option value="en">English</option>
          <option value="fr">Français</option><option value="it">Italiano</option>
        </select>
      </label>
      <strong>{{ 'Prueba de estado · Personas' | translate }}</strong>
      <label><input type="checkbox" [(ngModel)]="settings.persistence.enabled" /> {{ 'Conservar filtros al volver del detalle' | translate }}</label>
      <a routerLink="/other">{{ 'Ir a otra sección (salir del ámbito)' | translate }}</a>
    </section>
    <router-outlet />
  `
})
export class NavigationDemoScope {
  readonly translate = inject(TranslateService);
  readonly settings = inject(NavigationDemoSettings);
}

@Component({
  selector: 'ecs-navigation-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section style="padding: 24px;">
      <h2>{{ 'Detalle de persona' | translate }}</h2>
      <p>{{ 'Identificador' | translate }}: {{ id }}</p>
      <p>{{ 'Esta pantalla permite probar la navegación; no modifica el registro.' | translate }}</p>
      <p><a routerLink="/home">{{ 'Volver al listado de personas' | translate }}</a></p>
      <p>{{ 'Con la casilla activada, al volver se recuperan los filtros, la ordenación y la página.' | translate }}</p>
    </section>
  `
})
export class NavigationDemoDetail {
  readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}

@Component({
  selector: 'ecs-navigation-other',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section style="padding: 24px;">
      <h2>{{ 'Otra sección' | translate }}</h2>
      <p>{{ 'Has salido del ámbito de personas. Su estado temporal se ha eliminado.' | translate }}</p>
      <a routerLink="/home">{{ 'Abrir de nuevo el listado de personas' | translate }}</a>
    </section>
  `
})
export class NavigationDemoOther {}
