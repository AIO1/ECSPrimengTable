import { DataAlignHorizontal, DataAlignVertical, TableViewSaveMode } from "../enums";
import { IColumnMetadata, IPredefinedFilter, ITableButton } from "../interfaces";

/** Configuration options for ECS Primeng table */
export interface ITableOptions {

    /**
     * Controls whether the table is active.
     * 
     * - When `true`, the table will fetch configuration, columns, and data on init.
     * - When `false`, the table will **not** automatically fetch or update data, even after initialization.
     *   Use this if you want to apply filters, column changes, or other manipulations 
     *   without triggering automatic updates.
     * 
     * @default true
     */
    isActive?: boolean;

    /**
     * Endpoint URL to fetch the table configuration.
     * 
     * The configuration is fetched **once** when the table is initialized and is expected to return
     * an `ITableConfiguration` object from the API. This includes data such as column definitions, 
     * the timezone to use, and other settings.
     * 
     * If set to `undefined` or if `isActive` is `false`, the table will **not** fetch configuration automatically.
     * 
     * @default undefined
     */
    urlTableConfiguration?: string;

    /**
     * Endpoint URL to fetch the table data.
     * 
     * This endpoint is called **whenever the user filters, changes pages, or sorts** the table.
     * It is expected to return an `ITablePagedResponse` object containing the paginated data.
     * 
     * If set to `undefined` or if `isActive` is `false`, the table will **not** fetch or update data automatically.
     * 
     * @default undefined
     */
    urlTableData?: string;

    /**
     * The array of data to be displayed in the table.
     * 
     * Each item should represent a row and match the table's column structure.
     * 
     * @default []
     */
    data?: any[];

    /**
     * Configuration options for the table description section.
     */
    description?: {
        /**
         * Icon displayed alongside the table description.
         * You can use any PrimeIcons class or icons from third-party libraries
         * such as Material Icons or Font Awesome.
         *
         * @default "pi pi-info-circle"
         */
        icon?: string;

        /**
         * Determines how the description text is displayed.
         * - `true`, the `text` content is shown as a tooltip when hovering
         * over the description icon.
         * - `false`, the `text` is displayed inline to the right of the icon.
         *
         * @default true
         */
        tooltip?: boolean;

        /**
         * The description content to display.
         * If left undefined or string empty, the table description will not be rendered.
         * Supports basic HTML for rich text formatting.
         *
         * @default undefined
         */
        text?: string;
    }

    /**
     * Configuration options for the table legend.
     */
    legend?: {
        /**
         * The content to be displayed in the popover of the legend. Can be HTML rich.
         *
         * @default undefined
         */
        content?: string;

        /**
         * Configuration options for the legend button.
         * 
         * @default {
         *   icon: "pi pi-bars",
         *   label: "Legend",
         *   color: "p-button-primary"
         * }
         */
        button?: ITableButton;
    }

    /**
     * Configurations related to options that are at the header of the table.
     */
    header?: {
        /**
         * A collection of `ITableButton` to be shown in the table header.
         * 
         * @default []
         */
        buttons?: ITableButton[];

        /**
         * When set to `false`, the **clear sorts** button will be hidden.
         * 
         * @default true
         */
        clearSortsEnabled?: boolean;

        /**
         * Allows customization of the **clear sorts** button icon. You may use any other icons from PrimeNG or third-party providers such as Material Icons or Font Awesome.
         * 
         * @default "pi pi-sort-alt-slash"
         */
        clearSortsIcon?: string;

        /**
         * When set to `false`, the **clear filters** button will be hidden.
         * 
         * @default true
         */
        clearFiltersEnabled?: boolean;

        /**
         * Allows customization of the **clear filters** button icon. Other icons from PrimeNG or third-party libraries (e.g., Material Icons, Font Awesome) may also be used.
         * 
         * @default "pi pi-filter-slash"
         */
        clearFiltersIcon?: string;
    };

