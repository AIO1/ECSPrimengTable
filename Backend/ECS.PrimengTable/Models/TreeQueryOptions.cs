namespace ECS.PrimengTable.Models;

public sealed class TreeQueryOptions {
    public string IdColumnName { get; init; } = "Id";
    public string ParentIdColumnName { get; init; } = "ParentId";
    public string HasChildrenColumnName { get; init; } = "HasChildren";
    public string RowIdColumnName { get; init; } = "RowID";
    public object? RootParentId { get; init; }
}