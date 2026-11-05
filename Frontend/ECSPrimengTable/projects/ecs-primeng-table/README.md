# Optional Tree Grid

Omit `tree` to keep the flat grid unchanged. Opt in with ordinary flat records:

```ts
import { createTableOptions } from '@eternalcodestudio/primeng-table';

readonly tableOptions = createTableOptions({
  tree: {
    keyExpr: 'id', parentIdExpr: 'parentId', rootValue: 0,
    hasItemsExpr: 'hasChildren', column: 'text', loadMode: 'onDemand'
  },
  urlTableConfiguration: 'TreeDemo/GetTableConfiguration',
  urlTableData: 'TreeDemo/GetTableData',
  excelReport: { url: 'TreeDemo/GenerateExcel' }
});
```

Add `ECSPrimengTable` from the same package to your standalone component's
`imports`, then bind the options in its template:

```html
<ecs-primeng-table [tableOptions]="tableOptions" />
```

The API returns ordinary records, not nested `children` arrays. For example,
the following records describe a root, a child and a grandchild:

```json
[
  { "id": 1, "parentId": 0, "hasChildren": true, "text": "Project", "rowID": 1 },
  { "id": 2, "parentId": 1, "hasChildren": true, "text": "Task", "rowID": 2 },
  { "id": 3, "parentId": 2, "hasChildren": false, "text": "Subtask", "rowID": 3 }
]
```

`keyExpr` and `parentIdExpr` identify the relationship, `rootValue` marks root
parents, `hasItemsExpr` indicates whether a node can expand in remote modes,
and `column` selects the field containing the indentation and expand control.
These records are the response's `data`, not the complete response envelope;
remote modes return only the requested siblings. Keep the existing table
configuration endpoint for column metadata, filtering and display options.

`loadMode` accepts `all`, `onDemand` (default) or `pagedChildren`.
`rootValue` defaults to `0`; use `null` explicitly for nullable root parents.
Remote modes require a boolean `hasItemsExpr`. Keys are unique finite numbers
or nonempty strings. Preserve structural fields and the independent selection
alias `rowID`, even when hidden. Use a distinct state-persistence key per mode,
provide `ECSPrimengTableStateService` on the parent route component, and remount
the table when changing mode. The `/tree` demo illustrates this pattern.

Root queries send `roots`, `parentId`, `loadMode`, `page` and `pageSize` alongside
the existing filters/sorts. Responses remain flat and add `ancestorKeys` to open
matching paths. Page counts describe roots; expanded children are not a second
root page. Paged children expose a load-more row. Expansion caches are invalidated
by a fresh query. Views/navigation persist `treeExpandedKeys` and `treeChildPages`;
selection is independent and does not cascade. Saved views restore into the
currently configured mode; the demo's mode choice lives in its parent settings.

Tree Excel endpoints must export the complete retained hierarchy, independent
of expansion/loading. The demo backend uses in-memory validation/querying rather
than a SQL recursive query. See the repository's `Backend/ECS.PrimengTable/TREE.md`
for the full API contract, authorization constraints and memory limits.

Translate `Expand node`, `Collapse node`, `Load more children` and
`Showing {{count}} root nodes of {{total}} available root nodes` in the consuming
application's dictionaries. Without ngx-translate providers they remain English.

