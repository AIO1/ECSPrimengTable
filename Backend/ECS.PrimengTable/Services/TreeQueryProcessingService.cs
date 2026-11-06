using System.Collections;
using System.Globalization;
using System.Reflection;
using System.Text.Json;
using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;

namespace ECS.PrimengTable.Services;

internal static class TreeQueryProcessingService {
    private sealed class Node<T>(object key, object? parentKey, T row) {
        internal object Key { get; } = key;
        internal object? ParentKey { get; } = parentKey;
        internal T Row { get; } = row;
        internal Node<T>? Parent { get; set; }
        internal List<Node<T>> Children { get; } = [];
    }

    private sealed class Tree<T> where T : class {
        internal Dictionary<object, Node<T>> Nodes { get; } = [];
        internal List<Node<T>> Roots { get; } = [];
        internal PropertyInfo Id { get; }
        internal PropertyInfo ParentId { get; }
        internal PropertyInfo HasChildren { get; }
        internal PropertyInfo RowId { get; }
        internal Type KeyType { get; }

        internal Tree(IQueryable<T> source, TreeQueryOptions options) {
            Id = Property<T>(options.IdColumnName);
            ParentId = Property<T>(options.ParentIdColumnName);
            HasChildren = Property<T>(options.HasChildrenColumnName);
            RowId = Property<T>(options.RowIdColumnName);
            KeyType = Nullable.GetUnderlyingType(Id.PropertyType) ?? Id.PropertyType;
            if (!IsKeyType(KeyType) || (Nullable.GetUnderlyingType(ParentId.PropertyType) ?? ParentId.PropertyType) != KeyType)
                throw new ArgumentException("Tree ID and parent ID must use the same integral or string key type.");
            if (new[] { Id.Name, ParentId.Name, HasChildren.Name, RowId.Name }.Distinct().Count() != 4 ||
                HasChildren.PropertyType != typeof(bool) || HasChildren.SetMethod?.IsPublic != true ||
                !IsKeyType(Nullable.GetUnderlyingType(RowId.PropertyType) ?? RowId.PropertyType))
                throw new ArgumentException("Tree structural properties must be distinct; HasChildren must be writable bool and RowID an integral or string key.");
            object? sentinel = NormalizeKey(options.RootParentId, KeyType);
            var rowKeys = new HashSet<object>();
            var cloneMethod = typeof(object).GetMethod("MemberwiseClone", BindingFlags.Instance | BindingFlags.NonPublic)!;
            foreach (T original in source) {
                if (original == null) throw new ArgumentException("Tree rows cannot be null.");
                T row = (T)cloneMethod.Invoke(original, null)!;
                object key = NormalizeKey(Id.GetValue(row), KeyType) ?? throw new ArgumentException("Tree IDs cannot be null.");
                object rowKey = NormalizeKey(RowId.GetValue(row), Nullable.GetUnderlyingType(RowId.PropertyType) ?? RowId.PropertyType)
                    ?? throw new ArgumentException("Tree RowIDs cannot be null.");
                if (Equals(key, sentinel) || !Nodes.TryAdd(key, new Node<T>(key, NormalizeKey(ParentId.GetValue(row), KeyType), row)) || !rowKeys.Add(rowKey))
                    throw new ArgumentException("Tree IDs and RowIDs must be unique; an ID cannot equal the root sentinel.");
            }
            foreach (var node in Nodes.Values) {
                if (Equals(node.ParentKey, sentinel)) {
                    Roots.Add(node);
                } else {
                    if (node.ParentKey == null || !Nodes.TryGetValue(node.ParentKey, out var parent))
                        throw new ArgumentException("Tree contains a missing parent.");
                    node.Parent = parent;
                    parent.Children.Add(node);
                }
            }
            int visited = 0;
            var pending = new Stack<Node<T>>(Roots);
            while (pending.TryPop(out var node)) {
                visited++;
                HasChildren.SetValue(node.Row, node.Children.Count != 0);
                foreach (var child in node.Children) pending.Push(child);
            }
            if (visited != Nodes.Count) throw new ArgumentException("Tree contains a cycle.");
        }
    }

