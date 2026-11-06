using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;

namespace ECSPrimengTableExample.DTOs;

public class TreeDemoDto {
    [ColumnAttributes(sendColumnAttributes: false, dataType: DataType.Numeric)]
    public int RowID { get; set; }

    [ColumnAttributes("ID", dataType: DataType.Numeric, startHidden: true, canBeGlobalFiltered: false)]
    public int Id { get; set; }

    [ColumnAttributes("Parent", dataType: DataType.Numeric, startHidden: true, canBeGlobalFiltered: false)]
    public int ParentId { get; set; }

    [ColumnAttributes("Has children", dataType: DataType.Boolean, startHidden: true, canBeGlobalFiltered: false)]
    public bool HasChildren { get; set; }

    [ColumnAttributes("Task", initialWidth: 280)]
    public string Text { get; set; } = "";

    [ColumnAttributes("Started", dataType: DataType.Date, initialWidth: 220)]
    public DateTime Started { get; set; }

    [ColumnAttributes("Active", dataType: DataType.Boolean)]
    public bool Active { get; set; }

    [ColumnAttributes("Budget", dataType: DataType.Numeric)]
    public decimal Budget { get; set; }

    [ColumnAttributes("Progress", dataType: DataType.Numeric, cellDisplay: CellDisplay.ProgressBar,
        dataTooltipCustomColumnSource: nameof(Tip), initialWidth: 200)]
    public decimal? Progress { get; set; }

    [ColumnAttributes(sendColumnAttributes: false)]
    public string Tip { get; set; } = "";
}