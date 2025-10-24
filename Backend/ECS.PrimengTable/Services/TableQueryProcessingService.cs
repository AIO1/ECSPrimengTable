using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using System.Linq.Dynamic.Core;
using System.Reflection;

namespace ECS.PrimengTable.Services {

    /// <summary>
    /// Provides internal logic for processing dynamic table queries, including filtering,
    /// sorting, pagination, and dynamic column selection.
    /// </summary>
    /// <remarks>
    /// This class is intended for internal use only and should not be accessed directly.
    /// All query operations should be performed through the public <see cref="EcsPrimengTableService"/>.
    /// </remarks>
    internal class TableQueryProcessingService {

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
        /// <param name="excludedColumns">Optional list of column names to exclude from the select, even if they appear in the requested columns from <paramref name="inputData"/>.</param>
        /// <returns>
        /// A <see cref="TablePagedResponseModel"/> containing the filtered, sorted, paginated, and projected data,
        /// along with total record counts for both filtered and unfiltered datasets and the current page that we are on.
        /// </returns>
        internal static TablePagedResponseModel PerformDynamicQuery<T>(TableQueryRequestModel inputData, IQueryable<T> baseQuery, MethodInfo? stringDateFormatMethod = null, List<string>? defaultSortColumnName = null, List<ColumnSort>? defaultSortOrder = null, List<string>? excludedColumns = null) {
            long totalRecordsNotFiltered = 0; // Used to track the number of all available records
            long totalRecords = 0; // Used to track the number of all available records after filters are applied
            GetDynamicQueryBase<T>(ref inputData, ref baseQuery, ref totalRecordsNotFiltered, ref totalRecords, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder);
            int currentPage = inputData.Page; // Get the current page that the user is viewing
            IQueryable<T> pagedItems = PerformPagination(baseQuery, totalRecords, ref currentPage, inputData.PageSize); // Perform the pagination
            List<dynamic> dataResult = GetDynamicSelect(pagedItems, inputData.Columns!, excludedColumns); // Limit the columns that are going to be selected
            return new TablePagedResponseModel {
                Page = currentPage,
                TotalRecords = totalRecords,
                TotalRecordsNotFiltered = totalRecordsNotFiltered,
                Data = dataResult
            };
        }

