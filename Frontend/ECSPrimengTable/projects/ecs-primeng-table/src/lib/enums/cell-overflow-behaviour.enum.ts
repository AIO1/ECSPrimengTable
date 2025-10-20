/**
 * Defines how content that overflows a table cell is displayed.
 *
 * @remarks
 * This enumeration specifies the visual behavior of cell content when it exceeds the cell’s width.
 */
export enum CellOverflowBehaviour {
    /** The overflowing content is clipped and not visible. */
    Hidden,

    /** The content wraps onto multiple lines to fit within the cell. */
    Wrap
}