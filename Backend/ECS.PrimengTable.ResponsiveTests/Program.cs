using System.Text.Json;
using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;

static void Check(bool condition, string message) {
    if (!condition) throw new Exception(message);
}
var config = EcsPrimengTableService.GetTableConfiguration<Example>();
var legacy = config.ColumnsInfo.Single(c => c.Field == "legacy");
Check(legacy.VisibleOnlyIn == null && !legacy.StartHidden, "Legacy defaults changed");
Check(!JsonSerializer.Serialize(legacy, new JsonSerializerOptions(JsonSerializerDefaults.Web)).Contains("visibleOnlyIn"), "Unconfigured metadata changed");
var desktop = config.ColumnsInfo.Single(c => c.Field == "desktop");
Check(desktop.VisibleOnlyIn!.SequenceEqual(new[] { DeviceType.Desktop }), "Attribute did not reach metadata");
var json = JsonSerializer.Serialize(desktop, new JsonSerializerOptions(JsonSerializerDefaults.Web));
Check(JsonDocument.Parse(json).RootElement.GetProperty("visibleOnlyIn")[0].GetInt32() == 2, "Wire enum mismatch");
Check(config.ColumnsInfo.Single(c => c.Field == "tablet").VisibleOnlyIn!.Length == 2, "Multiple values lost");
Check(config.ColumnsInfo.Single(c => c.Field == "all").VisibleOnlyIn!.Length == 3, "Three values lost");
Check(config.ColumnsInfo.Single(c => c.Field == "empty").VisibleOnlyIn!.Length == 0, "Empty array lost");
var overridden = EcsPrimengTableService.GetTableConfiguration<Example>(dynamicAttributes: new() {
    ["desktop"] = new ColumnMetadataOverrideModel { VisibleOnlyIn = new[] { DeviceType.Mobile } },
    ["tablet"] = new ColumnMetadataOverrideModel { VisibleOnlyIn = Array.Empty<DeviceType>() }
});
Check(overridden.ColumnsInfo.Single(c => c.Field == "desktop").VisibleOnlyIn![0] == DeviceType.Mobile, "Dynamic override failed");
Check(overridden.ColumnsInfo.Single(c => c.Field == "tablet").VisibleOnlyIn!.Length == 0, "Clearing override failed");
Console.WriteLine("Responsive metadata: 9 assertions passed.");

class Example {
    [ColumnAttributes("Legacy")]
    public string Legacy { get; set; } = "";
    [ColumnAttributes("Desktop", VisibleOnlyIn = new[] { DeviceType.Desktop })]
    public string Desktop { get; set; } = "";
    [ColumnAttributes("Tablet", VisibleOnlyIn = new[] { DeviceType.Desktop, DeviceType.Tablet })]
    public string Tablet { get; set; } = "";
    [ColumnAttributes("All", VisibleOnlyIn = new[] { DeviceType.Desktop, DeviceType.Tablet, DeviceType.Mobile })]
    public string All { get; set; } = "";
    [ColumnAttributes("Empty", VisibleOnlyIn = new DeviceType[] {})]
    public string Empty { get; set; } = "";
}