For a step-by-step walkthrough and a screenshot of the running example, see
[Try the tree demo](https://github.com/AIO1/ECSPrimengTable#try-the-tree-demo).
The example shows the three load modes, deep filtering, saved views and returning
from a detail route without losing the expanded branches.

# Group Headers

Set `HeaderGroup` on backend column attributes:

```csharp
[ColumnAttributes("Name", HeaderGroup = "Group1")]
public string Name { get; set; } = "";

[ColumnAttributes("Age", dataType: DataType.Numeric, HeaderGroup = "Group1")]
public int Age { get; set; }
```

Consecutive visible columns sharing `headerGroup` receive a centered spanning header. Reordering or hiding columns recalculates the runs, repeating the label when a group is split. Ungrouped columns leave a blank space; no extra row is rendered when no visible column has a group. Frozen alignment boundaries split runs to preserve scrolling alignment. Labels support translation keys just like `header`.

Use `ColumnMetadataOverrideModel.HeaderGroup` for dynamic overrides; an empty string removes a group. The `/progress` example groups the first three columns under `Grupo1` and the last two under `Grupo2`.

# ECS PrimeNG table

This NPM package contains ECS PrimeNG table.  
For full documentation, usage instructions, examples, and updates, please visit the official GitHub repository:
[https://github.com/AIO1/ECSPrimengTable](https://github.com/AIO1/ECSPrimengTable)

> **Note:** Make sure to check the GitHub README for detailed guidance on how to integrate and use this component in your projects.
## Column header translations (Angular 19)

Install `@ngx-translate/core@^17` in the consuming application and configure
`provideTranslateService` once in its application providers. If your application
already uses ngx-translate, reuse its existing provider and dictionaries.

The table and column selector render `header | translate`. The selector searches
and sorts the translated labels and updates when the language changes. No metadata
is overwritten: `field`, cell values, filters, saved views and server-side Excel
exports keep their existing behavior. Other grid UI labels also support translation.

The consuming application loads its dictionaries from JSON files. The demo uses
`src/assets/i18n/es.json`, `en.json`, `fr.json` and `it.json`, copied to `assets/i18n/`
by the existing Angular assets configuration. Keys match the existing backend
headers, so no backend changes are required.

For example, `es.json` contains:

```json
{
  "Username": "Usuario",
  "Age": "Edad"
}
```

Install the loader in the application (the table library only needs core):

```sh
npm install @ngx-translate/core@^17 @ngx-translate/http-loader@^17
```

Configure it once in `app.config.ts`, alongside the existing `provideHttpClient()`:

```ts
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

provideTranslateService({
  lang: 'es',
  fallbackLang: 'en',
  loader: provideTranslateHttpLoader({
    prefix: './assets/i18n/',
    suffix: '.json'
  })
})
```

If the application already uses ngx-translate, reuse its provider and add the
header keys to its existing JSON dictionaries instead of configuring another loader.

Call `TranslateService.use('en')`, `use('es')`, `use('fr')` or `use('it')` to switch languages without fetching
the table configuration again. Missing translations use the fallback language,
then the original key with ngx-translate's default missing-translation handler.

Alternatively, return `header: 'columns.username'` from the backend and define
`{ "columns": { "username": "Usuario" } }` in the Spanish JSON file.

For the complete integration guide, see [Multilanguage column headers](https://github.com/competergiga/ECSPrimengTable/blob/Angular19/README.md#324-multilanguage-column-headers-angular-19).

## Optional navigation state

Set `statePersistence: { enabled: true, key: "people-list" }` in `createTableOptions` to preserve filters, global search, sorting and pagination when returning from a detail page. It is disabled by default. Provide `ECSPrimengTableStateService` on the parent component containing both list and detail routes. Leaving that component clears its in-memory state. Do not provide it at application root or on the list itself.

See the [scope setup and navigation examples](https://github.com/competergiga/ECSPrimengTable/blob/Angular19/README.md#419-optional-state-when-returning-from-a-detail-page).

### Enable or disable

```ts
tableOptions = createTableOptions({
  statePersistence: {
    enabled: true, // Set false or omit this option to disable.
    key: 'people-list'
  }
  // Add your existing endpoints and other table options.
});
```

Register `providers: [ECSPrimengTableStateService]` on a parent component with a
`<router-outlet />` and put both list and detail routes under it. Use Angular
Router navigation between them. An enabled table requires a non-empty key and
this scope provider.

Returning from a detail restores the query and fetches fresh rows. Leaving the
scope for another section discards that query, as does a browser reload. Setting
`enabled` to false does not clear filters currently on screen; it prevents their
preservation for the next navigation. Explicitly saved startup views remain
independent of this option.

The `/home` demo includes a checkbox for enabled/disabled behavior, a row edit
button opening a navigation-only detail and an **Ir a otra sección** link to
leave the scope. Run `npm run test:state` from the frontend workspace for the
automated tests.

## Responsive options

Header and row menus are optional and disabled by default. Enable `responsive.headerMenu` and `responsive.rowMenu`. The optional DTO attribute `VisibleOnlyIn` sets initial visibility by viewport while keeping columns available in the selector.

See [configuration, precedence and examples](../../../../README.md#10-responsive-menus-and-initial-column-visibility).


### Translating all grid interface text

Use the same ngx-translate JSON dictionaries for headers, buttons, tooltips, descriptions, menus, dialogs, validation messages and counters. Built-in texts use their original English string as the key; configurable button labels/tooltips and descriptions may also use your own translation keys. Changing `TranslateService.use('fr')` updates the UI, including open menus and dialogs.

Example entries in `assets/i18n/es.json`:

```json
{
  "Actions": "Acciones",
  "Selected": "Seleccionado",
  "CREATE": "CREAR",
  "--- Select a view ---": "--- Selecciona una vista ---",
  "MODIFY COLUMNS": "MODIFICAR COLUMNAS",
  "Search keyword": "Buscar",
  "Cancel changes": "Cancelar cambios",
  "Save changes": "Guardar cambios",
  "Showing {{count}} records of {{total}} available records": "Mostrando {{count}} registros de {{total}} disponibles",
  "primeng": {
    "startsWith": "Empieza por",
    "contains": "Contiene",
    "clear": "Limpiar",
    "apply": "Aplicar",
    "aria": { "nextPageLabel": "Página siguiente" }
  }
}
```

Keep interpolation names such as `{{count}}` and `{{total}}` unchanged. Missing UI translations fall back to the configured fallback language, then to the original text. Existing applications do not need to add every key at once.

The optional `primeng` section translates PrimeNG controls (filter operators, calendars, pagination and accessibility labels). The grid synchronizes this section with the **shared application PrimeNG configuration**, so it also affects other PrimeNG components. Unspecified entries retain the configuration captured at grid initialization; without this section the grid leaves the application's locale alone. Date formats and table data culture remain separately configured.

The demo provides complete examples in `src/assets/i18n/en.json`, `es.json`, `fr.json` and `it.json`, plus a language selector. Copy/merge the entries you need into your application's dictionaries. No additional npm dependencies are introduced by this extension.

Cell data, predefined-filter values, saved view aliases, user-entered text and backend field identifiers are not translated. A default export filename is translated when opening the export dialog; the filename subsequently entered by the user is preserved. Excel headers generated on the server remain the backend's responsibility.


### Per-item list tooltips

For `DataType.List` columns, `dataTooltipCustomColumnSource` references a semicolon-separated string in the same row. Each tooltip matches the item at the same position. For example:

```text
EmploymentStatusNameList = "Freelance;Military;Student"
ESList_tooltip           = "Independent work;Military service;In education"
```

Set `dataTooltipCustomColumnSource: "ESList_tooltip"` on the `EmploymentStatusNameList` attribute. The auxiliary property can be `string?`, with `dataType: DataType.Text` and `sendColumnAttributes: false`; it needs neither a visible column nor list metadata. The backend includes properties marked `sendColumnAttributes: false` in the returned row data.

This applies to predefined-filter tags and plain text lists. Positions are preserved, including duplicate items and empty entries. Missing properties or positions fall back to the item itself; an empty position suppresses its tooltip. Extra tooltips are ignored. `dataTooltipShow: false` still disables tooltips. Tooltip text remains untranslated data.


### Progress bars

Keep `DataType.Numeric` and set `cellDisplay: CellDisplay.ProgressBar` to display a bar on a 0–100 scale:

```csharp
[ColumnAttributes("Progress", dataType: DataType.Numeric,
    cellDisplay: CellDisplay.ProgressBar, initialWidth: 160)]
public decimal? Progress { get; set; }
```

The backend sends `cellDisplay: 1` in column metadata and a number in row data, for example `"progress": 15.5`. For TypeScript configurations, import `CellDisplay` from the package and use `cellDisplay: CellDisplay.ProgressBar` with `dataType: DataType.Numeric`.

The bar has no inner label; the default tooltip shows `15.5 %`. Both `dataTooltipShow` and `dataTooltipCustomColumnSource` are respected. Zero displays an empty bar; null or nonnumeric values leave the cell empty. Only the visual fill is clamped to 0–100: filtering, sorting and Excel preserve the original number (15.5 exports as 15.5, not 0.155). Decimal values and dynamic metadata via `ColumnMetadataOverrideModel.CellDisplay` are supported.

`CellDisplay.Default` (0), or omitted frontend metadata, preserves existing presentation. `ProgressBar` applies only to numeric columns and takes precedence over predefined-filter tags. Update both the npm and NuGet packages to use this option.

The demo navigation switches between the full people example (`/home`) and progress bars (`/progress`). Each table has separate endpoints and views. The progress demo uses in-memory data in `ProgressDemoController`, independent of the people database.
