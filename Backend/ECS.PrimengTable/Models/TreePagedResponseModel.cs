namespace ECS.PrimengTable.Models;

public class TreePagedResponseModel : TablePagedResponseModel {
    public List<object> AncestorKeys { get; set; } = [];
}