# Optional Tree Grid Backend

The existing flat-table API is unchanged. Tree queries are opt-in through
`EcsPrimengTableService.PerformTreeQuery<T>` and
`EcsPrimengTableService.GenerateTreeExcelReport<T>` (`T : class`). Both accept
an `IQueryable<T>` and trusted, server-owned `TreeQueryOptions`, plus the same
date-format method, default sorts, dynamic metadata overrides and exclusions
as the flat helpers. Never bind `TreeQueryOptions` from the request.

## Server Options

| Option | Default |
| --- | --- |
| `IdColumnName` | `Id` |
| `ParentIdColumnName` | `ParentId` |
| `HasChildrenColumnName` | `HasChildren` |
| `RowIdColumnName` | `RowID` |
| `RootParentId` | `null` |

Names resolve case-insensitively to real, public, readable properties, not
expressions. They must be distinct. IDs and parent IDs use the same integral
or string type (nullable parents are supported). `HasChildren` is a writable
`bool`; `RowID` is a separate, unique integral/string selection alias.
IDs cannot be null or equal the root sentinel. Duplicate IDs, duplicate RowIDs,
missing parents, self-cycles and disconnected cycles reject the entire input,
even when those rows would be filtered out. Source records are not mutated.

```csharp
var options = new TreeQueryOptions { RootParentId = 0 };
var result = EcsPrimengTableService.PerformTreeQuery(request, rows, options);
var excel = EcsPrimengTableService.GenerateTreeExcelReport(export, rows, options);
```

## Query Contract

`TreeQueryRequestModel : TableQueryRequestModel` adds exactly:

| C# property | JSON property | Default / meaning |
| --- | --- | --- |
| `object? ParentId` | `parentId` | `null`; requested parent node |
| `string LoadMode` | `loadMode` | `onDemand`; `all`, `onDemand`, `pagedChildren` only |
| `bool Roots` | `roots` | `true`; explicitly request roots |
| `List<object>? ExpandedKeys` | `expandedKeys` | optional saved expansion state |

Pages are zero-based. Page size is positive; TreeDemo accepts `10`, `25`, `50`.
Numeric keys accept JSON numbers or numeric strings, including integral decimal
notation; fractional, overflowing, boolean, array and object keys reject.
String keys are compared ordinally. `Roots=true` uses the configured root
sentinel, not the request's parent. `Roots=false` requires an existing, non-null
node ID, never silently falls back to roots. The sentinel `0` is not a demo node.
Expanded keys must identify existing nodes, but do not control query/export
contents. They can be kept in serialized view state.

```json
{
  "page": 0,
  "pageSize": 10,
  "columns": ["id", "parentId", "hasChildren", "rowID", "text", "started", "active", "budget", "progress"],
  "filter": {},
  "sort": [{"field": "text", "order": 1}],
  "parentId": null,
  "loadMode": "onDemand",
  "roots": true,
  "expandedKeys": []
}
```

Send `id`, `parentId`, `hasChildren`, `rowID` even when hidden. The helper also
ensures structural fields survive projection; they cannot be server-excluded.
The existing column/global filters and date settings are retained. Omitted or
blank date settings use the library defaults. Dynamic overrides work with
case-insensitive field names. A supplied date-format method is supported;
otherwise the in-memory tree pipeline provides culture-aware formatting.
Nullable dates are safely skipped by active date predicates.

## Response And Loading

