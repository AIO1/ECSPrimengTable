import { Component, input, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { DataAlignHorizontal, DataAlignVertical, DataType } from '../../enums';
import { dataAlignHorizontalAsText, dataAlignVerticalAsText, highlightText } from '../../utils';
import { IColumnMetadata, IPredefinedFilter } from '../../interfaces';
import { TablePredefinedFilters } from "../table-predefined-filters/table-predefined-filters";

@Component({
  selector: 'ecs-table-cell',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    TablePredefinedFilters
  ],
  templateUrl: './table-cell.html',
  providers: [DatePipe]
})
export class TableCell {
  private datePipe = inject(DatePipe);
  private sanitizer = inject(DomSanitizer);

  readonly col = input.required<any>();
  readonly rowData = input.required<any>();
  readonly globalSearchText = input<string | null>(null);
  readonly predefinedFiltersCollection = input<{ [key: string]: IPredefinedFilter[] }>({});
  readonly dateFormat = input<string>("dd-MMM-yyyy HH:mm:ss zzzz");
  readonly dateTimezone = input<string>("+00:00");
  readonly dateCulture = input<string>("en-US");

  readonly DataType = DataType;

  readonly value = computed(() => {
    const row = this.rowData();
    const column = this.col();
    return row && column ? row[column.field] : null;
  });

  readonly tooltipText = computed(() => {
    const column = this.col();
    const row = this.rowData();
    const val = this.value();

    if (column?.dataTooltipCustomColumnSource && column.dataTooltipCustomColumnSource.length > 0) {
      return row[column.dataTooltipCustomColumnSource];
    }
    return val;
  });

  readonly listValues = computed<string[]>(() => {
    const val = this.value();
    return val ? String(val).split(';').map((v: string) => v.trim()) : [];
  });

  readonly formattedDateValue = computed<string>(() => {
    const val = this.value();
    const column = this.col();
    return this.formatDate(
      val, 
      column?.dateFormat, 
      column?.dateTimezone, 
      column?.dateCulture
    );
  });

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal): string {
    return dataAlignHorizontalAsText(dataAlignHorizontal) || 'flex-start';
  }

  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical): string {
    return dataAlignVerticalAsText(dataAlignVertical) || 'center';
  }

  formatDate(value: any, dateFormat: string | null, dateTimezone: string | null, dateCulture: string | null): string {
    if (!value) {
      return '';
    }
    let formattedDate: string | null = null;
    const effectiveFormat = dateFormat ?? this.dateFormat();
    const effectiveTimezone = dateTimezone ?? this.dateTimezone();
    const effectiveCulture = dateCulture ?? this.dateCulture();

    let dateToParse = value;
    if (typeof value === 'string' && !value.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(value)) {
      dateToParse += 'Z';
    }
    const dateUtc = new Date(dateToParse);
    if (!isNaN(dateUtc.getTime())) {
      formattedDate = this.datePipe.transform(dateUtc, effectiveFormat, effectiveTimezone, effectiveCulture);
    }
    return formattedDate ?? '';
  }

  getPredefinedFilterTooltip(colMetadata: IColumnMetadata, value: any): any {
    if (colMetadata.dataType === DataType.List) {
      return value;
    }
    if (colMetadata.filterPredefinedValuesName && colMetadata.filterPredefinedValuesName.length > 0) {
      const options = this.getPredefinedFilterValues(colMetadata.filterPredefinedValuesName);
      return options.find(x => x.value === value)?.name;
    }
    return null;
  }

  getPredfinedFilterMatch(colMetadata: IColumnMetadata, value: any): any {
    if (colMetadata.filterPredefinedValuesName && colMetadata.filterPredefinedValuesName.length > 0) {
      const options = this.getPredefinedFilterValues(colMetadata.filterPredefinedValuesName);
      return options.find(option => option.value === value);
    }
    return null;
  }

  getPredefinedFilterValues(columnKeyName: string): IPredefinedFilter[] {
    return this.predefinedFiltersCollection()?.[columnKeyName] || [];
  }

  highlightText(cellValue: any, colMetadata: IColumnMetadata, globalSearchText: string | null): SafeHtml {
    return highlightText(cellValue, colMetadata, globalSearchText, this.sanitizer);
  }
}