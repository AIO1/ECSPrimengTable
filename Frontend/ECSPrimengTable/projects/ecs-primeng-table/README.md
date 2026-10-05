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