    /**
     * Configurations related to the columns of the table.
     */
    columns?: {
        /**
         * Enables or disables the column selector feature.
         * 
         * When `true`, a button is displayed in the top-left corner of the table.
         * Clicking this button opens a modal that allows users to:
         * - Show or hide columns.
         * - Adjust the cell overflow behavior for each column.
         * - Change the horizontal and vertical alignment of cells per column.
         * 
         * When `false`, the button to open the column's selector modal will not be available.
         * 
         * @default true
         */
        selectorEnabled?: boolean;

        /**
         * Can be used to specifiy a different icon to be used by the column selector.  
         * You can replace it with any icon from PrimeNG or other libraries such as Font Awesome or Material Icons.
         * 
         * @default "pi pi-pen-to-square"
         */
        selectorIcon?: string;

        /**
         * When `true`, columns in the selector are displayed alphabetically (A–Z).  
         * When `false`, columns keep the order provided by the backend.
         * 
         * @default true
         */
        selectorOrderByColumnName?: boolean;

        /**
         * The combination of non-selectable columns and user-selected columns 
         * that must be displayed in the table.
         * 
         * @default []
         */
        shown?: IColumnMetadata[];
    };

    /**
     * Configurations related to the rows of the table.
     */
    rows?: {
        /**
         * Function to dynamically assign CSS classes to a row.
         * 
         * Receives the `rowData` object for the current row and returns:
         * - A string with a single CSS class name
         * - An array of class names
         * - A Set of class names
         * - An object with class keys and truthy/falsy values
         * 
         * The returned classes are applied to the row in addition to any global or default styles.
         * Useful for changing appearance of a row based on column values.
         * 
         * Example:
         * ```ts
         * class: (rowData) => {
         *   const classes = [];
         *   if (rowData.status === "Unemployed") classes.push("unemployedRow");
         *   return classes;
         * }
         * ```
         */
        class?: (rowData: any) => string | string[] | Set<string> | { [klass: string]: any };

        /**
         * Function to dynamically assign inline styles to a row.
         * 
         * Receives the `rowData` object for the current row and returns an object
         * with CSS properties to apply inline. This allows dynamic styling based
         * on the row's content or values.
         * 
         * If not provided, no dynamic styles are applied.
         * 
         * Example:
         * ```ts
         * style: (rowData) => {
         *   if (rowData.status === "Full-time") {
         *     return { fontWeight: "bold", fontStyle: "italic" };
         *   }
         *   return {};
         * }
         * ```
         */
        style?: (rowData: any) => { [klass: string]: any };

        /**
         * Configurations related to the action column for the rows.
         */
        action?: {
            /**
             * A collection of `ITableButton` to be shown by this column to perform actions over rows. At least one button needs to be enable the row actions column.
             * 
             * @default []
             */
            buttons?: ITableButton[];

            /**
             * The header label for the row actions column.
             * 
             * @default "Actions"
             */
            header?: string;

            /**
             * If `true`, the column will appear on the right side of the table. Otherwise, it will appear on the left.
             * 
             * @default true
             */
            positionRight?: boolean;

            /**
             * The fixed column width in pixels.
             * 
             * @default 150
             */
            width?: number;

            /**
             * If `true`, the column remains visible when horizontally scrolling the table.
             * 
             * @default true
             */
            frozen?: boolean;

            /**
             * If `true`, users can resize the column.
             * 
             * @default false
             */
            resizable?: boolean;

            /**
             * How the items inside the action column are horizontally aligned.
             * 
             * @default DataAlignHorizontal.Center
             */
            horizontalAlignment?: DataAlignHorizontal;

            /**
             * How the items inside the action column are vertically aligned.
             * 
             * @default DataAlignVertical.Middle
             */
            verticalAlignment?: DataAlignVertical;
        };

        /**
         * Configurations related to the row checkbox selector.
         */
        checkboxSelector?: {
            /**
             * If `true`, a new column with checkboxes will be displayed. Users can select or unselect rows using these checkboxes. Additionally an option to filter by this column will be enabled.
             * 
             * @default false
             */
            enabled?: boolean;

            /**
             * The header label for the checkbox selection column.
             * 
             * @default "Selected"
             */
            header?: string;

            /**
             * If `true`, the column will appear on the right side of the table. Otherwise, it will appear on the left.
             * 
             * @default false
             */
            positionRight?: boolean;

            /**
             * The fixed column width in pixels.
             * 
             * @default 150
             */
            width?: number;

            /**
             * If `true`, the column remains visible when horizontally scrolling the table.
             * 
             * @default true
             */
            frozen?: boolean;

            /**
             * If `true`, users can resize the column.
             * 
             * @default false
             */
            resizable?: boolean;

            /**
             * Function that determines whether the checkbox should be enabled or not.
             * @param rowData The row data object.
             * @returns True if the checkbox should be enabled; false otherwise.
             * 
             * @default undefined
             */
            enabledCondition?: (rowData: any) => boolean;

            /**
             * How the checkbox inside the selector column is horizontally aligned.
             * 
             * @default DataAlignHorizontal.Center
             */
            horizontalAlignment?: DataAlignHorizontal;

            /**
             * How the checkbox inside the selector column is vertically aligned.
             * 
             * @default DataAlignVertical.Middle
             */
            verticalAlignment?: DataAlignVertical;
        };

        /**
         * Configurations related to the single row selector.
         */
        singleSelector?: {
            /**
             * If set to `true`, users can click a row to select it. You can then subscribe to selection events to execute custom actions.
             * 
             * @default false
             */
            enabled?: boolean;

            /**
             * When `true`, users must hold **CTRL** and click on a selected row to unselect it. When `false`, users can unselect a row simply by clicking it again.
             * 
             * On mobile devices (phones or tablets), the **CTRL** key configuration is ignored. Users can unselect a previously selected row by simply clicking it, as mobile devices do not have a **CTRL** key.
             * 
             * @default true
             */
            metakey?: boolean;
        };
    };

