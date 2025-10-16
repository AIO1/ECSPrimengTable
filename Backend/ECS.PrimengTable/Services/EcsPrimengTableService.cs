using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Interfaces;
using ECS.PrimengTable.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ECS.PrimengTable.Services {
    /// <summary>
    /// Main public entry point of the `ECS.PrimengTable` library.
    /// This class exposes all methods intended for external consumption, including table configuration, dynamic queries, user views, and Excel export.
    /// </summary>
    public static class EcsPrimengTableService {

        /// <summary>
        /// Validates the provided pagination and column configuration for a table.
        /// Ensures that the specified number of items per page and visible columns
        /// match the allowed configuration defined in the system.
        /// </summary>
        /// <param name="itemsPerPage">Number of items to display per page.</param>
        /// <param name="columns">List of column names currently selected or displayed. Can be null.</param>
        /// <param name="allowedItemsPerPage">Optional array of allowed items-per-page values for validation.</param>
        /// <returns>
        /// <c>true</c> if the provided configuration is valid; otherwise, <c>false</c>.
        /// </returns>
        public static bool ValidateItemsPerPageAndCols(
            byte itemsPerPage,
            List<string>? columns,
            int[]? allowedItemsPerPage = null
        ) {
            return TableConfigurationService.ValidateItemsPerPageAndCols(itemsPerPage, columns, allowedItemsPerPage);
        }

        /// <summary>
        /// Generates a <see cref="TableConfigurationModel"/> based on the metadata of the specified type <typeparamref name="T"/>.
        /// Inspects all properties of the given type and extracts column configuration using <see cref="ColumnAttributes"/>.
        /// </summary>
        /// <remarks>
        /// Properties of <typeparamref name="T"/> that lack <see cref="ColumnAttributes"/> will be skipped,
        /// and a warning message will be printed to the console.  
        /// Columns marked with <c>SendColumnAttributes = false</c> will also be ignored.
        /// </remarks>
        /// <typeparam name="T">The class type representing the data model for which to generate the table configuration.</typeparam>
        /// <param name="allowedItemsPerPage"> Optional list of allowed pagination sizes. Defaults to <see cref="TableConfigurationDefaults.AllowedItemsPerPage"/>.</param>
        /// <param name="dateFormat"> Optional date format string used for display. Defaults to <see cref="TableConfigurationDefaults.DateFormat"/> </param>
        /// <param name="dateTimezone"> Optional timezone string used for date formatting. Defaults to <see cref="TableConfigurationDefaults.DateTimezone"/>. </param>
        /// <param name="dateCulture"> Optional culture string for date localization. Defaults to <see cref="TableConfigurationDefaults.DateCulture"/>. </param>
        /// <param name="maxViews"> Optional maximum number of views allowed for a table. Defaults to <see cref="TableConfigurationDefaults.MaxViews"/>. </param>
        /// <param name="convertFieldToLower"> Indicates whether the first letter of each property name should be converted to lowercase in the output model. Defaults to <c>true</c>. </param>
        /// <returns>
        /// A <see cref="TableConfigurationModel"/> containing the table metadata derived from the annotated properties of the specified type.
        /// </returns>
        public static TableConfigurationModel GetTableConfiguration<T>(
            int[]? allowedItemsPerPage = null,
            string? dateFormat = null,
            string? dateTimezone = null,
            string? dateCulture = null,
            byte? maxViews = null,
            bool convertFieldToLower = true
        ) {
            return TableConfigurationService.GetTableConfiguration<T>(allowedItemsPerPage, dateFormat, dateTimezone, dateCulture, maxViews, convertFieldToLower);
        }

        /// <summary>
        /// Executes a full dynamic query pipeline on the provided base query, including filtering, sorting, pagination,
        /// and column projection, returning a paged and structured table response.
        /// </summary>
        /// <remarks>
        /// This method orchestrates the query building process by delegating
        /// to helper methods such as <c>GetDynamicQueryBase</c>, <c>PerformPagination</c>, and <c>GetDynamicSelect</c>.
        /// </remarks>
        /// <typeparam name="T">The entity type being queried.</typeparam>
        /// <param name="inputData"> The input model containing filters, sorting, and pagination parameters.</param>
        /// <param name="baseQuery"> The base <see cref="IQueryable{T}"/> to apply the dynamic operations on.</param>
        /// <param name="stringDateFormatMethod"> Optional reflection method used to apply a specific date formatting function to string date columns.</param>
        /// <param name="defaultSortColumnName"> Optional list of column names to use for sorting when no explicit sort is provided in <paramref name="inputData"/>.</param>
        /// <param name="defaultSortOrder"> Optional list of sort directions (<see cref="ColumnSort"/>) matching the default columns.</param>
        /// <returns>
        /// A <see cref="TablePagedResponseModel"/> containing the filtered, sorted, paginated, and projected data,
        /// along with total record counts for both filtered and unfiltered datasets and the current page that we are on.
        /// </returns>
        public static TablePagedResponseModel PerformDynamicQuery<T>(
            TableQueryRequestModel inputData,
            IQueryable<T> baseQuery,
            MethodInfo? stringDateFormatMethod = null,
            List<string>? defaultSortColumnName = null,
            List<ColumnSort>? defaultSortOrder = null
        ) {
            return TableQueryProcessingService.PerformDynamicQuery<T>(inputData, baseQuery, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder);
        }

        /// <summary>
        /// Generates an Excel report from the provided query and export configuration.
        /// The method executes the dynamic query pipeline (filters, sorting, pagination), selects the requested columns,
        /// and writes the results into an Excel workbook which is returned as a byte array.
        /// </summary>
        /// <remarks>
        /// This method acts as a high-level entry point for Excel export operations.  
        /// It delegates the core logic to <c>ExcelExportService.GenerateExcelReport</c>, which handles query execution, pagination, and Excel file generation.
        /// </remarks>
        /// <typeparam name="T">The entity type being queried and exported.</typeparam>
        /// <param name="inputData">Export request model containing pagination, sorting, filtering and column selection options.</param>
        /// <param name="baseQuery">The base <see cref="IQueryable{T}"/> to apply dynamic operations on.</param>
        /// <param name="stringDateFormatMethod">Optional reflection method used to apply a specific date formatting function to string date columns.</param>
        /// <param name="defaultSortColumnName">Optional list of column names to use for sorting when no explicit sort is provided in the input.</param>
        /// <param name="defaultSortOrder">Optional list of sort directions (<see cref="ColumnSort"/>) matching the default columns.</param>
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
        public static (bool success, byte[]? reportFile, string statusMessage) GenerateExcelReport<T>(
            ExcelExportRequestModel inputData,
            IQueryable<T> baseQuery,
            MethodInfo? stringDateFormatMethod = null,
            List<string>? defaultSortColumnName = null,
            List<ColumnSort>? defaultSortOrder = null,
            string sheetName = "MAIN",
            byte pageStack = 250
        ) {
            return ExcelExportService.GenerateExcelReport<T>(inputData, baseQuery, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder, sheetName, pageStack);
        }

        /// <summary>
        /// Retrieves all saved views for the specified user and table.
        /// </summary>
        /// <typeparam name="TEntity">The entity type implementing <see cref="ITableViewEntity{TUsername}"/>.</typeparam>
        /// <typeparam name="TUsername">The username type used to identify the user.</typeparam>
        /// <param name="context">The <see cref="DbContext"/> used to access the database.</param>
        /// <param name="username">The username whose views are being retrieved.</param>
        /// <param name="tableKey">The table key identifying the table configuration.</param>
        /// <returns>A list of <see cref="ViewDataModel"/> objects representing the saved views.</returns>
        public static async Task<List<ViewDataModel>> GetViewsAsync<TEntity, TUsername>(
            DbContext context,
            TUsername username,
            string tableKey
        ) where TEntity : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
            var svc = new TableViewService<TEntity, TUsername>(context);
            return await svc.GetViewsAsync(username, tableKey);
        }

        /// <summary>
        /// Saves or updates the provided views for the specified user and table. Existing views are updated, new ones are added, and views not included in the provided list are deleted.
        /// </summary>
        /// <remarks>
        /// The operation is transactional. If any exception occurs during processing, all pending changes are rolled back to preserve data integrity.
        /// </remarks>
        /// <typeparam name="TEntity">The entity type implementing <see cref="ITableViewEntity{TUsername}"/>.</typeparam>
        /// <typeparam name="TUsername">The username type used to identify the user.</typeparam>
        /// <param name="context">The <see cref="DbContext"/> used to access the database.</param>
        /// <param name="username">The username for which the views will be saved.</param>
        /// <param name="tableKey">The table key identifying the table configuration.</param>
        /// <param name="views">A list of <see cref="ViewDataModel"/> objects to be saved or updated.</param>
        public static async Task SaveViewsAsync<TEntity, TUsername>(
            DbContext context,
            TUsername username,
            string tableKey,
            List<ViewDataModel> views
        ) where TEntity : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
            var svc = new TableViewService<TEntity, TUsername>(context);
            await svc.SaveViewsAsync(username, tableKey, views);
        }
    }
}