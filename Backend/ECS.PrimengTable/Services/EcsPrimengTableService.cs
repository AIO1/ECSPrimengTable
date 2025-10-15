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

        public static (bool, byte[]?, string) GenerateExcelReport<T>(
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

        public static async Task<List<ViewDataModel>> GetViewsAsync<TEntity, TUsername>(
            DbContext context,
            TUsername username,
            string tableKey
        ) where TEntity : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
            var svc = new TableViewService<TEntity, TUsername>(context);
            return await svc.GetViewsAsync(username, tableKey);
        }

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