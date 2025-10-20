import { DataAlignVertical } from "../enums";

/**
 * Converts a `DataAlignVertical` enum value to its corresponding CSS vertical alignment string.
 *
 * @param dataAlignVertical - The vertical alignment enum value.
 * @returns The CSS vertical alignment string ('top', 'middle', or 'bottom').
 *
 * @remarks
 * If an unknown value is provided, the function defaults to 'middle'.
 */
export function dataAlignVerticalAsText(dataAlignVertical: DataAlignVertical): string {
    switch (dataAlignVertical) {
        case DataAlignVertical.Top:
            return 'top';
        case DataAlignVertical.Middle:
            return 'middle';
        case DataAlignVertical.Bottom:
            return 'bottom';
        default:
            return 'middle';
    }
}