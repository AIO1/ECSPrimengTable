using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;

namespace ECSPrimengTableExample.DTOs;

public class ProgressDemoDto {
    [ColumnAttributes(sendColumnAttributes: false)]
    public int RowID { get; set; }

    [ColumnAttributes("Progreso (%)", dataType: DataType.Numeric, cellDisplay: CellDisplay.ProgressBar, initialWidth: 200)]
    public decimal? Progress { get; set; }

    [ColumnAttributes("Tooltip personalizado", dataType: DataType.Numeric, cellDisplay: CellDisplay.ProgressBar,
        dataTooltipCustomColumnSource: nameof(Tip), initialWidth: 220)]
    public decimal? Custom { get; set; }

    [ColumnAttributes("Sin tooltip (desactivado)", dataType: DataType.Numeric,
        cellDisplay: CellDisplay.ProgressBar, dataTooltipShow: false, initialWidth: 220)]
    public decimal? Disabled { get; set; }

    [ColumnAttributes("Valor numérico", dataType: DataType.Numeric, initialWidth: 160)]
    public decimal? Plain { get; set; }

    [ColumnAttributes("Ejemplo", dataAlignHorizontal: DataAlignHorizontal.Left, initialWidth: 220)]
    public string Text { get; set; } = "";

    [ColumnAttributes(sendColumnAttributes: false)]
    public string Tip { get; set; } = "";
}
