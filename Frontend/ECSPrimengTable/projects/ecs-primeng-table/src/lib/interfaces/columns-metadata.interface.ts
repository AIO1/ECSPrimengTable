import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign } from "../enums";

/**
 * Represents the metadata for a column in a table.
 *
 * @remarks
 * Provides configuration for column behavior, appearance, and user interactions.
 */
export interface IColumnMetadata {
    
    /** The key or identifier for the column's data field. */
    field: string;

    /** The display name of the column header. */
    header: string;

    /** The type of data contained in the column. */
    dataType: DataType;

    /** The horizontal alignment of the column content. */
    dataAlignHorizontal: DataAlignHorizontal;

    /** Indicates whether the horizontal alignment can be modified by the user. */
    dataAlignHorizontalAllowUserEdit: boolean;

    /** The vertical alignment of the column content. */
    dataAlignVertical: DataAlignVertical;

    /** Indicates whether the vertical alignment can be modified by the user. */
    dataAlignVerticalAllowUserEdit: boolean;

    /** Determines if the column can be hidden. */
    canBeHidden: boolean;

    /** Determines if the column should initially be hidden. */
    startHidden: boolean;

    /** Determines if the column can be resized by the user. */
    canBeResized: boolean;

    /** Determines if the column can be reordered by the user. */
    canBeReordered: boolean;

    /** Determines if the column can be sorted. */
    canBeSorted: boolean;

    /** Determines if the column can be filtered. */
    canBeFiltered: boolean;

    /** Name of predefined filter values, if any. */
    filterPredefinedValuesName: string;

    /** Determines if the column can be included in global filtering. */
    canBeGlobalFiltered: boolean;

    /** Description or tooltip text for the column. */
    columnDescription: string;

    /** Determines if a tooltip should be shown for the column data. */
    dataTooltipShow: boolean;

    /** Custom source for the tooltip content, if applicable. */
    dataTooltipCustomColumnSource: string;

    /** Alignment for frozen columns (left or right). */
    frozenColumnAlign: FrozenColumnAlign;

    /** Specifies how overflowing content is handled within the cell. */
    cellOverflowBehaviour: CellOverflowBehaviour;

    /** Indicates whether the cell overflow behavior can be modified by the user. */
    cellOverflowBehaviourAllowUserEdit: boolean;

    /** Initial width of the column in pixels. */
    initialWidth: number;

    /** Optional date format override for this column. */
    dateFormat: string | null;

    /** Optional timezone override. */
    dateTimezone: string | null;

    /** Optional culture override. */
    dateCulture: string | null;
}