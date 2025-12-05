using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Models;

namespace ECS.PrimengTable.Services {
    internal static class ColumnAttributeOverrideService {
        // Applies all overrides from dictionary into the columnsInfo list
        public static void ApplyOverridesToColumns(List<ColumnMetadataModel> columnsInfo,Dictionary<string, ColumnMetadataOverrideModel>? dynamicAttributes) {
            if(dynamicAttributes == null)
                return;

            foreach(var entry in dynamicAttributes) {
                string columnName = entry.Key;
                ColumnMetadataOverrideModel overrideValues = entry.Value;

                // Finds the target column
                var targetColumn = columnsInfo.FirstOrDefault(c =>
                    string.Equals(c.Field, columnName, StringComparison.OrdinalIgnoreCase));

                if(targetColumn == null) {
                    Console.WriteLine($"[WARN] Dynamic override: No column found with name '{columnName}'.");
                    continue;
                }

                ApplyOverrides(targetColumn, overrideValues);
            }
        }

        // Copies all non-null override values into the target
        private static void ApplyOverrides(ColumnMetadataModel target, ColumnMetadataOverrideModel source) {
            foreach(var prop in typeof(ColumnMetadataOverrideModel).GetProperties()) {
                var overrideValue = prop.GetValue(source);
                if(overrideValue != null) {
                    var targetProp = typeof(ColumnMetadataModel).GetProperty(prop.Name);
                    targetProp?.SetValue(target, overrideValue);
                }
            }
        }

        public static void ApplyAttributeOverrides(ColumnAttributes attribute, ColumnMetadataOverrideModel? overrideData) {
            if(overrideData == null)
                return;
            foreach(var prop in typeof(ColumnMetadataOverrideModel).GetProperties()) {
                var overrideValue = prop.GetValue(overrideData);
                if(overrideValue != null) {
                    var targetProp = typeof(ColumnAttributes).GetProperty(prop.Name);
                    targetProp?.SetValue(attribute, overrideValue);
                }
            }
        }
    }
}
