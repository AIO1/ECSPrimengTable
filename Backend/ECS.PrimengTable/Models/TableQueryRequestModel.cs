namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a table query request, including pagination, sorting, filtering, and optional column selection.
    /// </summary>
    public class TableQueryRequestModel {

        /// <summary>
        /// The page number to retrieve.
        /// </summary>
        public required int Page { get; set; }

        /// <summary>
        /// Number of items per page.
        /// </summary>
        public required byte PageSize { get; set; }

        /// <summary>
        /// List of sorting configurations to apply to the table columns.
        /// </summary>
        public List<ColumnSortModel>? Sort { get; set; }

        /// <summary>
        /// Dictionary of column filters. The key is the column field name, and the value is a list of filters applied to that column.
        /// </summary>
        public Dictionary<string, List<ColumnFilterModel>> Filter { get; set; } = null!;

        /// <summary>
        /// Optional global filter applied to all columns.
        /// </summary>
        public string? GlobalFilter { get; set; }

        /// <summary>
        /// Optional list of columns to retrieve in the query.
        /// </summary>
        public List<string>? Columns { get; set; }

        /// <summary>
        /// Date format string used for date values in the query.
        /// </summary>
        public string DateFormat { get; set; } = null!;

        /// <summary>
        /// Timezone string used for date formatting.
        /// </summary>
        public string DateTimezone { get; set; } = null!;

        /// <summary>
        /// Culture string used for date localization.
        /// </summary>
        public string DateCulture { get; set; } = null!;
    }
}