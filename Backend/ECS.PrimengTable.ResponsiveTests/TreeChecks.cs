using System.Text.Json;
using ClosedXML.Excel;
using Data.PrimengTableReusableComponent;
using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;
using ECSPrimengTableExample.Controllers;
using ECSPrimengTableExample.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

static class TreeChecks {
    private static int assertions;
    private static readonly TreeQueryOptions Options = new() { RootParentId = 0 };

    private static void Check(bool condition, string message) {
        assertions++;
        if (!condition) throw new Exception(message);
    }

    private static void Reject(Action action, string message) {
        try { action(); } catch (ArgumentException) { Check(true, message); return; }
        Check(false, message);
    }

    private static TreeQueryRequestModel Request(string mode = "all", bool roots = true, object? parent = null) => new() {
        Page = 0, PageSize = 10, Columns = ["id", "parentId", "hasChildren", "rowID", "text", "amount", "active", "started"],
        LoadMode = mode, Roots = roots, ParentId = parent, Filter = []
    };

    private static TreeCheckRow Row(int id, int parent, string text) => new() {
        Id = id, RowID = id + 1000, ParentId = parent, Text = text, Amount = id + 0.5m,
        Active = id % 2 == 0, Started = new DateTime(2025, 1, 1, 23, 30, 0, DateTimeKind.Utc).AddDays(id)
    };

    private static int[] Ids(TablePagedResponseModel response) {
        using var document = JsonDocument.Parse(JsonSerializer.Serialize((object)response.Data));
        return document.RootElement.EnumerateArray().Select(row => row.GetProperty("Id").GetInt32()).ToArray();
    }

    private static List<ColumnFilterModel> Filter(object value, string mode = "equals", string operation = "and") =>
        [new ColumnFilterModel { Value = value, MatchMode = mode, Operator = operation }];

    private static ExcelExportRequestModel ExportRequest(Dictionary<string, List<ColumnFilterModel>>? filters = null) => new() {
        Page = 999, PageSize = 10, Columns = ["id", "text", "amount", "active", "started"],
        Filter = filters ?? [], ApplyFilters = true, ApplySorts = true, Filename = "tree.xlsx",
        Sort = [new ColumnSortModel { Field = "id", Order = -1 }]
    };

    private static int[] ExportIds(ExcelExportRequestModel request, IQueryable<TreeCheckRow> rows, int[]? expected = null) {
        var result = EcsPrimengTableService.GenerateTreeExcelReport(request, rows, Options, pageStack: 2);
        Check(result.success && result.reportFile != null, "Tree Excel failed: " + result.statusMessage);
        using var workbook = new XLWorkbook(new MemoryStream(result.reportFile!));
        var sheet = workbook.Worksheet(1);
        var ids = Enumerable.Range(3, Math.Max(0, sheet.LastRowUsed()!.RowNumber() - 2))
            .Select(index => (int)sheet.Cell(index, 1).GetDouble()).ToArray();
        if (expected != null) Check(ids.SequenceEqual(expected), "Excel must preserve depth-first sibling order and exact selection.");
        return ids;
    }