    internal static List<object> SelectionKeys<T>(TableQueryRequestModel request, IQueryable<T> source,
        TreeQueryOptions options) where T : class {
        var tree = new Tree<T>(source, options);
        var query = Prepare<T>(request, tree, null);
        var retained = Retain(tree, query, null, NormalizeAttributes<T>(null), out _);
        return DepthFirst(tree.Roots, retained).Select(node => tree.RowId.GetValue(node.Row)!).ToList();
    }

    internal static TreePagedResponseModel Query<T>(TreeQueryRequestModel request, IQueryable<T> source,
        TreeQueryOptions options, MethodInfo? dateMethod, List<string>? defaultSortColumns,
        List<ColumnSort>? defaultSortOrders, Dictionary<string, ColumnMetadataOverrideModel>? attributes,
        List<string>? excludedColumns) where T : class {
        if (request.LoadMode is not ("all" or "onDemand" or "pagedChildren"))
            throw new ArgumentException("LoadMode must be all, onDemand or pagedChildren.");
        if (request.PageSize == 0) throw new ArgumentException("PageSize must be positive.");
        attributes = NormalizeAttributes<T>(attributes);
        var tree = new Tree<T>(source, options);
        var query = Prepare<T>(request, tree, excludedColumns);
        ValidateKeys(request.ExpandedKeys, tree);
        object? parentKey = NormalizeKey(request.ParentId, tree.KeyType);
        if (!request.Roots && (parentKey == null || !tree.Nodes.ContainsKey(parentKey)))
            throw new ArgumentException("ParentId must identify an existing node when Roots is false.");
        var retained = Retain(tree, query, dateMethod, attributes, out var ancestors);
        Order(tree, query, defaultSortColumns, defaultSortOrders);
        List<Node<T>> siblings = request.Roots ? tree.Roots : tree.Nodes[parentKey!].Children;
        var filteredSiblings = siblings.Where(node => retained.Contains(node.Key)).ToList();
        int page = ClampPage(request.Page, filteredSiblings.Count, request.PageSize);
        IEnumerable<Node<T>> result;
        if (request.LoadMode == "all") {
            result = DepthFirst(tree.Roots, retained);
        } else if (request.LoadMode == "onDemand" && !request.Roots) {
            page = 0;
            result = filteredSiblings;
        } else {
            result = filteredSiblings.Skip(page * request.PageSize).Take(request.PageSize);
        }
        var nodes = result.ToList();
        List<dynamic> data = TableQueryProcessingService.GetDynamicSelect(nodes.Select(node => node.Row).AsQueryable(), query.Columns!, excludedColumns, qualifyProperties: true);
        for (int index = 0; index < nodes.Count; index++) {
            object projected = data[index];
            projected.GetType().GetProperty(tree.HasChildren.Name)!.SetValue(projected,
                nodes[index].Children.Any(child => retained.Contains(child.Key)));
        }
        return new TreePagedResponseModel {
            Page = page, TotalRecords = filteredSiblings.Count, TotalRecordsNotFiltered = siblings.Count,
            Data = data, AncestorKeys = ancestors.Count == 0 ? [] : DepthFirst(tree.Roots, retained).Where(node => ancestors.Contains(node.Key)).Select(node => node.Key).ToList()
        };
    }

