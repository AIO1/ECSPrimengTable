import { SortMeta } from "primeng/api";
import { IColumnMetadata } from "./columns-metadata.interface";

/**
 * Represents the current state and configuration of a table view.
 *
 * @remarks
 * Includes information about displayed columns, widths, sorting, filtering, and pagination.
 */
export interface ITableViewData {
    
    /** Array of columns currently visible in the table. */
    columnsShown: IColumnMetadata[];

    /** The total width of the table in pixels. */
    tableWidth: any;

    /** Widths of individual columns as a formatted string (in pixels). */
    columnsWidth: string;

    /** Sorting metadata for multiple columns, if applicable. */
    multiSortMeta: SortMeta[] | null | undefined;

    /** Current filter settings applied to the table. */
    filters: any;

    /** Text used for global search across all columns, if any. */
    globalSearchText: string | null;

    /** The current page number. */
    currentPage: number;

    /** The number of rows displayed per page. */
    currentRowsPerPage: number;
}
