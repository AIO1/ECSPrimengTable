using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using LinqKit;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;

namespace ECS.PrimengTable.Services {

    /// <summary>
    /// Provides static helper methods for dynamically building LINQ predicate expressions
    /// used to filter query results based on user-provided table filters and match modes.
    /// </summary>
    internal class QueryPredicateService {

        /// <summary>
        /// Builds and combines a filter predicate for a given property based on the provided value and match mode.
        /// </summary>
        /// <remarks>
        /// This method generates a new predicate for the specified column and merges it into the 
        /// current combined predicate using the specified logical operator.
        /// </remarks>
        /// <typeparam name="T">The entity type being filtered.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="attribute">Metadata describing the column (data type, formatting, etc.).</param>
        /// <param name="val">The value to compare against.</param>
        /// <param name="matchMode">The comparison mode (e.g. "equals", "contains", "startsWith").</param>
        /// <param name="andPredicateOperator">If true, combines with AND; otherwise, combines with OR.</param>
        /// <param name="combinedPredicate">The cumulative predicate expression being built.</param>
        /// <param name="stringDateFormatMethod">Optional method used for string date conversion, if applicable.</param>
        internal static void FilterPredicateBuilder<T>(PropertyInfo property, ColumnAttributes attribute, dynamic val, string matchMode, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate, MethodInfo? stringDateFormatMethod = null) {
            dynamic filterPredicate = GetColumnFilterPredicate<T>(property.Name, val, attribute.DataType, matchMode, stringDateFormatMethod); // Get the filter predicate for the column
            if(filterPredicate != null) { // If a valid filter predicate is obtained, combine it with the existing predicate using AND or OR
                if(combinedPredicate.Body.NodeType == ExpressionType.Constant) { // If the combined predicate is initially a constant expression, replace it with the filter predicate
                    combinedPredicate = filterPredicate;
                } else { // If the combined predicate already contains conditions, combine it with the new filter predicate using AND or OR
                    combinedPredicate = andPredicateOperator ? combinedPredicate.And(filterPredicate) : combinedPredicate.Or(filterPredicate);
                }
            }
        }

