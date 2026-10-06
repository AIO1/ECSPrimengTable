import { Component, effect, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ECSPrimengTableNotificationService } from '../../services';
import { ExportExcelService } from './export-excel.service';

@Component({
  selector: 'ecs-export-excel',
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule
  ],
  standalone: true,
  templateUrl: './export-excel.html'
})
export class ExportExcel {
  readonly visible = model<boolean>(false);
  readonly rowCheckboxSelectorActive = input<boolean>(false);
  readonly excelReportTitle = model<string>('');
  readonly allowTitleUserEdit = input<boolean>(false);

  readonly exportToExcel = output<{
    allColumns: boolean,
    applyFilters: boolean,
    applySorts: boolean,
    selectedRows: number,
    filename: string,
    useIconInBools: boolean
  }>();
  readonly includeTimeInTitle = model<boolean>(true);
  readonly exportUseIconsInBools = model<boolean>(false);
  
  readonly option_exportColumns_selected = model<boolean>(false);
  readonly option_exportColumns = [
    { label: 'Only visible', value: false },
    { label: 'All columns', value: true }
  ];

  readonly option_applyCurrentFilters_selected = model<boolean>(false);
  readonly option_applyCurrentFilters = [
    { label: 'No filters', value: false },
    { label: 'Apply current filters', value: true }
  ];

  readonly option_applyCurrentSorts_selected = model<boolean>(false);
  readonly option_applyCurrentSorts = [
    { label: 'No sorts', value: false },
    { label: 'Apply current sorts', value: true }
  ];

  readonly option_selectedRowsExport_selected = model<number>(0);
  readonly option_selectedRowsExport = [
    { label: 'All rows', value: 0 },
    { label: 'Selected rows', value: 1 },
    { label: 'Not selected rows', value: 2 }
  ];

  constructor(
    private notificationService: ECSPrimengTableNotificationService,
    private exportExcelService: ExportExcelService
  ) {
    effect(() => {
      if (this.visible()) {
        this.resetValues();
      }
    });
  }

  private resetValues() {
    this.includeTimeInTitle.set(true);
    this.exportUseIconsInBools.set(false);
    this.option_exportColumns_selected.set(false);
    this.option_applyCurrentFilters_selected.set(false);
    this.option_applyCurrentSorts_selected.set(false);
    this.option_selectedRowsExport_selected.set(0);
  }

  filterSelectorDisabled(): boolean {
    return this.option_selectedRowsExport_selected() >= 1;
  }

  onChangeExportRows(event: SelectButtonChangeEvent): void {
    if (event.value >= 1) {
      this.option_applyCurrentFilters_selected.set(true);
    }
  }

  getExcelReport() {
    let excelReportFinalTitle: string = "";
    const currentTitle = this.excelReportTitle()?.trim();

    if (!currentTitle || currentTitle.length <= 0) {
      this.notificationService.clearToasts();
      this.notificationService.showToast("error", "REPORT NAME NOT VALID", "The report name is not valid");
      return; 
    }
    
    const allowedPattern = /^[A-Za-z0-9 _-]*$/;
    if (!allowedPattern.test(currentTitle)) {
      this.notificationService.clearToasts();
      this.notificationService.showToast("error", "INVALID CHARACTERS IN REPORT NAME", "The report name contains invalid characters.");
      return;
    }

    if (this.includeTimeInTitle()) {
      excelReportFinalTitle = currentTitle + this.exportExcelService.getCurrentTimeString() + ".xlsx";
    } else {
      excelReportFinalTitle = currentTitle + ".xlsx";
    }

    this.exportToExcel.emit({
      allColumns: this.option_exportColumns_selected(),
      applyFilters: this.option_applyCurrentFilters_selected(),
      applySorts: this.option_applyCurrentSorts_selected(),
      selectedRows: this.option_selectedRowsExport_selected(),
      filename: excelReportFinalTitle,
      useIconInBools: this.exportUseIconsInBools()
    });
  }

  closeModal() {
    this.visible.set(false);
  }
}