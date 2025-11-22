using ClosedXML.Excel;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using DocumentFormat.OpenXml.Spreadsheet;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using System.Globalization;
using System.Reflection;

namespace ECS.PrimengTable.Services {
    /// <summary>
    /// Provides internal logic for generating Excel reports from dynamic table queries.
    /// This service executes the query pipeline, retrieves data and formats it into a structured Excel file using ClosedXML.
    /// </summary>
    /// <remarks>
    /// This class is intended for internal use only and should not be accessed directly.
    /// External consumers should use <see cref="EcsPrimengTableService"/> instead.
    /// </remarks>
    internal class ExcelExportService {

        /// <summary>
        /// Generates an Excel report from the provided query and export configuration.
        /// The method executes the dynamic query pipeline (filters, sorting, pagination), selects the requested columns,
        /// and writes the results into an Excel workbook which is returned as a byte array.
        /// </summary>
        /// <typeparam name="T">The entity type being queried and exported.</typeparam>
        /// <param name="inputDataAll">Export request model containing pagination, sorting, filtering and column selection options.</param>
        /// <param name="baseQuery">The base <see cref="IQueryable{T}"/> to apply dynamic operations on.</param>
        /// <param name="stringDateFormatMethod">Optional reflection method used to apply a specific date formatting function to string date columns.</param>
        /// <param name="defaultSortColumnName">Optional list of column names to use for sorting when no explicit sort is provided in the input.</param>
        /// <param name="defaultSortOrder">Optional list of sort directions (<see cref="ColumnSort"/>) matching the default columns.</param>
        /// <param name="excludedColumns">Optional list of column names to exclude from the select, even if they appear in the requested columns from <paramref name="inputData"/>.</param>
        /// <param name="sheetName">Name of the worksheet to create in the workbook. Defaults to "MAIN".</param>
        /// <param name="pageStack">Number of records to process per internal pagination batch (memory page). Defaults to 250.</param>
        /// <returns>
        /// A tuple containing:
        /// <list type="bullet">
        /// <item><description><c>success</c> — true if the Excel generation succeeded; false otherwise.</description></item>
        /// <item><description><c>reportFile</c> — the generated Excel file as a byte array, or null if generation failed.</description></item>
        /// <item><description><c>statusMessage</c> — status message or error description related to the export process.</description></item>
        /// </list>
        /// </returns>
        internal static (bool success, byte[]? reportFile, string statusMessage) GenerateExcelReport<T>(ExcelExportRequestModel inputDataAll, IQueryable<T> baseQuery, MethodInfo? stringDateFormatMethod = null, List<string>? defaultSortColumnName = null, List<ColumnSort>? defaultSortOrder = null, List<string>? excludedColumns = null, string sheetName = "MAIN", byte pageStack = 250) {
            try {
                TableQueryRequestModel inputData = new() {
                    Page = inputDataAll.Page,
                    PageSize = inputDataAll.PageSize,
                    Sort = inputDataAll.Sort,
                    Filter = inputDataAll.Filter,
                    GlobalFilter = inputDataAll.GlobalFilter,
                    Columns = inputDataAll.Columns,
                    DateFormat = inputDataAll.DateFormat,
                    DateTimezone = inputDataAll.DateTimezone,
                    DateCulture = inputDataAll.DateCulture
                }; // Build a TableQueryRequestModel from the provided export input
                if(!inputDataAll.ApplySorts) {
                    inputData.Sort = [];
                }
                string reportDateFormatted = DateTime.UtcNow.ToString("dd-MMM-yyyy hh:mm:ss", CultureInfo.GetCultureInfo("en-US")); // Generate timestamp for the report
                TableConfigurationModel columnsInfo = EcsPrimengTableService.GetTableConfiguration<T>(excludedColumns: excludedColumns, convertFieldToLower: false); // Retrieve table configuration (column metadata)
                if(inputDataAll.AllColumns) { // If exporting all columns, include all column fields from the configuration
                    inputData.Columns = columnsInfo.ColumnsInfo
                        .Where(c => excludedColumns == null || !excludedColumns.Contains(c.Field, StringComparer.OrdinalIgnoreCase))
                        .Select(column => column.Field)
                        .ToList();
                }
                var propertyAccessors = inputData.Columns!
                    .ToDictionary(
                        column => char.ToUpperInvariant(column[0]) + column.Substring(1),
                        column => (Func<object, object?>)((item) => {
                            var propName = char.ToUpperInvariant(column[0]) + column.Substring(1);
                            return item.GetType().GetProperty(propName)?.GetValue(item);
                        })
                    ); // Prepare property accessors for dynamic value extraction
                long totalRecordsNotFiltered = 0; // Initialize counter of total available records
                long totalRecords = 0; // Initialize counter of filtered record count
                string fieldName; // Used to track the name of the current column
                TableQueryProcessingService.GetDynamicQueryBase<T>(ref inputData, ref baseQuery, ref totalRecordsNotFiltered, ref totalRecords, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder, true, inputDataAll.ApplyFilters); // Execute dynamic query pipeline (filter, sort, etc.)
                using(XLWorkbook workbook = new()) { // Create Excel workbook
                    IXLWorksheet worksheet = workbook.AddWorksheet(sheetName); // Add the new worksheet that will have the data
                    int numberOfColumns = inputData.Columns!.Count; // Get the number of columns
                    for(int col = 0; col < numberOfColumns; col++) { // Loop through all the columns
                        fieldName = inputData.Columns[col]; // Get the name of the column
                        worksheet.Cell(2, col + 1).Value = columnsInfo.ColumnsInfo.First(c => c.Field == fieldName).Header.ToString(); // Write the name of the column
                    }
                    int currentRow = 3; // The row we must write the data to, strating on row 3
                    WriteExportDataToWorksheet<T>(worksheet, baseQuery, inputData, columnsInfo, propertyAccessors, totalRecords, pageStack, ref currentRow, excludedColumns, inputDataAll.UseIconInBools); // Execute the logic to wirte all data to the Excel worksheet
                    ApplyExportFormatting(worksheet, reportDateFormatted, numberOfColumns, currentRow); // Apply the export format
                    using(MemoryStream memoryStream = new()) {
                        workbook.SaveAs(memoryStream);
                        memoryStream.Seek(0, SeekOrigin.Begin); // Move the pointer to the begining of the stream
                        return (true, memoryStream.ToArray(), "Excel file generated OK."); // Return the file as a byte array
                    }
                }
            } catch(Exception ex) {
                return (false, null, $"Error generating the Excel file: {ex.Message}");
            }
        }

