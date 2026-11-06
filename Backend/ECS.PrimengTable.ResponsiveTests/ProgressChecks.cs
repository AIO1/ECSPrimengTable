using System.Text.Json;
using ClosedXML.Excel;
using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;

static class ProgressChecks {
    static void Check(bool condition, string message) {
        if (!condition) throw new Exception(message);
    }

    public static void Run() {
        var config = EcsPrimengTableService.GetTableConfiguration<ProgressExample>();
        var progress = config.ColumnsInfo.Single(c => c.Field == "progress");
        Check(progress.DataType == DataType.Numeric && progress.CellDisplay == CellDisplay.ProgressBar,
            "Progress presentation must preserve numeric semantics");
        Check(config.ColumnsInfo.Single(c => c.Field == "plain").CellDisplay == CellDisplay.Default,
            "Existing columns must retain their default presentation");
        using var json = JsonDocument.Parse(JsonSerializer.Serialize(progress, new JsonSerializerOptions(JsonSerializerDefaults.Web)));
        Check(json.RootElement.GetProperty("cellDisplay").GetInt32() == 1, "Progress wire enum mismatch");
        var overridden = EcsPrimengTableService.GetTableConfiguration<ProgressExample>(dynamicAttributes: new() {
            ["progress"] = new ColumnMetadataOverrideModel { CellDisplay = CellDisplay.Default },
            ["plain"] = new ColumnMetadataOverrideModel { CellDisplay = CellDisplay.ProgressBar }
        });
        Check(overridden.ColumnsInfo.Single(c => c.Field == "progress").CellDisplay == CellDisplay.Default,
            "Must be able to disable progress via overrides");
        Check(overridden.ColumnsInfo.Single(c => c.Field == "plain").CellDisplay == CellDisplay.ProgressBar,
            "Must be able to enable progress via overrides");

        var rows = new[] { new ProgressExample { Progress = 15.5m }, new ProgressExample { Progress = 125m } }.AsQueryable();
        var filtered = EcsPrimengTableService.PerformDynamicQuery(new TableQueryRequestModel {
            Page = 0, PageSize = 10, Columns = ["Progress"],
            Filter = new() { ["Progress"] = [new ColumnFilterModel { Value = 10, MatchMode = "gt", Operator = "and" }] },
            Sort = [new ColumnSortModel { Field = "Progress", Order = -1 }]
        }, rows.Concat(new[] { new ProgressExample { Progress = 0 }, new ProgressExample() }));
        Check(filtered.TotalRecords == 2, "Progress must retain numeric filtering, excluding null and zero");
        using var data = JsonDocument.Parse(JsonSerializer.Serialize((object)filtered.Data));
        Check(data.RootElement[0].GetProperty("Progress").GetDecimal() == 125m &&
            data.RootElement[1].GetProperty("Progress").GetDecimal() == 15.5m,
            "Progress must sort numerically and preserve decimals");
        var export = EcsPrimengTableService.GenerateExcelReport(new ExcelExportRequestModel {
            Page = 0, PageSize = 10, Columns = ["Progress"], Filename = "Progress", Filter = new(),
            Sort = [new ColumnSortModel { Field = "Progress", Order = 1 }], ApplySorts = true
        }, rows);
        Check(export.success && export.reportFile != null, "Progress export failed: " + export.statusMessage);
        using var workbook = new XLWorkbook(new MemoryStream(export.reportFile!));
        var sheet = workbook.Worksheet(1);
        Check(sheet.Cell(3, 1).DataType == XLDataType.Number && sheet.Cell(3, 1).GetDouble() == 15.5,
            "Progress must export as a number, not a percentage string");
        Check(sheet.Cell(4, 1).GetDouble() == 125, "Export must preserve the original out-of-range value");
        Console.WriteLine("Progress metadata, numeric filtering/sorting and Excel export checks passed.");
    }
}

public class ProgressExample {
    [ColumnAttributes("Progress", dataType: DataType.Numeric, cellDisplay: CellDisplay.ProgressBar)]
    public decimal? Progress { get; set; }
    [ColumnAttributes("Plain", dataType: DataType.Numeric)]
    public decimal Plain { get; set; }
}