        /// <summary>
        /// Builds and prepares the base dynamic query by normalizing column names, applying sorting and filters,
        /// and calculating total record counts before and after filters are applied.
        /// </summary>
        /// <remarks>
        /// This method modifies <paramref name="inputData"/> and <paramref name="baseQuery"/> by reference,
        /// ensuring the query is properly prepared for later pagination and projection steps.
        /// It internally delegates to <c>ApplySorting</c> and <c>QueryFilterService</c> methods
        /// to apply dynamic ordering and filtering logic.
        /// </remarks>
        /// <typeparam name="T">The entity type being queried.</typeparam>
        /// <param name="inputData"> The input model containing column definitions, filters, sorting, and global filter parameters. This object is updated in place to ensure consistent column casing.</param>
        /// <param name="baseQuery"> The base <see cref="IQueryable{T}"/> to dynamically modify. It is updated with sorting and filters.</param>
        /// <param name="totalRecordsNotFiltered"> Reference variable that stores the total number of records before filters are applied.</param>
        /// <param name="totalRecords"> Reference variable that stores the total number of records after filters are applied.</param>
        /// <param name="stringDateFormatMethod"> Optional reflection method used to format date columns represented as strings during filtering.</param>
        /// <param name="defaultSortColumnName"> Optional list of column names to apply as a default sort when none is provided in <paramref name="inputData"/>.</param>
        /// <param name="defaultSortOrder"> Optional list of sort directions (<see cref="ColumnSort"/>) corresponding to the default columns.</param>
        /// <param name="performSort"> Indicates whether sorting should be applied. Defaults to <c>true</c>.</param>
        /// <param name="performFilters">Indicates whether filters should be applied. Defaults to <c>true</c>.</param>
        internal static void GetDynamicQueryBase<T>(ref TableQueryRequestModel inputData, ref IQueryable<T> baseQuery, ref long totalRecordsNotFiltered, ref long totalRecords, MethodInfo? stringDateFormatMethod = null, List<string>? defaultSortColumnName = null, List<ColumnSort>? defaultSortOrder = null, bool performSort = true, bool performFilters = true) {
            if(inputData.Columns != null) { // Check if there are any columns defined in the input
                for(int i = 0; i < inputData.Columns.Count; i++) { // Iterate over each column name
                    string column = inputData.Columns[i]; // Get the current column name
                    inputData.Columns[i] = char.ToUpper(column[0]) + column.Substring(1); // Capitalize the first letter to match entity property casing
                }
            }
            if(inputData.Sort != null) { // Check if there is sorting information
                foreach(var sortItem in inputData.Sort) { // Iterate through each sorting rule
                    sortItem.Field = char.ToUpper(sortItem.Field[0]) + sortItem.Field.Substring(1); // Capitalize first letter of sort field for consistency
                }
            }
            var updatedFilter = new Dictionary<string, List<ColumnFilterModel>>(); // Create a new dictionary for normalized filter keys
            foreach(var entry in inputData.Filter) { // Iterate over all filter entries
                string updatedKey = char.ToUpper(entry.Key[0]) + entry.Key.Substring(1); // Capitalize the first letter of each filter key
                updatedFilter[updatedKey] = entry.Value; // Assign the existing filter list to the normalized key
            }
            inputData.Filter = updatedFilter; // Replace the old filter dictionary with the normalized version
            if(performSort) { // Check if sorting should be performed
                baseQuery = ApplySorting(baseQuery, inputData.Sort, defaultSortColumnName, defaultSortOrder); // Apply sorting to the query using dynamic LINQ
            }
            totalRecordsNotFiltered = baseQuery.Count(); // Count total records before applying any filters
            if(performFilters) { // Check if filters should be applied
                baseQuery = QueryFilterService.ApplyGlobalFilter(baseQuery, inputData.GlobalFilter, inputData.Columns!, inputData.DateFormat, inputData.DateTimezone, inputData.DateCulture, stringDateFormatMethod); // Apply a global search filter (searches across all columns)
                baseQuery = QueryFilterService.ApplyColumnFilters(baseQuery, inputData.Filter, inputData.Columns!, stringDateFormatMethod); // Apply individual column filters
            }
            totalRecords = baseQuery.Count(); // Count total records again after filters have been applied
        }

        /// <summary>
        /// Applies sorting to the provided query based on either explicit sort models or default sorting settings.
        /// </summary>
        /// <remarks>
        /// If <paramref name="sortModels"/> is provided and contains items, the query is ordered based on those rules.
        /// Otherwise, the <paramref name="defaultSortColumnName"/> and <paramref name="defaultSortOrder"/> lists are used.
        /// Sorting is applied dynamically using the System.Linq.Dynamic.Core library.
        /// </remarks>
        /// <typeparam name="T">The type of items in the query.</typeparam>
        /// <param name="query">The queryable collection to apply sorting on.</param>
        /// <param name="sortModels">Optional list of explicit sort models containing fields and directions.</param>
        /// <param name="defaultSortColumnName">Optional list of column names to use for default sorting if no explicit sorting is provided.</param>
        /// <param name="defaultSortOrder">Optional list of sort directions (<see cref="ColumnSort"/>) corresponding to <paramref name="defaultSortColumnName"/>.</param>
        /// <returns>An <see cref="IQueryable{T}"/> with the applied sorting.</returns>
        internal static IQueryable<T> ApplySorting<T>(IQueryable<T> query, List<ColumnSortModel>? sortModels, List<string>? defaultSortColumnName = null, List<ColumnSort>? defaultSortOrder = null) {
            if(sortModels != null && sortModels.Count != 0) { // Check if explicit sorting models are provided
                string orderByExpression = string.Join(",", sortModels.Select(s => $"{s.Field} {(s.Order == 1 ? "ascending" : "descending")}")); // Build a dynamic order by string based on sort models
                query = query.OrderBy(orderByExpression); // Apply the dynamic sorting to the query
            } else if(defaultSortColumnName != null && defaultSortColumnName.Count > 0) { // If no explicit sort is provided, use default sorting
                var orderByExpressions = new List<string>(); // Prepare a list of order by expressions
                for(int i = 0; i < defaultSortColumnName.Count; i++) { // Iterate over each default sort column
                    string direction = (defaultSortOrder != null && i < defaultSortOrder.Count && (int)defaultSortOrder[i] == 1) ? "ascending" : "descending"; // Determine sort direction
                    orderByExpressions.Add($"{defaultSortColumnName[i]} {direction}"); // Add the column and direction to the expressions list
                }
                string finalOrderByExpression = string.Join(",", orderByExpressions); // Combine all expressions into a single comma-separated string
                query = query.OrderBy(finalOrderByExpression); // Apply the default dynamic sorting to the query
            }
            return query; // Return the query after sorting has been applied
        }