        /// <summary>
        /// Writes paginated query results into the given Excel worksheet.
        /// Fetches data page by page from the IQueryable source, applies the column mapping,
        /// and fills each cell with the properly formatted value.
        /// </summary>
        /// <typeparam name="T">Type of the entity to export.</typeparam>
        /// <param name="worksheet">Target Excel worksheet where data will be written.</param>
        /// <param name="baseQuery">The base query used to retrieve data from the database.</param>
        /// <param name="inputData">Query configuration containing filters, columns, and pagination info.</param>
        /// <param name="columnsInfo">Metadata of the columns, including data types and headers.</param>
        /// <param name="propertyAccessors">Dictionary of compiled property accessors for dynamic value retrieval.</param>
        /// <param name="totalRecords">Total number of records that match the filters.</param>
        /// <param name="pageStack">Number of records to load per iteration.</param>
        /// <param name="currentRow">Reference to the current worksheet row index (used to continue writing).</param>
        /// <param name="excludedColumns">Optional list of column names to exclude from the select, even if they appear in the requested columns from <paramref name="inputData"/>.</param>
        /// <param name="useIconInBools">If the booleans must be shown as their underlying value or with an icon.</param>
        private static void WriteExportDataToWorksheet<T>(IXLWorksheet worksheet, IQueryable<T> baseQuery, TableQueryRequestModel inputData, TableConfigurationModel columnsInfo, Dictionary<string, Func<object, object?>> propertyAccessors, long totalRecords, byte pageStack, ref int currentRow, List<string>? excludedColumns = null, bool useIconInBools = false) {
            inputData.PageSize = pageStack; // Set how many records to process per page (chunk size)
            int currentPage = -1; // Track the current page index
            int loopStartPage = -1; // Used to detect when pagination is finished
            int numberOfColumns = inputData.Columns!.Count; // Total number of columns to write                           
            Dictionary<string, DataType> columnTypeLookup = columnsInfo.ColumnsInfo.ToDictionary(c => c.Field, c => c.DataType); // Build lookup dictionary: Field -> DataType
            while(true) { // Continue fetching pages until no more records are returned
                loopStartPage = currentPage; // Save current page index before fetching
                currentPage++; // Move to next page
                IQueryable<T> pagedItems = TableQueryProcessingService.PerformPagination(
                    baseQuery, totalRecords, ref currentPage, inputData.PageSize); // Get paged results (PerformPagination will update currentPage if there are no more pages)
                if(currentPage == loopStartPage) { // Exit loop if there are no more records to process
                    break; 
                }
                List<dynamic> dataResult = TableQueryProcessingService.GetDynamicSelect(pagedItems, inputData.Columns!, excludedColumns); // Select dynamic data limited to the requested columns
                for(int row = 0; row < dataResult.Count; row++) { // Loop through each record (row)
                    for(int col = 0; col < numberOfColumns; col++) { // Loop through each field (column)
                        string fieldName = inputData.Columns[col]; // Get field name
                        DataType dataType = columnTypeLookup[fieldName]; // Resolve the column data type
                        dynamic? cellValue = propertyAccessors[fieldName](dataResult[row]); // Get property value
                        if(row == 0) { // Apply Excel date format only once per column (on first row)
                            IXLAlignment colStyle = worksheet.Column(col + 1).Style.Alignment;
                            colStyle.Horizontal = XLAlignmentHorizontalValues.Left;
                            if(dataType == DataType.Date) {
                                worksheet.Column(col + 1).Style.NumberFormat.Format = "dd-mmm-yyyy hh:mm:ss"; // Apply the date format
                            } else if (dataType == DataType.Boolean) {
                                colStyle.Horizontal = XLAlignmentHorizontalValues.Center;
                            }
                        }
                        IXLCell cell = worksheet.Cell(currentRow, col + 1);
                        if(cellValue == null) { // If current cell value is null
                            cell.Value = ""; // Set the cell value in the Excel to empty
                        } else { // If current cell value has data, write cell value in Excel based on type
                            cell.Value = dataType switch {
                                DataType.Text => cellValue.ToString(),
                                DataType.Numeric => Convert.ToDouble(cellValue),
                                DataType.Date when cellValue is DateTime => cellValue,
                                DataType.Boolean => useIconInBools
                                    ? (Convert.ToBoolean(cellValue) ? "✔" : "✘")
                                    : Convert.ToBoolean(cellValue),
                                _ => cellValue
                            };
                            if(dataType == DataType.Boolean && useIconInBools) {
                                if(Convert.ToBoolean(cellValue)) {
                                    cell.Style.Font.FontColor = XLColor.Green;
                                } else {
                                    cell.Style.Font.FontColor = XLColor.Red;
                                }
                            }
                        }
                    }
                    currentRow++; // Move to the next worksheet row
                }
            }
        }

