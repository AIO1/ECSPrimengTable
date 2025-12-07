/**
 * Interface representing a table action button, applicable for both header and row buttons.
 */
export interface ITableButton {
    
    /**
     * Optional. The icon to display on the button.
     * Should be a valid icon name from PrimeNG, Material Icons, Font Awesome, or similar libraries.
     */
    icon?: string;

    /**
     * Optional. The position of the icon relative to the button label.
     * Defaults to "left". Possible values are:
     * - "left"
     * - "right"
     * - "top"
     * - "bottom"
     */
    iconPos?: string;

    /**
     * Optional. The text label displayed on the button.
     */
    label?: string;

    /**
     * Optional. If true, the button will be round. Defaults to false.
     */
    rounded?: boolean;

    /**
     * Optional. If true, adds a shadow to indicate elevation. Defaults to false.
     */
    raised?: boolean;

    /**
     * Optional. Specifies the variant of the button.
     * Can be null (default), "text", or "outlined".
     */
    variant?: string;

    /**
     * Optional. Extra CSS classes to apply to the button.
     */
    class?: string;
    
    /**
     * Optional. Additional inline CSS styles for the button.
     */
    style?: string;

    /**
     * Optional. Function that determines whether the button should be visible for a given row.
     * @param rowData The row data object. Null for header buttons.
     * @returns True if the button should be visible; false otherwise.
     */
    visibleCondition?: (rowData: any) => boolean;

    /**
     * Optional. Function that determines whether the button should be displayed for a given row.
     * 
     * Ignored if `visibleCondition` returns false.
     * @param rowData The row data object. Null for header buttons.
     * @returns True if the button should be enabled; false otherwise.
     */
    enabledCondition?: (rowData: any) => boolean;

    /**
     * Optional. Controls behavior when `enabledCondition` returns false.
     * - If `true`, the button will be hidden when the 'enabledCondition' is not met.
     * - If `false` or `undefined`, the button will remain visible but disabled if 'enabledCondition' is not met.
     * 
     * Ignored if `visibleCondition` returns false.
     */
    conditionFailHide?: boolean;

    /**
     * Optional. The action to execute when the button is clicked.
     * @param rowData The row data object of the clicked row. Null for header buttons.
     */
    action?: (rowData: any) => void;

    /**
     * Optional. Tooltip text to display when the user hovers over the button.
     */
    tooltip?: string;
}