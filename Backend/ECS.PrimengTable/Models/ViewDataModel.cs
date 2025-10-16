namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the view data for a table, including the alias, the serialized data, and whether it is the last active view.
    /// </summary>
    /// 
    public class ViewDataModel {

        /// <summary>
        /// Indicates whether this view was the last active view.
        /// </summary>
        public bool LastActive { get; set; }

        /// <summary>
        /// The alias used to identify the view.
        /// </summary>
        public string ViewAlias { get; set; } = null!;

        /// <summary>
        /// The serialized view data as a string.
        /// </summary>
        public string ViewData { get; set; } = null!;
    }
}