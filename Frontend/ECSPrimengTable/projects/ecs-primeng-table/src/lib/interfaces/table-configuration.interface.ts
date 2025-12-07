import { IColumnMetadata } from "../interfaces";

/**
 * Represents the configuration settings for a table.
 *
 * @remarks
 * Contains column definitions, pagination options, date formatting, and other table-related settings.
 */
export interface ITableConfiguration {
    
    /** Array of metadata objects defining each column in the table. */
    columnsInfo: IColumnMetadata[];

    /** Allowed options for the number of items displayed per page. */
    allowedItemsPerPage: number[];

    /** The format used for displaying dates in the table. */
    dateFormat: string;

    /** The timezone applied when formatting date values. */
    dateTimezone: string;

    /** The culture/locale used for date and number formatting. */
    dateCulture: string;

    /** Maximum number of table views that can be saved or tracked. */
    maxViews: number;

    /** The format used for displaying dates in the exports. */
    exportDateFormat: string;

}