`TreePagedResponseModel : TablePagedResponseModel` adds
`List<object> AncestorKeys` (`ancestorKeys` in ASP.NET's camel-case JSON).
Existing response fields are `page`, `totalRecords`,
`totalRecordsNotFiltered`, `data`.

`data` is flat projected original records, not nested nodes. In TreeDemo its
structural fields are `id`, `parentId`, `hasChildren`, `rowID`; both IDs are
numeric. `HasChildren` describes retained children after filtering.

| Mode | `Roots=true` | `Roots=false` |
| --- | --- | --- |
| `all` | Entire retained tree, depth-first, no data pagination | Same entire tree |
| `onDemand` | Paginated retained roots only | All retained direct children; `page=0` |
| `pagedChildren` | Paginated retained roots only | Paginated retained direct children |

Counts always describe roots when `Roots=true`, otherwise direct children of
the requested parent, even in `all` mode. The unfiltered count uses the same
sibling scope before filtering. Page metadata clamps to the last actual sibling
page; an empty scope has page zero. In `all` mode that metadata does not limit data.

Filters retain matching nodes AND every ancestor, never unrelated descendants.
`AncestorKeys` contains only retained ancestors on matching paths that need
expansion, in tree order. It is empty without active filters, not a dump of every
node. Its size necessarily scales with retained paths, including deep paths.
Sorts order siblings consistently in every mode and export; ID ascending breaks
ties. Default sort columns/orders follow the existing helper convention.

## Excel And Selection

`GenerateTreeExcelReport` accepts the existing `ExcelExportRequestModel`.
`TreeExcelExportRequestModel` additionally accepts optional `ExpandedKeys` for
state compatibility. Export always traverses the complete retained tree in
depth-first sibling order, independent of loaded pages and expansion state.
`ApplyFilters`, `ApplySorts`, `AllColumns`, boolean icons, filename and date
format/timezone use the existing export behavior and shared Excel writer.
Without `AllColumns`, only explicitly requested exportable columns are written;
structural fields are not automatically added to Excel. `RowID` can remain a
selection-only alias with `SendColumnAttributes=false`.

Selection uses `filter.rowID`, not `Id`: `in` selects listed aliases, `notIn`
excludes them; `equals`/`notEquals` are also supported. JSON arrays and .NET
collections work. An empty `in` exports zero rows; an empty `notIn` exports all.
Selection is applied after ancestor retention, so selected-only export never
adds unselected context ancestors. It still applies with `ApplyFilters=false`.
No selection filter means all retained records. Selection key sets are prepared
once, not reparsed for each row.

## Demo And Views

TreeDemo routes: GET `TreeDemo/GetTableConfiguration`; POST
`TreeDemo/GetTableData`, `TreeDemo/GenerateExcel`, `TreeDemo/GetViews`,
`TreeDemo/SaveViews`.

The deterministic fixture has 317 rows, 36 roots, up to 32 direct children in
one branch and six levels, with varied text, dates, booleans, decimals and
nullable progress. Configuration, data and Excel require no SQL.

Views use the existing EF `TableViews` store and transaction behavior with the
fixed server key `TreeDemo` and demo username `User test`, as in TestController.
The request's `TableViewSaveKey` cannot redirect access to another table.
`ViewData` remains an opaque serialized string, so tree mode, filters and
expanded keys can round-trip with existing view state. At most ten views are
accepted, with unique nonempty aliases. Empty `Views` clears this demo's views.
These routes require the existing SQL connection/schema; no new scripts or
tables are needed. Database failures return generic HTTP 500 problems.
Production hosts must supply their own authenticated user/tenant scope, just
as with the existing demo. The library does not authorize the source query.

## Execution And Limits

Validation, filtering and indexing materialize the supplied authorized tree in
memory for each call. `onDemand` and `pagedChildren` limit response data, not
database reads. Traversals are iterative with no fixed depth cap; memory is
proportional to the source tree, and sorting is in-memory. For very large trees,
provide a scoped source or a database-specific closure/path implementation.
Do not pass a truncated source missing ancestors. This is not a SQL recursive
query implementation. There are no nested wrapper rows or synthetic nodes.

Run the existing console suite, including tree/controller/Excel checks:

```powershell
dotnet run --project Backend/ECS.PrimengTable.ResponsiveTests --configuration Release -p:GeneratePackageOnBuild=false
dotnet build Backend/ECSPrimengTableExample/ECSPrimengTableExample.csproj --configuration Release --no-restore -p:GeneratePackageOnBuild=false
```

The suite requires no SQL and includes a 12,000-level path. Actual SQL view
round-trips and a restarted HTTP host are separate integration checks.