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
  imports: [RouterOutlet, RouterLink, FormsModule],
  providers: [ECSPrimengTableStateService, NavigationDemoSettings],
  template: `
    <section style="padding: 12px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
      <strong>Prueba de estado · Personas</strong>
      <label><input type="checkbox" [(ngModel)]="settings.persistence.enabled" /> Conservar filtros al volver del detalle</label>
      <a routerLink="/other">Ir a otra sección (salir del ámbito)</a>
    </section>
    <router-outlet />
  `
})
export class NavigationDemoScope {
  readonly settings = inject(NavigationDemoSettings);
}

@Component({
  selector: 'ecs-navigation-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section style="padding: 24px;">
      <h2>Detalle de persona</h2>
      <p>Identificador: {{ id }}</p>
      <p>Esta pantalla permite probar la navegación; no modifica el registro.</p>
      <p><a routerLink="/home">Volver al listado de personas</a></p>
      <p>Con la casilla activada, al volver se recuperan los filtros, la ordenación y la página.</p>
    </section>
  `
})
export class NavigationDemoDetail {
  readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}

@Component({
  selector: 'ecs-navigation-other',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section style="padding: 24px;">
      <h2>Otra sección</h2>
      <p>Has salido del ámbito de personas. Su estado temporal se ha eliminado.</p>
      <a routerLink="/home">Abrir de nuevo el listado de personas</a>
    </section>
  `
})
export class NavigationDemoOther {}
