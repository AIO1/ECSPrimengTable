namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a request to export table data to Excel.
    /// Inherits from <see cref="TableQueryRequestModel"/> and adds options specific to Excel export.
    /// </summary>
    public class ExcelExportRequestModel : TableQueryRequestModel {
        /// <summary>
        /// If true, all columns will be included in the export, regardless of visibility.
        /// </summary>
        public bool AllColumns { get; set; }

        /// <summary>
        /// If true, applies the currently active filters when exporting data.
        /// </summary>
        public bool ApplyFilters { get; set; }

        /// <summary>
        /// If true, applies the currently active sorts when exporting data.
        /// </summary>
        public bool ApplySorts { get; set; }

        /// <summary>
        /// The name of the Excel file to be generated.
        /// </summary>
        public string Filename { get; set; } = null!;

        /// <summary>
        /// If in bools we need to use icons or the underlying boolean value.
        /// </summary>
        public bool UseIconInBools { get; set; }
    }
}