    public static void Run() {
        var selectionRows = Enumerable.Range(1, 30).Select(id => Row(id, id == 1 ? 0 : 1, id == 30 ? "Target" : "Other")).AsQueryable();
        var selectionRequest = Request();
        Check(EcsPrimengTableService.GetSelectionKeys(selectionRequest, selectionRows, row => row.RowID).Count == 30,
            "Flat selection must span all pages.");
        selectionRequest = Request(); selectionRequest.GlobalFilter = "Target";
        Check(EcsPrimengTableService.GetSelectionKeys(selectionRequest, selectionRows, row => row.RowID).SequenceEqual([1030]),
            "Flat selection must apply global search.");
        selectionRequest = Request(); selectionRequest.GlobalFilter = "Target";
        Check(EcsPrimengTableService.GetTreeSelectionKeys(selectionRequest, selectionRows, Options).Cast<int>().SequenceEqual([1001, 1030]),
            "Tree selection must include matching unloaded descendants and retained ancestors, using rowID aliases.");
        var rows = new[] { Row(1, 0, "Root A"), Row(2, 1, "Branch"), Row(3, 2, "Needle"),
            Row(4, 1, "Unrelated"), Row(5, 0, "Root B"), Row(6, 5, "Other") }.AsQueryable();
        var request = Request();
        var all = EcsPrimengTableService.PerformTreeQuery(request, rows, Options);
        Check(Ids(all).SequenceEqual(new[] { 1, 2, 3, 4, 5, 6 }), "All mode must return the complete depth-first tree.");
        Check(all.TotalRecords == 2 && all.TotalRecordsNotFiltered == 2 && all.AncestorKeys.Count == 0, "All mode counts roots, without autoexpanding an unfiltered tree.");
        Check(request.Columns![0] == "id" && rows.First().HasChildren == false, "Tree query must not mutate requests or source rows.");
        using (var json = JsonDocument.Parse(JsonSerializer.Serialize((object)all.Data))) {
            Check(json.RootElement[0].GetProperty("HasChildren").GetBoolean(), "HasChildren must be computed, not trusted from stale source data.");
            Check(json.RootElement[2].GetProperty("RowID").GetInt32() == 1003, "RowID selection alias must not be replaced by Id.");
        }
        request.Sort = [new ColumnSortModel { Field = "id", Order = -1 }];
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(request, rows, Options)).SequenceEqual(new[] { 5, 6, 1, 4, 2, 3 }), "Sorting must order siblings, not flatten the hierarchy.");

        var leafFilter = Request();
        leafFilter.Filter["text"] = Filter("Needle", "contains");
        var filtered = EcsPrimengTableService.PerformTreeQuery(leafFilter, rows, Options);
        Check(Ids(filtered).SequenceEqual(new[] { 1, 2, 3 }), "Leaf filters must retain all ancestors and no unrelated descendants.");
        Check(filtered.AncestorKeys.Cast<int>().SequenceEqual(new[] { 1, 2 }) && filtered.TotalRecords == 1, "Only retained ancestor paths must autoexpand.");
        var branchFilter = Request();
        branchFilter.Filter["text"] = Filter("Branch");
        var branch = EcsPrimengTableService.PerformTreeQuery(branchFilter, rows, Options);
        Check(Ids(branch).SequenceEqual(new[] { 1, 2 }), "Matching parents must not include nonmatching descendants.");
        using (var json = JsonDocument.Parse(JsonSerializer.Serialize((object)branch.Data)))
            Check(!json.RootElement[1].GetProperty("HasChildren").GetBoolean(), "Filtered leaves must not advertise unrelated children.");
        var empty = Request();
        empty.GlobalFilter = "not present";
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(empty, rows, Options)).Length == 0, "Empty filter results must return no rows.");
        var boolean = Request();
        boolean.Filter["active"] = Filter(true);
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(boolean, rows, Options)).SequenceEqual(new[] { 1, 2, 4, 5, 6 }), "Boolean filters must retain paths.");
        var numeric = Request();
        numeric.Filter["amount"] = Filter(5, "gt");
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(numeric, rows, Options)).SequenceEqual(new[] { 5, 6 }), "Numeric filters must retain numeric semantics.");
        var date = Request();
        date.DateTimezone = "+02:00";
        date.Filter["started"] = Filter("2025-01-05", "dateIs");
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(date, rows, Options)).SequenceEqual(new[] { 1, 2, 3 }), "Date filters must use the requested local timezone.");
        var culture = Request();
        culture.Columns = ["started"];
        culture.DateFormat = "MMMM";
        culture.DateCulture = "es-ES";
        culture.GlobalFilter = "enero";
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(culture, rows, Options)).Length == 6, "In-memory date global search must preserve culture.");
        var overridden = EcsPrimengTableService.PerformTreeQuery(culture, rows, Options, dynamicAttributes: new() {
            ["started"] = new ColumnMetadataOverrideModel { DateCulture = "en-US" }
        });
        Check(Ids(overridden).Length == 0, "Dynamic date metadata must control filtering.");
        var nullableDates = new[] { Row(1, 0, "Root"), Row(2, 1, "Leaf") }.AsQueryable();
        nullableDates.Last().Started = null;
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(culture, nullableDates, Options)).SequenceEqual(new[] { 1 }), "Global date filters must skip nullable dates safely.");
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(date, nullableDates, Options)).Length == 0, "Column date filters must skip nullable dates safely.");
        date.Filter["started"] = [new ColumnFilterModel { Value = null, MatchMode = "dateIs", Operator = "and" }];
        var clearedDate = EcsPrimengTableService.PerformTreeQuery(date, nullableDates, Options);
        Check(Ids(clearedDate).Length == 2 && clearedDate.AncestorKeys.Count == 0, "Cleared date filters must retain nulls and not trigger expansion.");
        var disabledFilter = Request();
        disabledFilter.Filter["id"] = Filter(1);
        var disabledResult = EcsPrimengTableService.PerformTreeQuery(disabledFilter, rows, Options);
        Check(Ids(disabledResult).Length == 6 && disabledResult.AncestorKeys.Count == 0, "Disabled filters must not expand every ancestor.");

        var fixture = TreeDemoData.Create();
        var rootRequest = new TreeQueryRequestModel { Page = 999, PageSize = 10, Columns = ["text"], Filter = [] };
        var roots = EcsPrimengTableService.PerformTreeQuery(rootRequest, fixture, Options);
        Check(roots.TotalRecords == 36 && roots.Page == 3 && Ids(roots).Length == 6, "Root pages must clamp to the last actual page.");
        rootRequest.Page = -5;
        Check(EcsPrimengTableService.PerformTreeQuery(rootRequest, fixture, Options).Page == 0, "Negative pages must clamp to zero.");
        rootRequest.LoadMode = "all";
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(rootRequest, fixture, Options)).Length == fixture.Count(), "All mode must ignore root pagination.");
        var children = new TreeQueryRequestModel { Page = 999, PageSize = 10, Columns = ["text"], Filter = [], Roots = false, ParentId = 1 };
        var direct = EcsPrimengTableService.PerformTreeQuery(children, fixture, Options);
        Check(direct.TotalRecords == 32 && direct.TotalRecordsNotFiltered == 32 && direct.Page == 0 && Ids(direct).Length == 32, "On-demand children must be unpaged direct siblings.");
        children.LoadMode = "pagedChildren";
        var childPage = EcsPrimengTableService.PerformTreeQuery(children, fixture, Options);
        Check(childPage.Page == 3 && Ids(childPage).Length == 2, "Paged children must clamp and paginate siblings.");
        var defaultSearch = new TreeQueryRequestModel { Page = 0, PageSize = 10, Columns = ["text", "started"], Filter = [], GlobalFilter = "Project 01" };
        Check(EcsPrimengTableService.PerformTreeQuery(defaultSearch, fixture, Options).TotalRecords == 1, "Global search must work with default date culture and format.");
        var wire = JsonSerializer.Deserialize<TreeQueryRequestModel>("{\"page\":0,\"pageSize\":10,\"columns\":[\"text\"],\"roots\":false,\"parentId\":\"1\",\"expandedKeys\":[1,\"2\"]}", new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options)).Length == 32, "JSON string and numeric keys must normalize reliably.");
        wire.ParentId = JsonSerializer.Deserialize<object>("1.0");
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options)).Length == 32, "Integral JSON decimal keys must be accepted.");
        wire.ParentId = null;
        Reject(() => EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options), "Roots=false with null ParentId must not silently load roots.");
        wire.Roots = true;
        Check(Ids(EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options)).Length == 10, "Roots=true must load roots independently of null ParentId.");
        foreach (string invalidKey in new[] { "true", "[]", "{}", "1.5", "99999999999999999999999999" }) {
            wire.ParentId = JsonSerializer.Deserialize<object>(invalidKey);
            Reject(() => EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options), "Invalid JSON key must be rejected: " + invalidKey);
        }
        wire.ParentId = null;
        wire.ExpandedKeys = [999999];
        Reject(() => EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options), "Unknown expanded keys must be rejected.");
        wire.ExpandedKeys = null;
        wire.LoadMode = "invalid";
        Reject(() => EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options), "Unknown load modes must be rejected.");
        wire.LoadMode = "all";
        wire.PageSize = 0;
        Reject(() => EcsPrimengTableService.PerformTreeQuery(wire, fixture, Options), "Zero page size must be rejected.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), rows, new TreeQueryOptions { IdColumnName = "Id.ToString()" }), "Server column names must be real properties, not expressions.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), rows, Options, excludedColumns: ["Id"]), "Structural columns cannot be excluded.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(1, 0, "a"), Row(1, 0, "b") }.AsQueryable(), Options), "Duplicate IDs must be rejected.");
        var duplicateAlias = Row(2, 0, "b");
        duplicateAlias.RowID = 1001;
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(1, 0, "a"), duplicateAlias }.AsQueryable(), Options), "Duplicate selection aliases must be rejected.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(1, 99, "a") }.AsQueryable(), Options), "Missing parents must be rejected.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(1, 2, "a"), Row(2, 1, "b") }.AsQueryable(), Options), "Disconnected cycles must be rejected.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(1, 1, "a") }.AsQueryable(), Options), "Self-cycles must be rejected.");
        Reject(() => EcsPrimengTableService.PerformTreeQuery(Request(), new[] { Row(0, 0, "a") }.AsQueryable(), Options), "Root sentinel cannot also be an ID.");
        var deepRows = Enumerable.Range(1, 12000).Select(id => Row(id, id - 1, id == 12000 ? "Deep needle" : "Context")).AsQueryable();
        var deepRequest = Request();
        deepRequest.Filter["text"] = Filter("Deep needle");
        var deep = EcsPrimengTableService.PerformTreeQuery(deepRequest, deepRows, Options);
        Check(Ids(deep).Length == 12000 && deep.AncestorKeys.Count == 11999, "Deep traversal and ancestor retention must be iterative, with no depth ceiling.");

        ExportIds(ExportRequest(), rows, [5, 6, 1, 4, 2, 3]);
        ExportIds(ExportRequest(new() { ["text"] = Filter("Needle") }), rows, [1, 2, 3]);
        ExportIds(ExportRequest(new() { ["rowID"] = Filter(JsonSerializer.Deserialize<object>("[1003,1006]")!, "in") }), rows, [6, 3]);
        ExportIds(ExportRequest(new() { ["rowID"] = Filter(new[] { 1003, 1006 }, "notIn") }), rows, [5, 1, 4, 2]);
        ExportIds(ExportRequest(new() { ["rowID"] = Filter(Array.Empty<int>(), "in") }), rows, []);
        ExportIds(ExportRequest(new() { ["rowID"] = Filter(Array.Empty<int>(), "notIn") }), rows, [5, 6, 1, 4, 2, 3]);
        ExportIds(ExportRequest(new() { ["text"] = Filter("Needle"), ["rowID"] = Filter(new[] { 1003 }, "in") }), rows, [3]);
        var noFilters = ExportRequest(new() { ["text"] = Filter("does not match"), ["rowID"] = Filter(new[] { 1003 }, "in") });
        noFilters.ApplyFilters = false;
        ExportIds(noFilters, rows, [3]);
        var noSort = ExportRequest();
        noSort.ApplySorts = false;
        ExportIds(noSort, rows, [1, 2, 3, 4, 5, 6]);
        var formats = ExportRequest();
        formats.DateTimezone = "+02:00";
        formats.ExportDateFormat = "yyyy-mm-dd hh:mm";
        var formatted = EcsPrimengTableService.GenerateTreeExcelReport(formats, rows, Options);
        Check(formatted.success, "Formatted tree Excel failed.");
        using (var workbook = new XLWorkbook(new MemoryStream(formatted.reportFile!))) {
            var sheet = workbook.Worksheet(1);
            Check(sheet.Cell(3, 3).DataType == XLDataType.Number && sheet.Cell(3, 3).GetDouble() == 5.5, "Tree Excel decimals must remain numeric.");
            Check(sheet.Cell(3, 4).DataType == XLDataType.Boolean, "Tree Excel booleans must retain underlying values.");
            Check(sheet.Cell(3, 5).GetDateTime() == rows.Single(row => row.Id == 5).Started!.Value.AddHours(2), "Tree Excel must preserve timezone conversion.");
            Check(sheet.Column(5).Style.NumberFormat.Format == "yyyy-mm-dd hh:mm", "Tree Excel must preserve requested date format.");
        }
        var allColumns = ExportRequest();
        allColumns.AllColumns = true;
        Check(EcsPrimengTableService.GenerateTreeExcelReport(allColumns, rows, Options).success, "AllColumns tree Excel must use shared metadata.");
        var textOnly = ExportRequest();
        textOnly.Columns = ["text"];
        var visibleExport = EcsPrimengTableService.GenerateTreeExcelReport(textOnly, rows, Options);
        Check(visibleExport.success, "Visible column export failed.");
        using (var workbook = new XLWorkbook(new MemoryStream(visibleExport.reportFile!)))
            Check(workbook.Worksheet(1).LastColumnUsed()!.ColumnNumber() == 1, "Export must not automatically add hidden structural columns.");
        Check(!EcsPrimengTableService.GenerateTreeExcelReport(ExportRequest(), rows, Options, pageStack: 0).success, "Zero export batch must fail promptly.");

        var strings = new[] { new StringTreeRow { Key = "root", Selection = "a" }, new StringTreeRow { Key = "leaf", Parent = "root", Selection = "b" } }.AsQueryable();
        var stringOptions = new TreeQueryOptions { IdColumnName = "Key", ParentIdColumnName = "Parent", RowIdColumnName = "Selection", HasChildrenColumnName = "Children" };
        var stringRequest = new TreeQueryRequestModel { Page = 0, PageSize = 10, Columns = ["key"], Filter = [], Roots = false, ParentId = JsonSerializer.Deserialize<object>("\"root\"") };
        Check(EcsPrimengTableService.PerformTreeQuery(stringRequest, strings, stringOptions).TotalRecords == 1, "String keys and custom server property names must work.");
        stringRequest.Roots = true;
        stringRequest.ParentId = null;
        Check(EcsPrimengTableService.PerformTreeQuery(stringRequest, strings, stringOptions).TotalRecords == 1, "Null root sentinel must work without ambiguous Roots handling.");
        var config = EcsPrimengTableService.GetTableConfiguration<TreeDemoDto>();
        Check(config.ColumnsInfo.Single(column => column.Field == "id").StartHidden && config.ColumnsInfo.Single(column => column.Field == "progress").CellDisplay == CellDisplay.ProgressBar, "Tree demo must preserve hidden and progress metadata.");
        var db = new primengTableReusableComponentContext(new DbContextOptionsBuilder<primengTableReusableComponentContext>().Options);
        using (db) {
            var controller = new TreeDemoController(db);
            Check(controller.GetTableConfiguration() is OkObjectResult, "TreeDemo configuration must not need SQL.");
            Check(controller.GetTableData(new TreeQueryRequestModel { Page = 0, PageSize = 10, Columns = ["text"], Filter = [] }) is OkObjectResult, "TreeDemo data must not need SQL.");
            Check(controller.GetTableData(new TreeQueryRequestModel { Page = 0, PageSize = 10, Columns = ["text"], Filter = [], LoadMode = "wrong" }) is BadRequestObjectResult, "Invalid mode must return HTTP 400.");
            Check(controller.GenerateExcel(new TreeExcelExportRequestModel { Page = 0, PageSize = 10, Columns = ["text"], Filter = [], AllColumns = true }) is FileContentResult, "TreeDemo Excel must not need SQL or loaded expansion state.");
            Check(controller.SaveViews(new ViewSaveRequestModel { Views = null! }).GetAwaiter().GetResult() is BadRequestObjectResult, "Invalid views must fail before accessing SQL.");
            Check(controller.SaveViews(new ViewSaveRequestModel { Views = [
                new ViewDataModel { ViewAlias = "Same", ViewData = "{}" },
                new ViewDataModel { ViewAlias = "same", ViewData = "{}" }
            ] }).GetAwaiter().GetResult() is BadRequestObjectResult, "Duplicate aliases must fail before accessing SQL.");
            Check(TreeDemoController.TableKey == "TreeDemo", "Tree views must have their own server-owned key.");
            Check(controller.GetViews(new ViewLoadRequestModel { TableViewSaveKey = "Other" }).GetAwaiter().GetResult() is ObjectResult { StatusCode: 500 }, "Unavailable views must return a generic HTTP 500 problem.");
            Check(controller.SaveViews(new ViewSaveRequestModel { TableViewSaveKey = "Other", Views = [] }).GetAwaiter().GetResult() is ObjectResult { StatusCode: 500 }, "Unavailable view persistence must not expose database errors.");
        }
        Console.WriteLine($"Tree query, export, demo and validation: {assertions} assertions passed.");
    }
}

