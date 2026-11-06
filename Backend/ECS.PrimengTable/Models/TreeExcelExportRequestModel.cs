namespace ECS.PrimengTable.Models;

public class TreeExcelExportRequestModel : ExcelExportRequestModel {
    public List<object>? ExpandedKeys { get; set; }
}