    internal static (bool success, byte[]? reportFile, string statusMessage) Export<T>(ExcelExportRequestModel request,
        IQueryable<T> source, TreeQueryOptions options, MethodInfo? dateMethod, List<string>? defaultSortColumns,
        List<ColumnSort>? defaultSortOrders, Dictionary<string, ColumnMetadataOverrideModel>? attributes,
        List<string>? excludedColumns, string sheetName, byte pageStack) where T : class {
        try {
            if (pageStack == 0) throw new ArgumentException("Export batch size must be positive.");
            attributes = NormalizeAttributes<T>(attributes);
            var tree = new Tree<T>(source, options);
            if (request is TreeExcelExportRequestModel treeRequest) ValidateKeys(treeRequest.ExpandedKeys, tree);
            var query = Prepare<T>(request, tree, excludedColumns);
            query.Filter.Remove(tree.RowId.Name, out var selection);
            var isSelected = SelectionPredicate(selection, tree.RowId.PropertyType);
            if (!request.ApplyFilters) {
                query.Filter.Clear();
                query.GlobalFilter = null;
            }
            if (!request.ApplySorts) query.Sort = null;
            var retained = Retain(tree, query, dateMethod, attributes, out _);
            Order(tree, query, defaultSortColumns, defaultSortOrders);
            var ordered = DepthFirst(tree.Roots, retained).Select(node => node.Row);
            if (selection != null && selection.Count != 0)
                ordered = ordered.Where(row => isSelected(tree.RowId.GetValue(row)!));
            var metadata = EcsPrimengTableService.GetTableConfiguration<T>(dynamicAttributes: attributes,
                excludedColumns: excludedColumns, convertFieldToLower: false);
            var exportColumns = metadata.ColumnsInfo.Select(column => column.Field).ToHashSet();
            var exportRequest = new ExcelExportRequestModel {
                Page = 0, PageSize = request.PageSize, Columns = request.AllColumns ? exportColumns.ToList() : request.Columns!.Select(column => Property<T>(column).Name).Distinct().Where(exportColumns.Contains).ToList(),
                Filter = [], Sort = null, AllColumns = request.AllColumns, ApplyFilters = false, ApplySorts = false,
                Filename = request.Filename, UseIconInBools = request.UseIconInBools,
                DateFormat = query.DateFormat, DateTimezone = query.DateTimezone, DateCulture = query.DateCulture,
                ExportDateFormat = query.ExportDateFormat
            };
            if (exportRequest.Columns.Count == 0) throw new ArgumentException("At least one exportable column is required.");
            return ExcelExportService.GenerateExcelReport(exportRequest, ordered.AsQueryable(), dateMethod,
                dynamicAttributes: attributes, excludedColumns: excludedColumns, sheetName: sheetName,
                pageStack: pageStack, preparedTreeQuery: true);
        } catch (ArgumentException exception) {
            return (false, null, exception.Message);
        }
    }

    private static TableQueryRequestModel Prepare<T>(TableQueryRequestModel request, Tree<T> tree, List<string>? excludedColumns) where T : class {
        if (request.Columns == null || request.Columns.Count == 0) throw new ArgumentException("Columns are required.");
        string[] structural = [tree.Id.Name, tree.ParentId.Name, tree.HasChildren.Name, tree.RowId.Name];
        if (excludedColumns?.Any(column => structural.Contains(column, StringComparer.OrdinalIgnoreCase)) == true)
            throw new ArgumentException("Tree structural columns cannot be excluded.");
        var excluded = new HashSet<string>(excludedColumns ?? [], StringComparer.OrdinalIgnoreCase);
        string Resolve(string name) {
            string canonical = Property<T>(name).Name;
            if (excluded.Contains(canonical)) throw new ArgumentException("An excluded column was requested.");
            return canonical;
        }
        var columns = request.Columns.Select(Resolve).Concat(structural).Distinct().ToList();
        var filters = new Dictionary<string, List<ColumnFilterModel>>();
        foreach (var entry in request.Filter ?? []) {
            if (entry.Key.Equals("selector", StringComparison.OrdinalIgnoreCase)) continue;
            string field = Resolve(entry.Key);
            if (entry.Value == null) throw new ArgumentException("Filter rules cannot be null.");
            filters[field] = entry.Value.Where(rule => rule != null && HasFilterValue(rule.Value)).Select(rule => new ColumnFilterModel {
                Value = rule.Value, MatchMode = rule.MatchMode, Operator = rule.Operator
            }).ToList();
            if (filters[field].Count == 0) filters.Remove(field);
        }
        return new TableQueryRequestModel {
            Page = request.Page, PageSize = request.PageSize, Columns = columns, Filter = filters,
            GlobalFilter = request.GlobalFilter,
            Sort = request.Sort?.Select(sort => new ColumnSortModel { Field = Resolve(sort.Field), Order = sort.Order }).ToList(),
            DateFormat = string.IsNullOrWhiteSpace(request.DateFormat) ? TableConfigurationDefaults.DateFormat : request.DateFormat,
            DateTimezone = string.IsNullOrWhiteSpace(request.DateTimezone) ? TableConfigurationDefaults.DateTimezone : request.DateTimezone,
            DateCulture = string.IsNullOrWhiteSpace(request.DateCulture) ? TableConfigurationDefaults.DateCulture : request.DateCulture,
            ExportDateFormat = string.IsNullOrWhiteSpace(request.ExportDateFormat) ? TableConfigurationDefaults.ExportDateFormat : request.ExportDateFormat
        };
    }

