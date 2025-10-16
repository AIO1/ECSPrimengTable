namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents the base sorting configuration for a table column.
    /// Defines the field to sort by and the order of sorting (ascending or descending).
    /// </summary>
    public class ColumnSortModel {

        /// <summary>
        /// The field associated with the column to be sorted.
        /// </summary>
        public string Field { get; set; } = null!;

        /// <summary>
        /// The order of the sorting. Example values: 1 for ascending, -1 for descending.
        /// </summary>
        public int Order { get; set; }
    }
}