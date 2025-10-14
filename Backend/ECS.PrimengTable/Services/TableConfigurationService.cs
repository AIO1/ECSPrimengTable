using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Models;
using System.Reflection;

namespace ECS.PrimengTable.Services;

/// <summary>
/// Provides internal logic for generating and validating table configuration models.
/// This service handles column metadata extraction via reflection and ensures consistency
/// in pagination and column visibility rules across the library.
/// </summary>
/// <remarks>
/// This class is intended for internal use only and should not be accessed directly.
/// External consumers should use <see cref="EcsPrimengTableService"/> instead.
/// </remarks>
internal static class TableConfigurationService {

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
    internal static TableConfigurationModel GetTableConfiguration<T>(int[]? allowedItemsPerPage = null, string? dateFormat = null, string? dateTimezone = null, string? dateCulture = null, byte? maxViews = null, bool convertFieldToLower = true) {
        allowedItemsPerPage ??= TableConfigurationDefaults.AllowedItemsPerPage;
        dateFormat ??= TableConfigurationDefaults.DateFormat;
        dateTimezone ??= TableConfigurationDefaults.DateTimezone;
        dateCulture ??= TableConfigurationDefaults.DateCulture;
        maxViews ??= TableConfigurationDefaults.MaxViews;
        List <ColumnMetadataModel> columnsInfo = []; // Prepare the list to be returned
        PropertyInfo[] properties = typeof(T).GetProperties(); // Get the properties of the provided class
        foreach(var property in properties) { // Loop through each property of the class
            ColumnAttributes? colAtt = property.GetCustomAttribute<ColumnAttributes>(); // Try to get the column attributes for the current property
            if(colAtt == null) { // If there are no column properties
                Console.WriteLine($"[WARN] The column '{property.Name}' is missing its ColumnAttributes. Skipping.");
                continue;
            }
            if(!colAtt.SendColumnAttributes) { // If the column doesn't need to be sent
                continue;
            }
            string propertyName = convertFieldToLower
                   ? char.ToLower(property.Name[0]) + property.Name.Substring(1)
                   : property.Name; // Get the property name with the first letter to lower
            columnsInfo.Add(new ColumnMetadataModel {
                Field = propertyName,
                Header = colAtt.Header,
                DataType = colAtt.DataType,
                DataAlignHorizontal = colAtt.DataAlignHorizontal,
                DataAlignHorizontalAllowUserEdit = colAtt.DataAlignHorizontalAllowUserEdit,
                DataAlignVertical = colAtt.DataAlignVertical,
                DataAlignVerticalAllowUserEdit = colAtt.DataAlignVerticalAllowUserEdit,
                CanBeHidden = colAtt.CanBeHidden,
                StartHidden = colAtt.StartHidden,
                CanBeResized = colAtt.CanBeResized,
                CanBeReordered = colAtt.CanBeReordered,
                CanBeSorted = colAtt.CanBeSorted,
                CanBeFiltered = colAtt.CanBeFiltered,
                FilterPredefinedValuesName = colAtt.FilterPredefinedValuesName,
                CanBeGlobalFiltered = colAtt.CanBeGlobalFiltered,
                ColumnDescription = colAtt.ColumnDescription,
                DataTooltipShow = colAtt.DataTooltipShow,
                DataTooltipCustomColumnSource = string.IsNullOrEmpty(colAtt.DataTooltipCustomColumnSource)
                    ? colAtt.DataTooltipCustomColumnSource
                    : char.ToLower(colAtt.DataTooltipCustomColumnSource[0]) + colAtt.DataTooltipCustomColumnSource.Substring(1),
                FrozenColumnAlign = colAtt.FrozenColumnAlign,
                CellOverflowBehaviour = colAtt.CellOverflowBehaviour,
                CellOverflowBehaviourAllowUserEdit = colAtt.CellOverflowBehaviourAllowUserEdit,
                InitialWidth = colAtt.InitialWidth
            });
        }
        return new TableConfigurationModel {
            ColumnsInfo = columnsInfo,
            AllowedItemsPerPage = allowedItemsPerPage,
            DateFormat = dateFormat,
            DateTimezone = dateTimezone,
            DateCulture = dateCulture,
            MaxViews = (byte)maxViews
        };
    }

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
    internal static bool ValidateItemsPerPageAndCols(byte itemsPerPage, List<string>? columns, int[]? allowedItemsPerPage = null) {
        allowedItemsPerPage ??= TableConfigurationDefaults.AllowedItemsPerPage; // If no allowedItemsPerPage was given get from table configurations default
        if(!allowedItemsPerPage.Contains(itemsPerPage)) { // If the items per page is not within the allowed items per page array values
            return false;
        }
        if(columns == null || columns.Count == 0) { // If no columns have been returned for filtering
            return false;
        }
        return true;
    }
}