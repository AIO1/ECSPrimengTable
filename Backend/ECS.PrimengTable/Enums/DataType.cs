namespace ECS.PrimengTable.Enums {

    /// <summary>
    /// Represents the data type of a table column or cell.
    /// </summary>
    public enum DataType {

        /// <summary>
        /// Textual data.
        /// </summary>
        Text,

        /// <summary>
        /// Numeric data.
        /// </summary>
        Numeric,

        /// <summary>
        /// Boolean data (true/false).
        /// </summary>
        Boolean,

        /// <summary>
        /// Date or datetime data.
        /// </summary>
        Date,

        /// <summary>
        /// Special type representing a list of strings separated by ";" used for advanced predefined filter functionality.
        /// </summary>
        List
    }
}