    private static HashSet<object> Retain<T>(Tree<T> tree, TableQueryRequestModel query, MethodInfo? dateMethod,
        Dictionary<string, ColumnMetadataOverrideModel>? attributes, out HashSet<object> ancestors) where T : class {
        var rows = tree.Nodes.Values.Select(node => node.Row).AsQueryable();
        dateMethod ??= typeof(TreeQueryProcessingService).GetMethod(nameof(FormatDate), BindingFlags.Static | BindingFlags.NonPublic)!;
        var matching = QueryFilterService.ApplyGlobalFilter(rows, query.GlobalFilter, query.Columns!, query.DateFormat, query.DateTimezone, query.DateCulture, dateMethod, attributes, guardNullableDates: true);
        matching = QueryFilterService.ApplyColumnFilters(matching, query.Filter, query.Columns!, query.DateFormat, query.DateTimezone, query.DateCulture, dateMethod, attributes, guardNullableDates: true);
        var retained = matching.Select(row => tree.Id.GetValue(row)!).ToHashSet();
        ancestors = [];
        bool hasColumnFilter = query.Filter.Any(entry => {
            if (!query.Columns!.Contains(entry.Key)) return false;
            var attribute = Property<T>(entry.Key).GetCustomAttribute<ColumnAttributes>();
            bool canFilter = attributes != null && attributes.TryGetValue(entry.Key, out var metadata) && metadata.CanBeFiltered.HasValue
                ? metadata.CanBeFiltered.Value : attribute?.CanBeFiltered == true;
            return canFilter && entry.Value.Any(rule => HasFilterValue(rule.Value));
        });
        if (string.IsNullOrWhiteSpace(query.GlobalFilter) && !hasColumnFilter)
            return retained;
        foreach (object key in retained.ToArray()) {
            var parent = tree.Nodes[key].Parent;
            while (parent != null) {
                if (!ancestors.Add(parent.Key)) break;
                retained.Add(parent.Key);
                parent = parent.Parent;
            }
        }
        return retained;
    }

    private static void Order<T>(Tree<T> tree, TableQueryRequestModel query, List<string>? defaults, List<ColumnSort>? orders) where T : class {
        var sorts = query.Sort?.ToList() ?? [];
        if (sorts.Count == 0 && defaults != null) {
            for (int index = 0; index < defaults.Count; index++)
                sorts.Add(new ColumnSortModel { Field = Property<T>(defaults[index]).Name, Order = orders != null && index < orders.Count ? (int)orders[index] : -1 });
        }
        if (!sorts.Any(sort => sort.Field == tree.Id.Name)) sorts.Add(new ColumnSortModel { Field = tree.Id.Name, Order = 1 });
        foreach (var sort in sorts) sort.Field = $"it.{sort.Field}";
        var ordered = TableQueryProcessingService.ApplySorting(tree.Nodes.Values.Select(node => node.Row).AsQueryable(), sorts).ToList();
        tree.Roots.Clear();
        foreach (var node in tree.Nodes.Values) node.Children.Clear();
        foreach (var row in ordered) {
            var node = tree.Nodes[tree.Id.GetValue(row)!];
            if (node.Parent == null) tree.Roots.Add(node);
            else node.Parent.Children.Add(node);
        }
    }

    private static IEnumerable<Node<T>> DepthFirst<T>(List<Node<T>> roots, HashSet<object> retained) {
        var stack = new Stack<Node<T>>();
        for (int index = roots.Count - 1; index >= 0; index--) stack.Push(roots[index]);
        while (stack.TryPop(out var node)) {
            if (!retained.Contains(node.Key)) continue;
            yield return node;
            for (int index = node.Children.Count - 1; index >= 0; index--) stack.Push(node.Children[index]);
        }
    }

