namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents the configuration of a table including column metadata, pagination, and date formatting.
    /// </summary>
    public class TableConfigurationModel {

        /// <summary>
        /// Metadata for each column in the table.
        /// </summary>
        public List<ColumnMetadataModel> ColumnsInfo { get; set; } = null!;

        /// <summary>
        /// Allowed number of items per page for pagination.
        /// </summary>
        public int[] AllowedItemsPerPage { get; set; } = null!;

        /// <summary>
        /// Date format string used for displaying dates in the table.
        /// </summary>
        public string DateFormat { get; set; } = null!;

        /// <summary>
        /// Timezone used for date formatting in the table.
        /// </summary>
        public string DateTimezone { get; set; } = null!;

        /// <summary>
        /// Culture used for date localization in the table.
        /// </summary>
        public string DateCulture { get; set; } = null!;

        /// <summary>
        /// Maximum number of views allowed for a table configuration.
        /// </summary>
        public byte MaxViews { get; set; }

        /// <summary>
        /// Date format string used for displaying dates in exports.
        /// </summary>
        public string ExportDateFormat { get; set; } = null!;
    }
}
