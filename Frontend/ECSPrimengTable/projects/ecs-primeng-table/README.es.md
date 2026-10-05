> Versión en español. [Read in English](README.md).

# ECS PrimeNG table

Este paquete NPM contiene ECS PrimeNG Table.  
Para consultar la documentación completa, las instrucciones de uso, los ejemplos y las actualizaciones, visita el repositorio oficial de GitHub:
[https://github.com/AIO1/ECSPrimengTable](https://github.com/AIO1/ECSPrimengTable)

> **Nota:** Consulta el README de GitHub para obtener instrucciones detalladas sobre cómo integrar y utilizar este componente en tus proyectos.

<a id="column-header-translations-angular-19"></a>
## Traducción de los encabezados de columna (Angular 19)

Instala `@ngx-translate/core@^17` en la aplicación que utiliza el componente y configura `provideTranslateService` una sola vez entre los proveedores de la aplicación. Si ya utiliza ngx-translate, reutiliza su proveedor y sus diccionarios.

La tabla y el selector de columnas muestran `header | translate`. El selector busca y ordena las etiquetas traducidas, y se actualiza al cambiar de idioma. Los metadatos no se sobrescriben: `field`, los valores de las celdas, los filtros, las vistas guardadas y las exportaciones a Excel del servidor mantienen su comportamiento. Las demás etiquetas de la interfaz también admiten traducción.

La aplicación carga sus diccionarios desde archivos JSON. La demo utiliza `src/assets/i18n/es.json`, `en.json`, `fr.json` e `it.json`, que se copian a `assets/i18n/` mediante la configuración de recursos de Angular. Las claves coinciden con los encabezados actuales del backend, por lo que no es necesario modificarlo.

Por ejemplo, `es.json` contiene:

```json
{
  "Username": "Usuario",
  "Age": "Edad"
}
```

Instala el cargador en la aplicación (la biblioteca de la tabla solo necesita el paquete core):

```sh
npm install @ngx-translate/core@^17 @ngx-translate/http-loader@^17
```

Configúralo una sola vez en `app.config.ts`, junto al `provideHttpClient()` existente:

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

Si la aplicación ya utiliza ngx-translate, reutiliza su proveedor y añade las claves de los encabezados a sus diccionarios JSON, en lugar de configurar otro cargador.

Llama a `TranslateService.use('en')`, `use('es')`, `use('fr')` o `use('it')` para cambiar de idioma sin volver a solicitar la configuración de la tabla. Si falta una traducción, se utiliza el idioma de respaldo y, si tampoco existe allí, se muestra la clave original mediante el comportamiento predeterminado de ngx-translate.

Como alternativa, devuelve `header: 'columns.username'` desde el backend y define `{ "columns": { "username": "Usuario" } }` en el archivo JSON de español.

Consulta la guía completa en [Encabezados de columna multilingües](../../../../README.es.md#324-multilanguage-column-headers-angular-19).

<a id="optional-navigation-state"></a>
## Conservación opcional del estado durante la navegación

Configura `statePersistence: { enabled: true, key: "people-list" }` en `createTableOptions` para conservar los filtros, la búsqueda global, la ordenación y la paginación al volver de una página de detalle. Esta opción está desactivada de forma predeterminada. Proporciona `ECSPrimengTableStateService` en el componente padre que contiene las rutas de lista y detalle. Al salir de ese componente, se elimina el estado almacenado en memoria. No proporciones el servicio en la raíz de la aplicación ni en el propio componente de lista.

Consulta los [ejemplos de configuración del ámbito y navegación](../../../../README.es.md#419-optional-state-when-returning-from-a-detail-page).

<a id="enable-or-disable"></a>
### Activar o desactivar

```ts
tableOptions = createTableOptions({
  statePersistence: {
    enabled: true, // Set false or omit this option to disable.
    key: 'people-list'
  }
  // Add your existing endpoints and other table options.
});
```

Registra `providers: [ECSPrimengTableStateService]` en un componente padre con un `<router-outlet />` y sitúa las rutas de lista y detalle bajo él. Utiliza Angular Router para navegar entre ellas. Para activar esta función, la tabla necesita una clave no vacía y el proveedor del servicio dentro de ese ámbito.

Al volver del detalle, se restaura la consulta y se solicitan los datos actualizados. Al salir del ámbito hacia otra sección, se descarta la consulta, al igual que al recargar el navegador. Establecer `enabled` en `false` no borra los filtros que aparecen en pantalla: impide que se conserven para la siguiente navegación. Las vistas de inicio guardadas explícitamente son independientes de esta opción.

La demo de `/home` incluye una casilla para activar o desactivar este comportamiento, un botón de edición de fila que abre un detalle destinado a probar la navegación y un enlace **Ir a otra sección** para salir del ámbito. Ejecuta `npm run test:state` desde el directorio de trabajo del frontend para ejecutar las pruebas automatizadas.

## Opciones responsive

Los menús de cabecera y fila son opcionales y están desactivados por defecto. Actívalos con `responsive.headerMenu` y `responsive.rowMenu`. El atributo opcional `VisibleOnlyIn` del DTO define la visibilidad inicial por tamaño y mantiene las columnas disponibles en el selector.

Consulta [configuración, prioridades y ejemplos](../../../../README.es.md#10-menús-adaptables-y-visibilidad-inicial-de-columnas).


### Traducir todos los textos de la interfaz del grid

Utiliza los mismos JSON de ngx-translate para cabeceras, botones, tooltips, descripciones, menús, ventanas, mensajes de validación y contadores. Los textos incorporados utilizan su cadena original en inglés como clave; las etiquetas y tooltips de botones configurables y las descripciones también admiten claves propias. Al llamar a `TranslateService.use('fr')` se actualiza la interfaz, incluidos los menús y ventanas abiertos.

Ejemplo de entradas en `assets/i18n/es.json`:

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

Conserva los nombres de interpolación como `{{count}}` y `{{total}}`. Si falta una traducción, se utiliza el idioma de respaldo y después el texto original. Las aplicaciones existentes no necesitan añadir todas las claves de golpe.

La sección opcional `primeng` traduce los controles de PrimeNG (operadores de filtro, calendarios, paginación y etiquetas de accesibilidad). El grid sincroniza esta sección con la **configuración compartida de PrimeNG de la aplicación**, por lo que también afecta a otros componentes PrimeNG. Las entradas omitidas conservan la configuración capturada al inicializar el grid; si no incluyes esta sección, el grid respeta la configuración de idioma de la aplicación. Los formatos de fecha y la cultura de los datos de la tabla se configuran por separado.

La demo incluye ejemplos completos en `src/assets/i18n/en.json`, `es.json`, `fr.json` e `it.json`, además de un selector de idioma. Copia o combina las entradas necesarias con los diccionarios de tu aplicación. Esta ampliación no añade dependencias npm.

No se traducen los datos de las celdas, los valores de filtros predefinidos, los nombres de vistas guardadas, los textos introducidos por el usuario ni los identificadores de campos del backend. El nombre predeterminado del fichero Excel se traduce al abrir su ventana; después se respeta el nombre introducido por el usuario. Las cabeceras del Excel generado en el servidor siguen siendo responsabilidad del backend.
