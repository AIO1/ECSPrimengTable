import { ITableQueryRequest } from "./table-query-request.interface";

/**
 * Represents the request parameters for exporting table data to Excel.
 *
 * @remarks
 * Extends `ITableQueryRequest` to include Excel-specific options such as filename,
 * column selection, and whether to apply current filters and sorts.
 */
export interface IExcelExportRequest extends ITableQueryRequest {
    
    /** The desired name of the exported Excel file. */
    filename: string;

    /** Determines whether all columns should be included in the export. */
    allColumns: boolean;

    /** Determines whether the current table filters should be applied in the export. */
    applyFilters: boolean;

    /** Determines whether the current table sorting should be applied in the export. */
    applySorts: boolean;
}