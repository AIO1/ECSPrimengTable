namespace ECS.PrimengTable.Enums {

    /// <summary>
    /// Specifies how the content of a table cell should behave when it overflows its container.
    /// </summary>
    public enum CellOverflowBehaviour {

        /// <summary>
        /// Overflowing content will be hidden and clipped.
        /// </summary>
        Hidden,

        /// <summary>
        /// Overflowing content will wrap to the next line within the cell.
        /// </summary>
        Wrap
    }
}