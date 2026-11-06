import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { ECSPrimengTable, ECSPrimengTableStateService, ITableOptions, TreeLoadMode, TableViewSaveMode, createTableOptions } from 'ecs-primeng-table';

@Injectable()
export class TreeDemoSettings {
  mode: TreeLoadMode = 'onDemand';
  storage: 'database' | 'local' = 'database';
  readonly modes = [
    { value: 'all', label: 'Tree mode all' },
    { value: 'onDemand', label: 'Tree mode on demand' },
    { value: 'pagedChildren', label: 'Tree mode paged children' }
  ];
  readonly stores = [
    { value: 'database', label: 'Tree database views' },
    { value: 'local', label: 'Tree local views' }
  ];
  get key(): string { return `tree-demo-${this.mode}-${this.storage}`; }
}

@Component({
  selector: 'ecs-tree-scope',
  standalone: true,
  imports: [RouterOutlet],
  providers: [ECSPrimengTableStateService, TreeDemoSettings],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet />'
})
export class TreeDemoScope {}

@Component({
  selector: 'ecs-tree-demo',
  standalone: true,
  imports: [ECSPrimengTable, FormsModule, SelectModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section style="padding: 12px;">
      <h2>{{ 'Tree demo' | translate }}</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-bottom: 12px;">
        <label for="tree-mode">{{ 'Tree load mode' | translate }}</label>
        <p-select inputId="tree-mode" [options]="settings.modes" optionLabel="label" optionValue="value"
          [(ngModel)]="settings.mode" [ariaLabel]="'Tree load mode' | translate">
          <ng-template #selectedItem let-item>{{ item.label | translate }}</ng-template>
          <ng-template #item let-item>{{ item.label | translate }}</ng-template>
        </p-select>
        <label for="tree-storage">{{ 'Tree view storage' | translate }}</label>
        <p-select inputId="tree-storage" [options]="settings.stores" optionLabel="label" optionValue="value"
          [(ngModel)]="settings.storage" [ariaLabel]="'Tree view storage' | translate">
          <ng-template #selectedItem let-item>{{ item.label | translate }}</ng-template>
          <ng-template #item let-item>{{ item.label | translate }}</ng-template>
        </p-select>
      </div>
      @for (key of [settings.key]; track key) {
        <ecs-primeng-table [tableOptions]="options[key]" />
      }
    </section>
  `
})
export class TreeDemo {
  readonly settings = inject(TreeDemoSettings);
  private readonly router = inject(Router);
  readonly options: Record<string, ITableOptions> = {};

  constructor() {
    for (const mode of ['all', 'onDemand', 'pagedChildren'] as const) {
      for (const storage of ['database', 'local'] as const) {
        const key = `tree-demo-${mode}-${storage}`;
        this.options[key] = createTableOptions({
          tree: { keyExpr: 'id', parentIdExpr: 'parentId', rootValue: 0, hasItemsExpr: 'hasChildren', column: 'text', loadMode: mode },
          statePersistence: { enabled: true, key },
          responsive: { headerMenu: true, rowMenu: true },
          urlTableConfiguration: 'TreeDemo/GetTableConfiguration',
          urlTableData: 'TreeDemo/GetTableData',
          globalFilter: { minLength: 3, debounceTime: 400 },
          excelReport: { url: 'TreeDemo/GenerateExcel' },
          rows: {
            action: { width: 60, buttons: [{
              icon: 'pi pi-file-edit', tooltip: 'Edit record',
              action: row => { void this.router.navigate(['/tree', row.id, 'edit']); }
            }] },
            checkboxSelector: { enabled: true, selectAllEnabled: true, urlSelectAll: 'TreeDemo/GetSelectionKeys', width: 100 },
            singleSelector: { enabled: true, metakey: false }
          },
          views: {
            saveMode: storage === 'database' ? TableViewSaveMode.DatabaseStorage : TableViewSaveMode.LocalStorage,
            saveKey: storage === 'database' ? 'TreeDemo' : `TreeDemo-${mode}`,
            urlGet: 'TreeDemo/GetViews', urlSave: 'TreeDemo/SaveViews'
          }
        });
      }
    }
  }
}

@Component({
  selector: 'ecs-tree-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section style="padding: 24px;">
      <h2>{{ 'Tree node detail' | translate }}</h2>
      <p>{{ 'Identificador' | translate }}: {{ id }}</p>
      <a routerLink="/tree"><i class="pi pi-arrow-left" aria-hidden="true"></i> {{ 'Tree back to list' | translate }}</a>
    </section>
  `
})
export class TreeDemoDetail {
  readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}
