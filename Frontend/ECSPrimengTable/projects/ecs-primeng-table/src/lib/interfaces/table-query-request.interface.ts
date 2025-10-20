/**
 * Represents a request for querying table data with pagination, sorting, and filtering.
 *
 * @remarks
 * Includes information about page, page size, sorting, filters, and date formatting options.
 */
export interface ITableQueryRequest {
    
    /** The current page number. */
    page: number;

    /** The number of items per page. */
    pageSize: number;

    /** Optional sorting configuration. */
    sort?: any;

    /** Filter criteria for the query. */
    filter: any;

    /** Optional global filter applied across all columns. */
    globalFilter?: string | null;

    /** Optional array of column names to include in the query. */
    columns?: string[];

    /** The date format used for query parameters. */
    dateFormat: string;

    /** The timezone used for formatting date values. */
    dateTimezone: string;

    /** The culture/locale used for formatting dates and numbers. */
    dateCulture: string;
}