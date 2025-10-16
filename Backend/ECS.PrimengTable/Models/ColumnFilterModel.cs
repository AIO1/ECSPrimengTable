namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents the configuration of a filter applied to a table column.
    /// This model defines the value, the matching mode, and the logical operator used for filtering.
    /// </summary>
    public class ColumnFilterModel {

        /// <summary>
        /// The value used to filter the column.
        /// Can be any type depending on the column's data type (string, number, date, etc.).
        /// </summary>
        public dynamic? Value { get; set; }

        /// <summary>
        /// The match mode to apply when filtering the column.
        /// Examples: "equals", "contains", "startsWith", "endsWith".
        /// </summary>
        public string MatchMode { get; set; } = null!;

        /// <summary>
        /// The logical operator to combine this filter with others.
        /// Examples: "AND", "OR".
        /// </summary>
        public string Operator { get; set; } = null!;
    }
}