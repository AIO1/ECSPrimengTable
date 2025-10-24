import { Component, Input } from '@angular/core';
import { DataAlignHorizontal, DataAlignVertical, DataType } from '../../enums';
import { CommonModule, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { dataAlignHorizontalAsText, dataAlignVerticalAsText, highlightText } from '../../utils';
import { IColumnMetadata, IPredefinedFilter } from '../../interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TablePredefinedFilters } from "../table-predefined-filters/table-predefined-filters";
@Component({
  selector: 'ecs-table-cell',
  imports: [
    CommonModule,
    TooltipModule,
    TablePredefinedFilters
],
  standalone: true,
  templateUrl: './table-cell.html'
})
export class TableCell {
  constructor(
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}
  @Input() col: any;
  @Input() rowData: any;
  @Input() globalSearchText: string | null = null;
  @Input() predefinedFiltersCollection?: { [key: string]: IPredefinedFilter[] } = {}; // Contains a collection of the values that need to be shown for predefined column filters
  @Input() dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  @Input() dateTimezone: string = "+00:00";
  @Input() dateCulture: string = "en-US";

  DataType = DataType;

  get value() {
    return this.rowData[this.col.field];
  }

  get tooltipText() {
    if (this.col.dataTooltipCustomColumnSource && this.col.dataTooltipCustomColumnSource.length > 0) {
      return this.rowData[this.col.dataTooltipCustomColumnSource];
    }
    return this.value;
  }

  getListValues(col: any, rowData: any): string[] {
    const value = rowData[col.field];
    return value ? value.split(';').map((v: any) => v.trim()) : [];
  }

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal){
      dataAlignHorizontalAsText(dataAlignHorizontal);
  }
  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical){
      dataAlignVerticalAsText(dataAlignVertical);
  }
  

  /**
   * Formats a date value to a specific string format. Provided date will be assumed to be in UTC
   *
   * @param {any} value - The date value to be formatted.
   * @returns {string} - The formatted date string in 'dd-MMM-yyyy HH:mm:ss' format followed by the timezone, or empty string if the provided value is invalid or undefined.
   * 
   * @example
   * // Example date value
   * const dateValue: Date = new Date();
   * 
   * // Use formatDate to get the formatted date string
   * const formattedDate: string = formatDate(dateValue);
   * 
   * // Output might be: '18-Jun-2024 14:30:00 GMT+0000'
   */
  formatDate(value: any): string{
    let formattedDate = undefined; // By default, formattedDate will be undefined
    if(value){ // If value is not undefined
      formattedDate = this.datePipe.transform(value, this.dateFormat, this.dateTimezone, this.dateCulture); // Perform the date masking
    }
    return formattedDate ?? ''; // Returns the date formatted, or as empty string if an issue was found (or value was undefined).
  }

  getPredefinedFilterTooltip(colMetadata: IColumnMetadata, value: any): any {
    if(colMetadata.dataType == DataType.List){
      return value;
    }
    if(colMetadata.filterPredefinedValuesName && colMetadata.filterPredefinedValuesName.length > 0){
      const options = this.getPredefinedFilterValues(colMetadata.filterPredefinedValuesName);
      return options.find(x => x.value == value)?.name
    }
    return null;
  }

  /**
   * Checks if the provided column metadata matches a specific style of the predefined filters 
   * that need to be applied to an item on a row.
   *
   * @param {IprimengColumnsMetadata} colMetadata - The metadata of the column being checked.
   * @param {any} value - The value to be matched against the predefined filter values.
   * @returns {any} The matching predefined filter value if found, otherwise null.
   */
  getPredfinedFilterMatch(colMetadata: IColumnMetadata, value: any): any {
    if (colMetadata.filterPredefinedValuesName && colMetadata.filterPredefinedValuesName.length > 0) { // Check if the column uses predefined filter values
        const options = this.getPredefinedFilterValues(colMetadata.filterPredefinedValuesName); // Get the predefined filter values based on the name
        return options.find(option => option.value === value); // Return the matching option if found
    }
    return null; // Return null if the column does not use predefined filter values
  }
  getPredefinedFilterValues(columnKeyName: string): IPredefinedFilter[] {
    return this.predefinedFiltersCollection?.[columnKeyName] || []; // Return the predefined filter values or an empty array if the option name does not exist
  }

  highlightText(cellValue: any, colMetadata: IColumnMetadata, globalSearchText: string | null): SafeHtml {
      return highlightText(cellValue, colMetadata, globalSearchText, this.sanitizer);
  }
}