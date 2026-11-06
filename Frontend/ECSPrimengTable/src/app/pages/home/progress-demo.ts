import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ECSPrimengTable, ECSPrimengTableStateService, createTableOptions, TableViewSaveMode } from 'ecs-primeng-table';

@Component({
  selector: 'ecs-progress-demo',
  standalone: true,
  imports: [ECSPrimengTable, TranslatePipe],
  providers: [ECSPrimengTableStateService],
  template: `
    <section style="padding: 12px;">
      <h2>{{ 'Barras de progreso' | translate }}</h2>
      <p>{{ 'Compara el porcentaje, el tooltip personalizado y el tooltip desactivado. Los filtros y Excel usan el valor numérico.' | translate }}</p>
      <ecs-primeng-table [tableOptions]="tableOptions" />
    </section>
  `
})
export class ProgressDemo {
  readonly tableOptions = createTableOptions({
    responsive: { headerMenu: true },
    urlTableConfiguration: 'ProgressDemo/GetTableConfiguration',
    urlTableData: 'ProgressDemo/GetTableData',
    excelReport: { url: 'ProgressDemo/GenerateExcel' },
    views: { saveMode: TableViewSaveMode.LocalStorage, saveKey: 'PROGRESS_DEMO' }
  });
}
