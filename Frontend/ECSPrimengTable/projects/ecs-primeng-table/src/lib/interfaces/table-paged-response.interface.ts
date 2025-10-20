/**
 * Represents a paged response from a table query.
 *
 * @remarks
 * Provides information about the current page, total records, and the data for the page.
 */
export interface ITablePagedResponse {
    
    /** The current page number. */
    page: number;

    /** Total number of records after applying any filters. */
    totalRecords: number;

    /** Total number of records without applying any filters. */
    totalRecordsNotFiltered: number;
    
    /** The data items for the current page. */
    data: any;
}