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
exports keep their existing behavior. Other UI labels are not translated.

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