    /** Configurations related to the vertical scroll of the table. */
    verticalScroll?: {
        /**
         * Automatically adjust the table's height to fit its container.
         * 
         * When set to `true`, the table will calculate the maximum height dynamically 
         * so that it exactly fits its container. This takes precedence over the `height` property.
         * 
         * Ignored if a `cssFormula` has been provided.
         * 
         * @default true
         */
        fitToContainer?: boolean;

        /**
         * Fixed vertical height for the table when `fitToContainer` is `false`.
         * 
         * - If a `cssFormula` has been provided, this property is ignored.
         * - If `fitToContainer` from `verticalScroll` is `true`, this property is ignored.
         * - If set to a value `<= 0`, this is ignored.
         * 
         * Use this property to enable vertical scrolling with a fixed height when you do not want 
         * the table to dynamically fit its container.
         * 
         * @default 0
         */
        height?: number;

        /**
         * A CSS string used to define the table's vertical height.
         * 
         * Can be a fixed value (e.g., `"500px"`) or a CSS formula (e.g., `"calc(100vh - 200px)"`).
         * When provided, this value **overrides** both `fitToContainer` and `height`.
         * 
         * @default undefined
         */
        cssFormula?: string;
    };

    /** Configurations related to the global filter functionality of the table. */
    globalFilter?: {
        /**
         * Enables or disables the global filter input.
         * 
         * When set to `true`, users can search across all table columns using the global search bar.
         * When `false`, the global search input will not be rendered.
         * 
         * @default true
         */
        enabled?: boolean;

        /**
         * Maximum number of characters allowed in the global filter input.
         * 
         * Use this to limit the length of search queries and prevent excessively long input.
         * 
         * @default 20
         */
        maxLength?: number;
    };

    /**
     * Predefined filters for table columns.
     * 
     * Restricts filter options to a known set of values for a column.
     * Suitable for columns with a limited number of distinct values.
     * Supports plain text, tags, icons, and images. Works with `list` data types.
     * 
     * @default {}
     */
    predefinedFilters?: { [key: string]: IPredefinedFilter[] }

    /**
     * Configurations related to saved table views.
     */
    views?: {
        /**
         * Determines how the table views are saved.
         * 
         * - `TableViewSaveMode.None`: Do not save any views.
         * - `TableViewSaveMode.SessionStorage`: Save views in the browser session storage (cleared when the tab/window closes).
         * - `TableViewSaveMode.LocalStorage`: Save views in the browser local storage (persistent across sessions).
         * - `TableViewSaveMode.DatabaseStorage`: Save views directly in the database via the backend API. If you are using this method you will need to specify also the `urlGet`and `urlSave`
         * 
         * This allows users to keep their custom column orders, filters, sorting, and other table settings
         * according to the selected storage option.
         * 
         * @default TableViewSaveMode.None
         */
        saveMode?: TableViewSaveMode;
        
        /**
         * Key used to identify the table when saving and retrieving its views.
         * 
         * Each table should have a unique `saveKey` so that its saved views (filters, column order, sorting, etc.)
         * do not conflict with other tables.
         * 
         * If set to `undefined`, the table will not save or load any views.
         * 
         * @default undefined
         */
        saveKey?: string;

        /**
         * Endpoint URL to fetch saved views from the database.
         * 
         * Only used if `saveMode` is `TableViewSaveMode.databaseStorage`.
         * The `saveKey` is sent to identify the correct table views.
         * 
         * @default undefined
         */
        urlGet?: string;

        /**
         * Endpoint URL to save table views to the database.
         * 
         * Only used if `saveMode` is `TableViewSaveMode.databaseStorage`.
         * The `saveKey` is sent to identify the correct table views.
         * 
         * @default undefined
         */
        urlSave?: string;
    };