public class TreeCheckRow {
    [ColumnAttributes(sendColumnAttributes: false, dataType: DataType.Numeric)]
    public int RowID { get; set; }
    [ColumnAttributes("ID", dataType: DataType.Numeric, canBeGlobalFiltered: false, canBeFiltered: false)]
    public int Id { get; set; }
    [ColumnAttributes("Parent", dataType: DataType.Numeric, canBeGlobalFiltered: false)]
    public int ParentId { get; set; }
    [ColumnAttributes("Children", dataType: DataType.Boolean, canBeGlobalFiltered: false)]
    public bool HasChildren { get; set; }
    [ColumnAttributes("Text")]
    public string Text { get; set; } = "";
    [ColumnAttributes("Amount", dataType: DataType.Numeric, canBeGlobalFiltered: false)]
    public decimal Amount { get; set; }
    [ColumnAttributes("Active", dataType: DataType.Boolean, canBeGlobalFiltered: false)]
    public bool Active { get; set; }
    [ColumnAttributes("Started", dataType: DataType.Date)]
    public DateTime? Started { get; set; }
}

public class StringTreeRow {
    [ColumnAttributes("Key")]
    public string Key { get; set; } = "";
    [ColumnAttributes("Parent")]
    public string? Parent { get; set; }
    [ColumnAttributes(sendColumnAttributes: false)]
    public string Selection { get; set; } = "";
    [ColumnAttributes("Children", dataType: DataType.Boolean)]
    public bool Children { get; set; }
}
