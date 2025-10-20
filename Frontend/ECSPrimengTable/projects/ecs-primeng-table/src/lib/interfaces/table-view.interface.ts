import { ITableViewData } from "./table-view-data.interface";

/**
 * Represents a saved or active view of a table.
 *
 * @remarks
 * Contains information about whether the view is currently active, its alias, and the view data.
 */
export interface ITableView {
    
    /** Indicates if this view is the last active one. */
    lastActive: boolean;

    /** Alias or name of the view. */
    viewAlias: string;

    /** The detailed data and configuration for this view. */
    viewData: ITableViewData;
}
