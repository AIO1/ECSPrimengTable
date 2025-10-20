import { DataType } from "../enums";

/**
 * Converts a `DataType` enum value to its corresponding string representation.
 *
 * @param dataType - The data type enum value.
 * @returns The string representation of the data type ('text', 'numeric', 'boolean', or 'date').
 *
 * @remarks
 * If an unknown value is provided, the function defaults to 'text'.
 */
export function dataTypeAsText(dataType: DataType): string {
    switch (dataType) {
        case DataType.Text:
            return 'text';
        case DataType.Numeric:
            return 'numeric';
        case DataType.Boolean:
            return 'boolean';
        case DataType.Date:
            return 'date';
        default:
            return 'text';
    }
}