        /// <summary>
        /// Builds and combines multiple "IN" filter predicates for a given property.
        /// </summary>
        /// <remarks>
        /// Deserializes the provided JSON array and creates an equality predicate for each element,
        /// combining them into the main predicate using the specified logical operator.
        /// </remarks>
        /// <typeparam name="T">The entity type being filtered.</typeparam>
        /// <param name="value">The filter model containing the array of values to match.</param>
        /// <param name="property">The property to filter on.</param>
        /// <param name="attribute">Metadata describing the column (data type, formatting, etc.).</param>
        /// <param name="andPredicateOperator">If true, combines with AND; otherwise, combines with OR.</param>
        /// <param name="combinedPredicate">The cumulative predicate expression being built.</param>
        /// <param name="stringDateFormatMethod">Optional method used for string date conversion, if applicable.</param>
        internal static void FilterPredicateInClauseBuilder<T>(ColumnFilterModel value, PropertyInfo property, ColumnAttributes attribute, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate, MethodInfo? stringDateFormatMethod = null) {
            if(value.Value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array) {
                List<object> items = JsonSerializer.Deserialize<List<object>>(jsonElement.GetRawText())!;
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "equals", andPredicateOperator, ref combinedPredicate, stringDateFormatMethod);
                }
            } 
        }

        /// <summary>
        /// Builds and combines multiple "NOT IN" filter predicates for a given property.
        /// </summary>
        /// <remarks>
        /// Deserializes the provided JSON array and creates a "not equals" predicate for each element,
        /// combining them into the main predicate using the specified logical operator.
        /// </remarks>
        /// <typeparam name="T">The entity type being filtered.</typeparam>
        /// <param name="value">The filter model containing the array of values to exclude.</param>
        /// <param name="property">The property to filter on.</param>
        /// <param name="attribute">Metadata describing the column (data type, formatting, etc.).</param>
        /// <param name="andPredicateOperator">If true, combines with AND; otherwise, combines with OR.</param>
        /// <param name="combinedPredicate">The cumulative predicate expression being built.</param>
        /// <param name="stringDateFormatMethod">Optional method used for string date conversion, if applicable.</param>
        internal static void FilterPredicateNotInClauseBuilder<T>(ColumnFilterModel value, PropertyInfo property, ColumnAttributes attribute, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate, MethodInfo? stringDateFormatMethod = null) {
            if(value.Value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array) {
                List<object> items = JsonSerializer.Deserialize<List<object>>(jsonElement.GetRawText())!;
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "notEquals", andPredicateOperator, ref combinedPredicate, stringDateFormatMethod);
                }
            } 
        }

        /// <summary>
        /// Gets a global filter predicate for the specified property name, filter value, and filter data type.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="propertyName">The name of the property to filter on.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="filterDataType">The data type of the filter (text, numeric, date, boolean).</param>
        /// <returns>
        /// An expression representing the filter predicate for the specified property and filter value.
        /// Returns null if the data type is not supported.
        /// </returns>
        /// <exception cref="ArgumentException">Thrown when the filterDataType is not supported.</exception>
        internal static Expression<Func<T, bool>>? GetGlobalFilterPredicate<T>(string propertyName, string filterValue, DataType filterDataType, string dateFormat, string dateTimezone, string dateCulture, MethodInfo? stringDateFormatMethod = null) {
            Expression<Func<T, bool>>? predicate = null; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x"); // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName); // Get the specific property of the entity using the provided property name
            if(filterDataType == DataType.Text || filterDataType == DataType.Numeric || (filterDataType == DataType.Date && stringDateFormatMethod != null) || filterDataType == DataType.List) { // Check the filter data type, if it's text, numeric, or date (and we have the stringDateFormatMethod), call method to create a filter predicate
                predicate = PredicateBuilderService.CreateTextFilterPredicate<T>(property, filterValue, stringDateFormatMethod, "contains", dateFormat, dateTimezone, dateCulture);
            }
            return predicate; // Return the predicate (may be null if the data type is not supported)
        }

        /// <summary>
        /// Generates a predicate for filtering entities of type T based on the specified criteria.
        /// </summary>
        /// <typeparam name="T">The type of entities to filter.</typeparam>
        /// <param name="propertyName">The name of the property to filter on.</param>
        /// <param name="filterValue">The value to filter by.</param>
        /// <param name="filterDataType">The data type of the property being filtered.</param>
        /// <param name="matchMode">The matching mode for the filter.</param>
        /// <returns>An Expression<Func<T, bool>> predicate for filtering entities.</returns>
        /// <exception cref="ArgumentException">Thrown when the filterDataType is not supported.</exception>
        private static Expression<Func<T, bool>>? GetColumnFilterPredicate<T>(string propertyName, dynamic filterValue, DataType filterDataType, string matchMode, MethodInfo stringDateFormatMethod) {
            Expression<Func<T, bool>>? predicate; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");  // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName);  // Get the specific property of the entity using the provided property name
            predicate = filterDataType switch {
                DataType.Text => PredicateBuilderService.CreateTextFilterPredicate<T>(property, filterValue.ToString(), stringDateFormatMethod, matchMode),
                DataType.Date => PredicateBuilderService.CreateDateFilterPredicate<T>(property, parameter, filterValue, matchMode),
                DataType.Numeric => PredicateBuilderService.CreateNumericFilterPredicate<T>(property, parameter, filterValue, matchMode),
                DataType.Boolean => PredicateBuilderService.CreateBoolFilterPredicate<T>(property, parameter, filterValue),
                DataType.List => PredicateBuilderService.CreateListFilterPredicate<T>(property,filterValue),
                _ => throw new ArgumentException("Invalid filterDataType value", nameof(filterDataType)),
            };
            return predicate;
        }
    }
}