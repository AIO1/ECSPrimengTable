import { DataAlignHorizontal } from "../enums";

/**
 * Converts a `DataAlignHorizontal` enum value to its corresponding CSS text alignment string.
 *
 * @param dataAlignHorizontal - The horizontal alignment enum value.
 * @returns The CSS text alignment string ('left', 'center', or 'right').
 *
 * @remarks
 * If an unknown value is provided, the function defaults to 'center'.
 */
export function dataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal): string {
    switch (dataAlignHorizontal) {
        case DataAlignHorizontal.Left:
            return 'left';
        case DataAlignHorizontal.Center:
            return 'center';
        case DataAlignHorizontal.Right:
            return 'right';
        default:
            return 'center';
    }
}