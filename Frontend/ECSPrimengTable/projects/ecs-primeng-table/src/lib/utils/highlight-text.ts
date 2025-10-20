import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IColumnMetadata } from "../interfaces";
import { DataType } from "../enums";

/**
 * Generates sanitized HTML (`SafeHtml`) with highlighted text based on a global search term.
 *
 * @remarks
 * This utility safely creates HTML content where occurrences of the provided global search text
 * within the cell value are wrapped in a `<span class="highlighted-text">` tag for visual emphasis.
 * If the cell does not match the search text or is of type `Boolean`, the original value is returned as safe HTML.
 *
 * @param {any} cellValue - The cell's value that may contain the text to highlight.
 * @param {IColumnMetadata} colMetadata - Metadata configuration of the column that defines its data type and filtering behavior.
 * @param {string | null} globalSearchText - The search text to highlight if found within the cell's content.
 * @param {DomSanitizer} sanitizer - Angular's sanitizer used to safely produce trusted HTML content.
 * @returns {SafeHtml} A `SafeHtml` instance containing highlighted HTML when a match is found, or the original sanitized text otherwise.
 */
export function highlightText(cellValue: any, colMetadata: IColumnMetadata, globalSearchText: string | null, sanitizer: DomSanitizer): SafeHtml {
    if (colMetadata.dataType !== DataType.Boolean && globalSearchText !== null) { // Check if the column data type is not boolean and global search text is not null
        const valueToUse = String(cellValue); // Convert cell value to string
        if (colMetadata.canBeGlobalFiltered) { // Check if the column can be globally filtered
            const searchLowerCase = globalSearchText.toUpperCase(); // Convert global search text to uppercase for case-insensitive comparison
            const cellValueLowerCase = valueToUse.toUpperCase(); // Convert cell value to uppercase for case-insensitive comparison
            if (cellValueLowerCase.includes(searchLowerCase)) { // Check if the cell value contains the search text
                // Determine the start and end indices of the search text within the cell value
                const startIndex = cellValueLowerCase.indexOf(searchLowerCase);
                const endIndex = startIndex + globalSearchText.length;
                // Extract the prefix, highlight, and suffix of the cell value
                const prefix = valueToUse.substring(0, startIndex);
                const highlight = valueToUse.substring(startIndex, endIndex);
                const suffix = valueToUse.substring(endIndex);
                return sanitizer.bypassSecurityTrustHtml(`${prefix}<span class="highlighted-text">${highlight}</span>${suffix}`); // Construct SafeHtml with highlighted text using the <mark> element
            }
        }
    }
    return sanitizer.bypassSecurityTrustHtml(String(cellValue)); // Return the original cell value if it doesn't meet the highlighting conditions
}