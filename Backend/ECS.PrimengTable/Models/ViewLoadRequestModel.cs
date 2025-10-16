namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a request to load a saved table view by its key.
    /// </summary>
    public class ViewLoadRequestModel {

        /// <summary>
        /// The key identifying the saved table view to load.
        /// </summary>
        public string TableViewSaveKey { get; set; } = null!;
    }
}