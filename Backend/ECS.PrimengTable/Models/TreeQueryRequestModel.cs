namespace ECS.PrimengTable.Models;

public class TreeQueryRequestModel : TableQueryRequestModel {
    public object? ParentId { get; set; }
    public string LoadMode { get; set; } = "onDemand";
    public bool Roots { get; set; } = true;
    public List<object>? ExpandedKeys { get; set; }
}