    private static Func<object, bool> SelectionPredicate(List<ColumnFilterModel>? rules, Type type) {
        if (rules == null || rules.Count == 0) return _ => true;
        bool useAnd = rules[0].Operator == "and";
        var prepared = new List<(HashSet<object> keys, bool negate)>();
        foreach (var rule in rules) {
            object? value = rule.Value;
            if (value == null) continue;
            IEnumerable<object?> values = value is JsonElement json && json.ValueKind == JsonValueKind.Array
                ? json.EnumerateArray().Select(item => (object?)item)
                : value is IEnumerable enumerable && value is not string && value is not JsonElement
                    ? enumerable.Cast<object?>() : new object?[] { value };
            bool negate = rule.MatchMode switch {
                "in" or "equals" => false,
                "notIn" or "notEquals" => true,
                _ => throw new ArgumentException("Tree export RowID selection supports in, notIn, equals and notEquals.")
            };
            var keys = values.Select(item => NormalizeKey(item, Nullable.GetUnderlyingType(type) ?? type))
                .Where(key => key != null).Cast<object>().ToHashSet();
            prepared.Add((keys, negate));
        }
        return key => prepared.Count == 0 || (useAnd
            ? prepared.All(rule => rule.keys.Contains(key) != rule.negate)
            : prepared.Any(rule => rule.keys.Contains(key) != rule.negate));
    }

    private static Dictionary<string, ColumnMetadataOverrideModel>? NormalizeAttributes<T>(Dictionary<string, ColumnMetadataOverrideModel>? attributes) {
        return attributes?.ToDictionary(entry => Property<T>(entry.Key).Name, entry => entry.Value, StringComparer.OrdinalIgnoreCase);
    }

    private static void ValidateKeys<T>(List<object>? keys, Tree<T> tree) where T : class {
        if (keys == null) return;
        foreach (object key in keys) {
            object normalized = NormalizeKey(key, tree.KeyType) ?? throw new ArgumentException("ExpandedKeys cannot contain null.");
            if (!tree.Nodes.ContainsKey(normalized)) throw new ArgumentException("ExpandedKeys must identify existing nodes.");
        }
    }

    private static int ClampPage(int page, int count, byte size) => Math.Clamp(page, 0, count == 0 ? 0 : (count - 1) / size);

    private static bool HasFilterValue(object? value) => value != null && !string.IsNullOrWhiteSpace(value.ToString());

    private static string FormatDate(DateTime date, string format, string timezone, string culture) {
        var offset = TimeSpan.Parse(timezone.TrimStart('+'), CultureInfo.InvariantCulture);
        return new DateTimeOffset(DateTime.SpecifyKind(date, DateTimeKind.Utc)).ToOffset(offset)
            .ToString(format, CultureInfo.GetCultureInfo(culture));
    }

    private static PropertyInfo Property<T>(string name) {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Column names cannot be empty.");
        var property = typeof(T).GetProperty(name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
        if (property?.GetMethod?.IsPublic != true || property.GetIndexParameters().Length != 0)
            throw new ArgumentException($"Unknown or unreadable column '{name}'.");
        return property;
    }

    private static bool IsKeyType(Type type) => type == typeof(string) || type == typeof(byte) || type == typeof(sbyte) ||
        type == typeof(short) || type == typeof(ushort) || type == typeof(int) || type == typeof(uint) || type == typeof(long) || type == typeof(ulong);

    private static object? NormalizeKey(object? value, Type type) {
        if (value is JsonElement json) {
            value = json.ValueKind switch {
                JsonValueKind.Null => null,
                JsonValueKind.String => json.GetString(),
                JsonValueKind.Number => json.GetRawText(),
                _ => throw new ArgumentException("Tree keys must be numeric, string or null.")
            };
        }
        if (value == null) return null;
        if (value is bool || value is char || value is not (string or byte or sbyte or short or ushort or int or uint or long or ulong or decimal or double or float))
            throw new ArgumentException("Tree keys must be numeric, string or null.");
        string text = Convert.ToString(value, CultureInfo.InvariantCulture)!;
        if (type == typeof(string)) {
            if (text.Length == 0) throw new ArgumentException("Tree keys cannot be empty strings.");
            return text;
        }
        if (!decimal.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out decimal number) || decimal.Truncate(number) != number)
            throw new ArgumentException("Tree numeric keys must be integers.");
        try {
            return Convert.ChangeType(number, type, CultureInfo.InvariantCulture);
        } catch (OverflowException) {
            throw new ArgumentException("Tree key is outside the configured numeric range.");
        }
    }
}
