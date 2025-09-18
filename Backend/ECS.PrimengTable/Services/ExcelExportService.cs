﻿using ClosedXML.Excel;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using System.Globalization;
using System.Reflection;

namespace ECS.PrimengTable.Services {
    internal class ExcelExportService {
        internal static (bool, byte[]?, string) GenerateExcelReport<T>(ExcelExportRequestModel inputDataAll, IQueryable<T> baseQuery, MethodInfo? stringDateFormatMethod = null, List<string>? defaultSortColumnName = null, List<ColumnSort>? defaultSortOrder = null, string sheetName = "MAIN", byte pageStack = 250) {
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
                };
                DateTime reportDate = DateTime.UtcNow;
                string reportDateFormatted = reportDate.ToString("dd-MMM-yyyy hh:mm:ss", CultureInfo.GetCultureInfo("en-US"));
                TableConfigurationModel columnsInfo = EcsPrimengTableService.GetTableConfiguration<T>(convertFieldToLower: false); // Get columns information for the table

                if(inputDataAll.AllColumns) { // If we have to export all the columns
                    inputData.Columns = columnsInfo.ColumnsInfo
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
                    );
                long totalRecordsNotFiltered = 0; // All available records
                long totalRecords = 0; // Number of records after applying filters
                string fieldName;
                TableQueryProcessingService.GetDynamicQueryBase<T>(ref inputData, ref baseQuery, ref totalRecordsNotFiltered, ref totalRecords, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder, inputDataAll.ApplySorts, inputDataAll.ApplyFilters);
                using(XLWorkbook workbook = new XLWorkbook()) {
                    IXLWorksheet worksheet = workbook.AddWorksheet(sheetName); // Add the new worksheet that will have the data
                    int numberOfColumns = inputData.Columns!.Count;
                    for(int col = 0; col < numberOfColumns; col++) {
                        fieldName = inputData.Columns[col];
                        worksheet.Cell(2, col + 1).Value = columnsInfo.ColumnsInfo.First(c => c.Field == fieldName).Header.ToString();
                    }
                    inputData.PageSize = pageStack; // We will change the stack of records to get per page into memory before writing to Excel
                    int currentPage = -1; // To count the page we are at in the while loop
                    int loopStartPage = -1; // Used to determine when we have to get out of the loop
                    int currentRow = 3; // The row we must write the data to
                    while(true) {
                        loopStartPage = currentPage;
                        currentPage++;
                        IQueryable<T> pagedItems = TableQueryProcessingService.PerformPagination(baseQuery, totalRecords, ref currentPage, inputData.PageSize); // Perform the pagination
                        if(currentPage == loopStartPage) { // If there are no more pages left exit the for loop
                            break;
                        }
                        List<dynamic> dataResult = TableQueryProcessingService.GetDynamicSelect(pagedItems, inputData.Columns!); // Limit the columns that are going to be selected
                        for(int row = 0; row < dataResult.Count; row++) { // Loop through each row
                            for(int col = 0; col < numberOfColumns; col++) { // Loop through each column
                                fieldName = inputData.Columns[col];
                                dynamic? cellValue = propertyAccessors[fieldName](dataResult[row]);
                                DataType dataType = columnsInfo.ColumnsInfo.First(c => c.Field == fieldName).DataType;
                                if(row == 0 && dataType == DataType.Date) {
                                    worksheet.Column(col + 1).Style.NumberFormat.Format = "dd-mmm-yyyy hh:mm:ss";
                                }
                                if(cellValue == null) {
                                    worksheet.Cell(currentRow, col + 1).Value = "";
                                } else {
                                    worksheet.Cell(currentRow, col + 1).Value = dataType switch {
                                        DataType.Text => cellValue.ToString(),
                                        DataType.Numeric => Convert.ToDouble(cellValue),
                                        DataType.Date when cellValue is DateTime => cellValue,
                                        DataType.Boolean => Convert.ToBoolean(cellValue),
                                        _ => cellValue
                                    };
                                }
                            }
                            currentRow++; // Move to the next row to write
                        }
                    }
                    worksheet.Range($"A1:{GetExcelColumnLetter(numberOfColumns)}1").Merge().Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                    worksheet.Cell(1, 1).Value = $"Report date: {reportDateFormatted}";
                    currentRow = Math.Max(1, currentRow - 1);
                    IXLRange range = worksheet.Range($"A1:{GetExcelColumnLetter(numberOfColumns)}{currentRow}"); // Get the range to add borders
                    range.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    range.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                    worksheet.Range($"A2:{GetExcelColumnLetter(numberOfColumns)}2").SetAutoFilter(); // Add autofilter
                    worksheet.Row(2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; // Center horizontally the title
                    worksheet.SheetView.FreezeRows(2);
                    worksheet.Columns().AdjustToContents();
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
        private static string GetExcelColumnLetter(int columnNumber) {
            var columnLetter = new System.Text.StringBuilder();
            while(columnNumber > 0) {
                int modulo = (columnNumber - 1) % 26;
                columnLetter.Insert(0, Convert.ToChar(65 + modulo));
                columnNumber = (columnNumber - modulo) / 26;
            }
            return columnLetter.ToString();
        }
    }
}