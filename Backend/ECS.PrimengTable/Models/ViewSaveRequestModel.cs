namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a request to save one or multiple table views.
    /// Inherits from <see cref="ViewLoadRequestModel"/>.
    /// </summary>
    /// 
    public class ViewSaveRequestModel : ViewLoadRequestModel {
        /// <summary>
        /// List of table views to be saved.
        /// </summary>
        public List<ViewDataModel> Views { get; set; } = null!;
    }
}