        /// <summary>
        /// Performs pagination on a given query, returning only the items corresponding to the specified page and size.
        /// </summary>
        /// <remarks>
        /// This method calculates the total number of pages based on the total record count and items per page,
        /// ensures that the requested page is within valid bounds, and then applies pagination using LINQ's
        /// <c>Skip</c> and <c>Take</c> methods.
        /// </remarks>
        /// <typeparam name="T">The entity type of the items in the query.</typeparam>
        /// <param name="itemList">The base query containing all items to be paginated.</param>
        /// <param name="totalRecords">The total number of records in the query before pagination.</param>
        /// <param name="page">The current page index (zero-based). This parameter is updated if it falls outside the valid range.</param>
        /// <param name="itemsPerPage">The number of records to display per page.</param>
        /// <returns>
        /// A new <see cref="IQueryable{T}"/> containing only the items of the requested page.
        /// </returns>
        internal static IQueryable<T> PerformPagination<T>(IQueryable<T> itemList, long totalRecords, ref int page, byte itemsPerPage) {
            int totalPages = (int)Math.Ceiling((double)totalRecords / itemsPerPage); // Calculate the total number of pages by dividing total records by items per page and rounding up
            page = Math.Max(0, Math.Min(page, totalPages)); // Ensure the current page value is within valid range (between 0 and totalPages)
            int startIndex = page * itemsPerPage; // Calculate the index of the first record of the requested page
            IQueryable<T> pagedItems = itemList.Skip(startIndex).Take(itemsPerPage).AsQueryable(); // Retrieve only the items for the current page using Skip and Take LINQ methods
            return pagedItems; // Return the paginated query result as an IQueryable
        }

        /// <summary>
        /// Builds and executes a dynamic SELECT query based on the specified list of column names.
        /// </summary>
        /// <remarks>
        /// This method uses reflection to retrieve the properties of the type <typeparamref name="T"/>,
        /// filters them based on the provided column list and any properties marked with
        /// <see cref="ColumnAttributes"/> that should not be sent, and then constructs a dynamic query string
        /// to select only those columns.
        /// </remarks>
        /// <typeparam name="T">The entity type of the items in the query.</typeparam>
        /// <param name="query">The base query to apply the dynamic select on.</param>
        /// <param name="columns">The list of column names that should be included in the select.</param>
        /// <param name="excludedColumns">Optional list of column names to exclude from the select, even if they appear in the `columns` list.</param>
        /// <returns>
        /// A list of dynamic objects containing only the selected columns.
        /// </returns>
        internal static List<dynamic> GetDynamicSelect<T>(IQueryable<T> query, List<string> columns, List<string>? excludedColumns = null) {
            var excluded = excludedColumns != null
                ? new HashSet<string>(excludedColumns, StringComparer.OrdinalIgnoreCase)
                : []; // Prepare hash set for excluded columns (case-insensitive)
            PropertyInfo[] properties = typeof(T).GetProperties(); // Get all properties of the entity type T using reflection
            List<string> additionalColumns = [.. properties // Initialize a list of columns that should always be included even if not requested
                .Where(p => p.GetCustomAttribute<ColumnAttributes>()?.SendColumnAttributes == false) // Filter properties that have the custom attribute ColumnAttributes with SendColumnAttributes = false
                .Select(p => p.Name)]; // Select only the names of those filtered properties
            IEnumerable<PropertyInfo> selectedProperties = properties
                .Where(p => (columns.Contains(p.Name) || additionalColumns.Contains(p.Name)) && !excluded.Contains(p.Name)); // Include requested columns and always-include columns, but skip any excluded ones
            string select = string.Join(", ", selectedProperties.Select(p => p.Name)); // Build a comma-separated string with the property names to use in the dynamic query
            return query.Select($"new ({select})").ToDynamicList(); // Execute the dynamic query using System.Linq.Dynamic.Core and return the resulting list
        }
    }
}