        /// <summary>
        /// Applies final formatting to the worksheet for export (borders, autofilter, title row, etc.).
        /// </summary>
        private static void ApplyExportFormatting(IXLWorksheet worksheet, string reportDateFormatted, int numberOfColumns, int currentRow) {
            worksheet.Range($"A1:{GetExcelColumnLetter(numberOfColumns)}1").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left; // Merge title row and set alignment
            worksheet.Cell(1, 1).Value = $"Report date: {reportDateFormatted} UTC"; // Write the format date
            currentRow = Math.Max(1, currentRow - 1);
            IXLRange range = worksheet.Range($"A1:{GetExcelColumnLetter(numberOfColumns)}{currentRow}"); // Get the range to add borders
            range.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            range.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            range.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center; // Align all cells vertically centered

            // Setup autofilter and freeze header row
            IXLRange titlesRange = worksheet.Range($"A2:{GetExcelColumnLetter(numberOfColumns)}2");
            titlesRange.SetAutoFilter();
            titlesRange.Style.Font.Bold = true;
            worksheet.Row(2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.SheetView.FreezeRows(2);

            worksheet.Columns().AdjustToContents(); // Auto-fit columns

            // Add extra width so that filter icon is not over titles
            const double extraWidth = 2.0;
            for(int c = 1; c <= numberOfColumns; c++) {
                IXLColumn column = worksheet.Column(c);
                column.Width = column.Width + extraWidth;
            }
        }

        /// <summary>
        /// Converts a 1-based column number into its corresponding Excel column letter (e.g., 1 -> "A", 27 -> "AA").
        /// </summary>
        /// <param name="columnNumber">1-based column index.</param>
        /// <returns>The Excel column letter representation for the given column number.</returns>
        private static string GetExcelColumnLetter(int columnNumber) {
            var columnLetter = new System.Text.StringBuilder(); // StringBuilder to efficiently build the result
            while(columnNumber > 0) { // Continue looping until the column number is reduced to 0
                int modulo = (columnNumber - 1) % 26; // Get remainder to determine the current letter (A-Z)
                columnLetter.Insert(0, Convert.ToChar(65 + modulo)); // Convert remainder to uppercase ASCII letter (A=65)
                columnNumber = (columnNumber - modulo) / 26; // Reduce the column number for the next iteration
            }
            return columnLetter.ToString(); // Return the resulting Excel column string (e.g., "A", "AA", "ZZ")
        }
    }
}