    /**
     * Configurations related to the reset table view button.
     */
    resetTableView?:{
        /**
         * If the reset table view button should be enabled.
         * 
         * @default true
         */
        enabled?: boolean;

        /**
         * Can be used to specifiy a different icon to be used by the reset table view button.
         * You can replace it with any icon from PrimeNG or other libraries such as Font Awesome or Material Icons.
         * 
         * @default "pi pi-eraser"
         */
        icon?: string;
    }

    /**
     * Configurations for exporting the table data to Excel.
     */
    excelReport?: {
         /**
         * Endpoint URL of the API to perform the Excel export.
         * 
         * When set, the table will send a request to this endpoint including the properties
         * specified by the user, such as selected columns, filters, and sort order, to generate
         * the export.
         * 
         * If set to `undefined`, Excel export functionality will be disabled.
         * 
         * @default undefined
         */
        url?: string;

        /**
         * Default title shown in the Excel export modal when preparing the export.
         * 
         * If the string is empty (after trimming) **and** `titleAllowUserEdit` is `false`, 
         * the export button will be disabled.
         * 
         * @default "Report"
         */
        defaultTitle?: string;

        /**
         * Determines whether the user can edit the title of the Excel file in the export modal.
         * 
         * - If `true`, the user can modify the title before exporting.
         * - If `false`, the title is fixed to `defaultTitle`.
         * 
         * @default true
         */
        titleAllowUserEdit?: boolean;
    }

    /**
     * Defines the number of seconds the user must hold the mouse button on a cell before its content is copied to the clipboard. Set to a value <= 0 to turn off this feature entirely
     * 
     * @default 0.5
     */
    copyToClipboardTime?: number;
}

/** Default configuration options for ECS Primeng table */
export const DEFAULT_TABLE_OPTIONS: ITableOptions = {
    isActive: true,
    urlTableConfiguration: undefined,
    urlTableData: undefined,
    data: [],
    description: {
        icon: "pi pi-info-circle",
        tooltip: true,
        text: undefined
    },
    legend: {
        content: undefined,
        button: {
            icon: "pi pi-bars",
            label: "Legend",
            color: "p-button-primary"
        }
    },
    header: {
        buttons: [],
        clearSortsEnabled: true,
        clearSortsIcon: "pi pi-sort-alt-slash",
        clearFiltersEnabled: true,
        clearFiltersIcon: "pi pi-filter-slash"
    },
    columns: {
        selectorEnabled: true,
        selectorIcon: "pi pi-pen-to-square",
        selectorOrderByColumnName: true,
        shown: []
    },
    rows: {
        style: () => ({}),
        class: () => ({}),
        action: {
            buttons: [],
            header: "Actions",
            positionRight: true,
            width: 150,
            frozen: true,
            resizable: false,
            horizontalAlignment: DataAlignHorizontal.Center,
            verticalAlignment: DataAlignVertical.Middle
        },
        checkboxSelector: {
            enabled: false,
            header: "Selected",
            positionRight: false,
            width: 150,
            frozen: true,
            resizable: false,
            enabledCondition: undefined,
            horizontalAlignment: DataAlignHorizontal.Center,
            verticalAlignment: DataAlignVertical.Middle
        },
        singleSelector: {
            enabled: false,
            metakey: true
        }
    },
    verticalScroll: {
        fitToContainer: true,
        height: 0,
        cssFormula: undefined
    },
    globalFilter: {
        enabled: true,
        maxLength: 20
    },
    predefinedFilters: {},
    views: {
        saveMode: TableViewSaveMode.None,
        saveKey: undefined,
        urlGet: undefined,
        urlSave: undefined
    },
    resetTableView: {
        enabled: true,
        icon: "pi pi-eraser"
    },
    excelReport: {
        url: undefined,
        defaultTitle: "Report",
        titleAllowUserEdit: true
    },
    copyToClipboardTime: 0.5
};