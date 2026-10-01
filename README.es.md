> Versión en español. [Read in English](README.md).

[![NuGet Version](https://img.shields.io/nuget/v/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)

[![npm version](https://img.shields.io/npm/v/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
[![npm downloads](https://img.shields.io/npm/dm/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
<a id="ecs-primeng-table"></a>
# ECS PrimeNG Table
Una solución creada por Alex Ibrahim Ojea que mejora la tabla PrimeNG con filtros avanzados y funcionalidad ampliada, delegando toda lógica de consulta y filtrado al motor de base de datos. El frontend está construido con componentes Angular 21 y PrimeNG 21, mientras que el backend es una API .NET 10 (ASP.NET) conectada a Microsoft SQL Server, fácilmente adaptable a otras bases de datos. Este enfoque evita la sobrecarga de servidor y frontend manipulando el filtrado y paging dinámicamente en la base de datos, e incluye características tales como visibilidad de la columna, filtros de columna, vistas personalizadas y más.

<br><br><br>


---
<a id="introduction"></a>
## Introducción
¡Hola! Me llamo Alex Ibrahim Ojea.

Este proyecto se creó para ofrecer una tabla PrimeNG eficiente y reutilizable en aplicaciones Angular. A diferencia del enfoque predeterminado de PrimeNG, que requiere cargar todos los datos en el frontend, esta implementación delega el filtrado, la ordenación y la paginación directamente en el motor de base de datos, lo que permite trabajar con grandes conjuntos de datos de forma eficiente.

El objetivo es hacer que sea simple integrar una tabla potente, flexible y de buen aspecto en sus aplicaciones sin sobrecargar el frontend o el servidor.

Algunas de las características clave incluidas son:
- paginación dinámica con carga diferida
- Ordenación por varias columnas
- Filtros avanzados y predefinidos
- Búsqueda global
- Cambio de tamaño, reordenación, visibilidad y descripciones de columnas
- Celdas personalizables (alineación, desbordamiento, información sobre herramientas, ...)
- Estilos condicionales de las filas
- Vistas de tabla para guardar configuraciones
- ¡Y mucho más!

Un vídeo que muestra una visión general de algunas de las características se puede encontrar en el siguiente enlace: [Video de YouTube](https://youtu.be/06jZPS3m8fA)  
Esta es una imagen de ejemplo de la solución final:
<p align="center">
	<img width="1918" height="992" alt="Example table" src="https://github.com/user-attachments/assets/5c7f4016-a0f4-4af1-b5da-53afdb615012" />
</p>

<br><br><br>


---
<a id="improving-documentation-readability"></a>
## Cómo facilitar la lectura de la documentación
Para una experiencia de lectura más clara en GitHub, se recomienda navegar primero a la ruta de archivo [README](README.es.md) y luego **collapse el árbol de archivos** (haciendo clic en el icono en la esquina superior izquierda).  
A continuación, seleccione el botón **Outline** en la esquina superior derecha para mostrar un índice que contiene todas las secciones de la documentación.  

Seguir estos pasos proporciona una manera más conveniente de navegar y revisar la documentación.
<p align="center">
    <img width="1899" height="965" alt="Improving documentation readability" src="https://github.com/user-attachments/assets/822794d2-dab7-4b49-bbdc-703bf4c094ca" />
</p>

<br><br><br>



---
<a id="1-required-software"></a>
## 1 Software necesario
Para ejecutar este proyecto, necesitará:
- [Visual Studio Code](https://code.visualstudio.com/Download) – para el desarrollo de frontend.
- [Visual Studio 2026](https://visualstudio.microsoft.com/downloads/) – para el desarrollo de API de backend con ASP.NET Core. Asegúrese de instalar la carga de trabajo **ASP.NET** y **.NET 10 framework**.
- [Node.js](https://nodejs.org/en/download/package-manager) – para ejecutar la aplicación Angular. Se recomienda gestionar versiones de Nodo con [NVM](https://github.com/nvm-sh/nvm).
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) – el motor de bases de datos utilizado para consultas. Opcional, se puede reemplazar con otros motores con ajustes de código menores.
- (Opcional) [DBeaver](https://dbeaver.io/download/) – Un GUI para la gestión de bases de datos que funciona con múltiples motores. Puedes usar otras herramientas, pero esta es la que normalmente uso.

<br><br><br>



---
<a id="2-setup-the-environment-to-try-the-demo"></a>
## 2 Preparación del entorno para probar la demo
<a id="21-database-mssql"></a>
### 2.1 Base de datos (MSSQL)
Este ejemplo se ha establecido utilizando **MSSQL**. Otros motores de bases de datos deben trabajar con algunas modificaciones, pero esta guía sólo cubre MSSQL.
Primero, crea una nueva base de datos llamada `primengtablereusablecomponent`. La base de datos debe tener un esquema llamado `dbo`. Puede utilizar una base de datos o un nombre de esquema diferente, pero tendrá que adaptar los scripts de backend y base de datos en consecuencia.
Una vez que la base de datos y el esquema estén listos, descargue todos los scripts de base ubicados bajo [este camino](Database%20scripts). Ejecute los scripts en orden (comenzando con `00`):
- <ins>**00 Crear EmpleoEstatusCategorías.sql**</ins>: Crea la tabla `EmploymentStatusCategories`, que contiene todas las categorías de empleo posibles utilizadas en el ejemplo de filtro predefinido.
- <ins>**01 Populate EmploymentStatusCategorías.sql**</ins>: Inserta los registros iniciales en los `EmploymentStatusCategories` tabla.
- <ins>**02 Crear TestTable.sql**</ins>: Crea la tabla utilizada para la prueba, conteniendo los datos principales mostrados en el frontend.
- <ins>**03 Populate TestTable.sql**</ins>: Insertar datos de muestra en `TestTable`. Este script puede ser ligeramente modificado para generar diferentes datos aleatorios.
- <ins>**04 FormatoFechaConCulture.sql**</ins> (opcional): Crea una función de base de datos utilizada por el backend para permitir la búsqueda global en las columnas de fecha, formateándolas como texto con la misma máscara, zona horaria y local como en el frontend.
- <ins>**05 SaveTableViews.sql**</ins>: Crea una tabla de ejemplo para almacenar las vistas de tabla definidas por el usuario. Esto sólo es necesario si usted está utilizando la base de datos para guardar puntos de vista en lugar de navegador o almacenamiento de sesión.

Después de ejecutar todos los scripts con éxito, usted debe tener:  
- Dos tablas pobladas (`EmploymentStatusCategories` y `TestTable`).
- Una tabla vacía (`TableViews`).
- Una función (`FormatDateWithCulture`).

La siguiente imagen muestra el diagrama ER de todas las tablas:
<p align="center">
    <img width="1132" height="526" alt="ER diagram of example project" src="https://github.com/user-attachments/assets/63762420-6204-4b10-8486-987ec8ca95eb" />
</p>

<br><br>



<a id="22-backend-api-in-aspnet"></a>
### 2.2 Backend (API en ASP.NET)
> [!NOTE]  
> Puede utilizar otras versiones .NET con los paquetes correspondientes. La solución debe seguir funcionando sin problemas.



<a id="221-open-the-project"></a>
#### 2.2.1 Abrir el proyecto
Utilizando **Visual Studio 2026**, abre la solución backend ubicada en [este camino](Backend). Asegúrese de que la carga de trabajo **ASP.NET** y **.NET 10 framework** están instalados. Si falta algún componente, utilice el **Visual Studio Installer** para añadirlo.

<br><br>



<a id="222-update-the-database-connection-string"></a>
#### 2.2.2 Actualizar la cadena de conexión a la base de datos
> [!NOTE]  
> Si sigue la instalación predeterminada de MSSQL y configura la base de datos como `primengtablereusablecomponent` con un esquema llamado `dbo` y sin autenticación, puede saltar este paso. De lo contrario, siga estas instrucciones cuidadosamente para evitar problemas de conexión.

A continuación, actualice la configuración de la base de datos para su API de backend. Abra el archivo [appsettings.Development.json](Backend/ECSPrimengTableExample/appsettings.Development.json) y asegúrese de que la cadena de conexión bajo `"DB_primengtablereusablecomponent"` coincida con su configuración.
Si cambia el nombre identificador de la cadena de conexión en `appsettings.json`, recuerde actualizarlo en consecuencia en [Program.cs](Backend/ECSPrimengTableExample/Program.cs).

<br><br>



<a id="223-scaffolding-the-database"></a>
#### 2.2.3 Generar el modelo a partir de la base de datos
> [!NOTE]  
> Este paso es opcional y sólo se necesita si modifica la estructura de la base de datos, desea generar el `DbContext` o modelos en una ubicación diferente, o planea utilizar un motor de base que no sea MSSQL.

Para realizar el andamio, abra el **Package Manager Console** en Visual Studio y navega (`cd`) a la carpeta raíz del proyecto (donde se encuentra el archivo `.sln`).
Una vez en la carpeta del proyecto, ejecute el siguiente comando (asumiendo que su base de datos se llama `primengtablereusablecomponent`, usted está utilizando SQL Server, y desea colocar el `DbContext` y modelos en las mismas ubicaciones que en el código de ejemplo):
```sh
dotnet ef dbcontext scaffold name=DB_primengtablereusablecomponent Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --context-dir DBContext --namespace Models.PrimengTableReusableComponent --context-namespace Data.PrimengTableReusableComponent --context primengTableReusableComponentContext -f --no-onconfiguring
```

Estos son los cambios comunes que usted puede necesitar para hacer en el comando:
- `name=DB_primengtablereusablecomponent`: Cambia solo si modificas el nombre de la cadena de conexión en `appsettings.Development.json`.
- `Microsoft.EntityFrameworkCore.SqlServer`: Cambie esto al paquete apropiado del proveedor si está usando un motor de base diferente.
- `--output-dir`: Especifica dónde se generarán los modelos. En este ejemplo, se generarán en la carpeta `Models` (creada automáticamente si no existe).
- `--context-dir`: Especifica dónde se generará el `DbContext`. Aquí se creará en una carpeta llamada `DBContext` (creada automáticamente si no existe).
- `--namespace` y `--context-namespace`: Establecer los espacios de nombres para los modelos y el `DbContext`, respectivamente.
- `--context`: establece el nombre del `DbContext`. En este ejemplo, será `primengTableReusableComponentContext`.
- `-f`: Las fuerzas sobrescriben los archivos existentes.
- `--no-onconfiguring`: Indica el proceso de andamio para no configurar la conexión en el `DbContext`. En este ejemplo, la conexión se gestiona a través del archivo `appsettings.Development.json`.

<br><br>



<a id="224-api-first-run"></a>
#### 2.2.4 Primera ejecución de la API
Después de completar los pasos anteriores, ahora debe ser capaz de ejecutar la API y verificar que todo funciona antes de pasar a la frontend. En Visual Studio 2022, haga clic en el botón **Play** verde en la barra superior. La API comenzará, y después de unos momentos, debe aparecer una página web.
Si todo está funcionando correctamente, debe ver la documentación de API generada por **Swagger** con algunos puntos finales de prueba. A continuación, hay una sección **Schemas** que muestra todos los esquemas detectados por Swagger durante la generación de documentación.
Para probar que los puntos finales de API y la comunicación de bases de datos están funcionando, realice una prueba rápida con el método `Main/GetEmploymentStatus` GET (es fácil de probar y no requiere parámetros):
1. Haga clic en **Try out** bajo el método.
2. Haga clic en **Execute**.
Una vez ejecutado, debe recibir una respuesta **200** con un cuerpo similar a lo siguiente:
```json
[
  { "statusName": "Contract", "colorR": 100, "colorG": 200, "colorB": 0 },
  { "statusName": "Freelance", "colorR": 0, "colorG": 150, "colorB": 0 },
  { "statusName": "Full-time", "colorR": 0, "colorG": 200, "colorB": 0 },
  { "statusName": "Intern", "colorR": 0, "colorG": 150, "colorB": 0 },
  { "statusName": "Military", "colorR": 0, "colorG": 200, "colorB": 100 },
  { "statusName": "On leave", "colorR": 200, "colorG": 200, "colorB": 0 },
  { "statusName": "Other", "colorR": 200, "colorG": 125, "colorB": 0 },
  { "statusName": "Part-time", "colorR": 50, "colorG": 200, "colorB": 0 },
  { "statusName": "Retired", "colorR": 0, "colorG": 50, "colorB": 0 },
  { "statusName": "Self-employed", "colorR": 0, "colorG": 200, "colorB": 50 },
  { "statusName": "Student", "colorR": 0, "colorG": 100, "colorB": 0 },
  { "statusName": "Temporary", "colorR": 150, "colorG": 200, "colorB": 0 },
  { "statusName": "Unemployed", "colorR": 200, "colorG": 0, "colorB": 0 },
  { "statusName": "Volunteer", "colorR": 0, "colorG": 200, "colorB": 50 }
]
```
Si ves estos resultados, significa que tu API se está ejecutando correctamente y se está comunicando con la base de datos, ya que estos puntos finales de GET recuperan datos directamente de ella.
Tome nota del número **port** en la URL de la API, ya que será necesario más adelante para configurar el frontend.

<br><br>



<a id="23-frontend-angular-project-using-primeng-components"></a>
### 2.3 Frontend (proyecto Angular con componentes PrimeNG)
> [!NOTE]  
> Puede utilizar otras versiones Angular y PrimeNG actualizando las dependencias `package.json` correspondientes. La solución todavía debe funcionar, pero tenga en cuenta que PrimeNG podría introducir cambios de estilo de ruptura que pueden afectar la apariencia o el comportamiento del componente.

Esta sección supone que ha completado los pasos anteriores para configurar la base de datos y API.
Antes de proceder, asegúrese de que **Node.js** esté instalado (a través del instalador `.msi` o `.exe`, o utilizando **NVM**), ya que se necesita para ejecutar la aplicación de frontend localmente.

Para ejecutar la demo de frontend, abra el [carpeta de frontend](Frontend/ECSPrimengTable) en **Visual Studio Code**. Asegúrese de que su API se está ejecutando en el puerto esperado (como se indica en los pasos anteriores).

Para confirmar que el frontend apunta al punto final correcto de API, abra [constantes.ts](Frontend/ECSPrimengTable/src/constants.ts) y compruebe la función `getApiBaseUrl`. En el modo de desarrollo, debe devolver algo como:
```ts
"https://localhost:7020/"
```
Asegúrese de que el puerto coincida con su API. Si difiere, actualice el valor y guarde el archivo.

> [!IMPORTANT]  
> Siempre verifique que `getApiBaseUrl` apunta al puerto de API correcto antes de continuar con esta sección.

Desde **Visual Studio Code**, abre un nuevo terminal (asegúrese de que está utilizando **CMD** y no PowerShell u otro shell) y navega al [carpeta raíz del proyecto de frontend](Frontend/ECSPrimengTable) utilizando el comando `cd`. Una vez en la carpeta correcta, ejecute el siguiente comando:
```sh
npm install
```
> [!TIP]  
> Puede agregar la bandera `--verbose` al final (`npm install --verbose`) para obtener una salida más detallada durante el proceso de instalación.

Este comando descargará todas las dependencias necesarias para el proyecto frontend. Una vez que haya terminado de ejecutar y si todo salió bien, asegúrese de que su API está funcionando correctamente, ejecute el siguiente comando en el terminal:
```sh
ng build ecs-primeng-table
```
Este comando utilizará **ng-packagr** para construir un paquete local en la carpeta `dist`, basado en el contenido de `projects\ecs-primeng-table` (el componente de tabla reutilizable).  

Una vez que el paquete ha sido construido con éxito, puede iniciar la aplicación web ejecutando el siguiente comando en la terminal:

```sh
ng serve -o
```
> [!TIP]  
> `ng serve` sin la bandera `-o` también funciona, pero no abrirá una pestaña del navegador automáticamente. Usted tendrá que navegar manualmente a la URL donde se sirve la página web.

Después de unos segundos, una nueva pestaña en su navegador web debe abrir, mostrando la tabla totalmente funcional.

¡Si has alcanzado este paso, felicidades! Usted ha establecido con éxito y comenzó el proyecto de demostración! :smile:

<br><br><br>



---
<a id="3-integrating-into-a-project"></a>
## 3 Integración en un proyecto
Esta sección proporciona una guía paso a paso sobre cómo integrar el **ECS PrimeNG Table** en un proyecto nuevo o ya existente.



<a id="31-backend-requirements"></a>
### 3.1 Requisitos del backend
> [!NOTE]  
> El paquete **ECS PrimeNG Table** está construido para .NET 10, pero también debe funcionar perfectamente con nuevas versiones .NET.

Si ya está trabajando en un proyecto **.NET 10 (o superior)**, necesitará instalar el paquete compilado backend de NuGet (descargar la versión más reciente es recomendable).  
[ECS.PrimeNGTable on NuGet](https://www.nuget.org/packages/ECS.PrimeNGTable)

Además, asegúrese de que se instalen las siguientes dependencias necesarias:
- **ClosedXML** (conferencia= 0.105.0)
- **LinqKit** (conferencia= 1.3.0)
- **Microsoft.EntityFrameworkCore** (seguro= 10.0.0)
- **System.Linq.Dynamic.Core** (seguro= 1.7.0)

> [!TIP]
> Siempre puedes consultar las últimas versiones de dependencia visitando:  
`https://www.nuget.org/packages/ECS.PrimeNGTable/<version>#dependencies-body-tab`  
(Reemplazar `<version>` con la versión específica del paquete que está descargando, por ejemplo, `8.0.1`).

Con estas dependencias en su lugar y el paquete instalado, su backend está listo para usar el **ECS PrimeNG Table**.

<br><br>



<a id="32-frontend-requirements"></a>
### 3.2 Requisitos del frontend



<a id="321-installing-the-package-and-peer-dependencies"></a>
#### 3.2.1 Instalación del paquete y sus dependencias pares
> [!NOTE]  
> El paquete **ECS PrimeNG Table** está construido para Angular 21 con componentes PrimeNG 21. Aunque puede funcionar con versiones más nuevas, la compatibilidad no está garantizada, ya que PrimeNG introduce con frecuencia cambios de ruptura en sus componentes.

Si ya está trabajando en un proyecto **Angular 21**, puede comprobar el paquete compilado de frontend en NPM aquí:  
[@eternalcodestudio/primeng-table on NPM](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)

Para instalar el paquete, abra una terminal en la carpeta raíz de su proyecto y ejecute el siguiente comando (descargar la última versión es recomendable).

```sh
npm install @eternalcodestudio/primeng-table
```

Además, asegúrese de que las siguientes dependencias requeridas estén instaladas en su proyecto:
- **@angular/common** (conferencia=21.0.0)
- **@angular/core** (conferencia=21.0.0)
- **primeng** (conferencia=21.0.0)
- **primeicons** (conferencia=7.0.0)

> [!CAUTION]  
> Estas son las dependencias **peer** y son **not instalados automáticamente**. Si su proyecto ya no los incluye, debe instalarlos por separado utilizando NPM.

<br><br>



<a id="322-configure-angular-locales"></a>
#### 3.2.2 Configurar los idiomas y formatos regionales de Angular
El componente **ECS PrimeNG Table** se basa en **DatePipe** de Angular para renderizar celdas de fecha.  
Para asegurar el formato correcto, usted debe importar y registrar el locale(s) que usted planea utilizar en su aplicación.

Ejemplo para inglés locale (`en`):
```ts
import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);
```
Remeber para incluir también `DatePipe` en su `providers`.

Este paso es necesario antes de usar la tabla. Si el local no está correctamente registrado, las celdas de fecha de renderizado pueden fallar e impedir que la tabla se muestre correctamente.  

Puede incluir esta configuración a nivel global (por ejemplo, `app.module.ts` o `app.config.ts`) o a un nivel más local, dependiendo de su estructura de aplicación.

<br><br>



<a id="323-required-services-for-ecs-primeng-table"></a>
#### 3.2.3 Servicios necesarios para ECS PrimeNG Table
El paquete **ECS PrimeNG Table** define dos servicios abstractos que necesita implementar en su proyecto:
- **ECSPrimengTableHtpService**: maneja las solicitudes HTTP para la tabla (GET y POST).
- **ECSPrimengTableNotificaciónService**: maneja notificaciones (toastas) para la tabla.

Estos servicios son abstractos, lo que significa que el paquete no sabe cómo desea manejar las solicitudes o notificaciones de HTTP en su proyecto. Necesitas crear tus propias implementaciones.

<br><br>



<a id="example-http-service"></a>
###### Ejemplo: servicio HTTP
En su proyecto, cree una clase que extiende `ECSPrimengTableHttpService` e implementa sus métodos abstractos.  

En este ejemplo, la implementación utiliza los principales servicios proporcionados por `SharedService`.
```ts
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ECSPrimengTableHttpService } from '@eternalcodestudio/primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class HttpService extends ECSPrimengTableHttpService {
  constructor(private sharedService: SharedService) {
    super();
  }

  handleHttpGetRequest<T>(
    servicePoint: string,
    responseType: 'json' | 'blob' = 'json'
  ): Observable<HttpResponse<T>> {
    return this.sharedService.handleHttpGetRequest(servicePoint, null, true, null, false, responseType);
  }

  handleHttpPostRequest<T>(
    servicePoint: string,
    data: any,
    httpOptions: HttpHeaders | null = null,
    responseType: 'json' | 'blob' = 'json'
  ): Observable<HttpResponse<T>> {
    return this.sharedService.handleHttpPostRequest(servicePoint, data, httpOptions, true, null, false, responseType);
  }
}
```

<br><br>



<a id="example-notification-service"></a>
###### Ejemplo: servicio de notificaciones
Del mismo modo, usted necesita crear una clase que extiende `ECSPrimengTableNotificationService` e implementa sus métodos abstractos.

En este ejemplo, la aplicación se basa en los principales servicios prestados por `SharedService`.
```ts
import { Injectable } from '@angular/core';
import { ECSPrimengTableNotificationService } from '@eternalcodestudio/primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ECSPrimengTableNotificationService {
  constructor(private sharedService: SharedService) {
    super();
  }

  showToast(severity: string, title: string, message: string): void {
    this.sharedService.showToast(severity, title, message, 5000, false, false, false);
  }

  clearToasts(): void {
    this.sharedService.clearToasts();
  }
}
```

<br><br>



<a id="registering-the-services"></a>
###### Registro de los servicios
Por último, registre sus implementaciones en su sistema de inyección de dependencia (por ejemplo, en `app.config.ts`):
```ts
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '@eternalcodestudio/primeng-table';
export const appConfig: ApplicationConfig = {
  providers: [
    ...
    { provide: ECSPrimengTableNotificationService, useClass: NotificationService },
    { provide: ECSPrimengTableHttpService, useClass: HttpService },
    ...
  ]
}
```
Esto indica el paquete **ECS PrimeNG table** para utilizar sus servicios personalizados para tramitar las solicitudes y notificaciones de HTTP.

<br><br><br>



<a id="324-multilanguage-column-headers-angular-19"></a>
#### 3.2.4 Encabezados de columna multilingües (Angular 19)

Este fork permite traducir los encabezados de columna mediante **ngx-translate**. La aplicación que utiliza el componente gestiona la configuración del idioma y los diccionarios JSON. El componente renderiza el `header` de cada columna de backend usando `header | translate`.

La traducción se aplica a los nombres de columna en la cuadrícula y en el selector de columnas. El selector busca nombres traducidos y, cuando `columns.selectorOrderByColumnName` está habilitado, ordena por esos nombres. Cambiar el lenguaje actualiza las etiquetas sin buscar la configuración de la tabla de nuevo.

**Instalar las dependencias**

Para esta rama Angular 19, instalar ngx-translate v17 en la aplicación que consume:

```sh
npm install @ngx-translate/core@^17 @ngx-translate/http-loader@^17
```

La biblioteca requiere `@ngx-translate/core`. La aplicación utiliza `@ngx-translate/http-loader` para cargar archivos JSON. Si su aplicación ya configura ngx-translate, reutiliza sus proveedores y diccionarios existentes.

**Crear los archivos de idioma**

La demo incluye estos diccionarios:

| Idioma | Archivo |
|---|---|
| Inglés | [en.json](Frontend/ECSPrimengTable/src/assets/i18n/en.json) |
| Español | [es.json](Frontend/ECSPrimengTable/src/assets/i18n/es.json) |
| Francés | [fr.json](Frontend/ECSPrimengTable/src/assets/i18n/fr.json) |
| Italiano | [it.json](Frontend/ECSPrimengTable/src/assets/i18n/it.json) |

Utilice el `header` exacto devuelto por el backend como la clave JSON. Por ejemplo, el backend existente envía `header: "Username"`.

`src/assets/i18n/es.json`:

```json
{
  "Username": "Usuario",
  "Age": "Edad",
  "Employment status": "Situación laboral",
  "Employment status list": "Lista de situaciones laborales",
  "Birthdate": "Fecha de nacimiento",
  "Payed taxes?": "¿Impuestos pagados?"
}
```

En `en.json`, el mismo mapa de claves a sus etiquetas en inglés, como `"Username": "Username"`. Mantener las claves idénticas en todos los archivos de idioma; sólo traducir los valores. No se necesitan cambios de backend con este enfoque.

Asegúrese de que los diccionarios se copian en la compilación de la aplicación. Esta demostración ya incluye `"src/assets"` en su matriz `angular.json` build `assets`. En otra aplicación, configure una asignación equivalente de activos para que los archivos sean servidos en `assets/i18n/<language>.json`.

**Configure la aplicación que consume**

Agregue el proveedor de traducción a sus proveedores `app.config.ts` existentes, preservando su router, PrimeNG y otros proveedores de aplicaciones:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      lang: 'es',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })
  ]
};
```

Si `provideHttpClient()` ya está configurado con interceptores u otras opciones, mantenga esa configuración existente en lugar de agregarla de nuevo. El componente de tabla utiliza el servicio de traducción de la aplicación; no configura un cargador separado.

Vea el [app.config.ts](Frontend/ECSPrimengTable/src/app/app.config.ts) de la demo para la configuración completa.

**Cambiar el idioma**

Establecer `lang` a `'en'`, `'es'`, `'fr'` o `'it'` para elegir el idioma de inicio. Para cambiar mientras la aplicación se está ejecutando, inyecte `TranslateService` en su componente y llame a `use()`:

```ts
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Inside your application component class:
private readonly translate = inject(TranslateService);

changeLanguage(language: 'en' | 'es' | 'fr' | 'it'): void {
  this.translate.use(language);
}
```

Por ejemplo, conecte el selector de idioma a `changeLanguage('fr')`. El cargador solicita el diccionario francés y la tabla actualiza sus nombres de columna.

**Utilizar claves de traducción semánticas**

Para nuevas APIs, también puede devolver una clave como `header: "columns.username"` mientras mantiene `field: "username"` sin cambios. Definir la entrada correspondiente del diccionario:

```json
{
  "columns": {
    "username": "Usuario"
  }
}
```

Para el backend .NET, esto se puede configurar con `[ColumnAttributes("columns.username")]`. Elija los encabezados literales o las claves semánticas y utilice las claves correspondientes en los diccionarios.

**Idioma de respaldo y alcance de la traducción**

Si falta una clave en el lenguaje activo, ngx-translate intenta `fallbackLang`. Con el controlador de traducción predeterminado, una clave que falta en ambos idiomas se muestra como-es. Todos los archivos de lenguaje configurados todavía deben existir y ser válidos JSON; fallback no es un reemplazo para fijar solicitudes HTTP fallidas.

Sólo las etiquetas de la columna de backend `header` se traducen. Los valores de las celdas, descripciones, botones, los encabezados de acción/selección incorporados y otro texto de interfaz mantienen su comportamiento existente. El formato de la fecha sigue usando la configuración de la fecha de la tabla. Se conservan metadatos originales, identificadores de campo, solicitudes de filtrado y vistas guardadas. Los encabezados de Excel generados por el servidor no se traducen por esta función de frontend.

Para comprobar la demo, carguela en español y verifique que `Username` aparece como `Usuario`. Abre **Modify columns** y busca `Usuario`. Luego cambia el idioma activo y verifica las etiquetas de nuevo.

<br><br><br>

---

<a id="4-functional-overview"></a>
## 4 Descripción funcional
El objetivo de esta sección es proporcionar una visión general de nivel **usuario** de todas las características incluidas en la tabla **ECS PrimeNG**. Le permite comprender rápidamente lo que la tabla puede ofrecer y cómo estas funcionalidades se pueden utilizar en sus proyectos. Esta sección proporciona una visión clara, a simple vista de todo lo disponible sin bucear en código.

<br><br>



<a id="41-planning-your-table"></a>
### 4.1 Planificación de la tabla
Antes de sumergirse en características avanzadas, es esencial comenzar con los conceptos básicos y planificar cuidadosamente su diseño de tabla. Esto asegurará que la tabla se ajuste a las necesidades de sus usuarios y a los requisitos de su aplicación. Utilice las siguientes preguntas como guía:

**Columnas**
- ¿Qué columnas quiero incluir en la tabla?
- ¿Deberían ser visibles todas las columnas por defecto, o algunas serán ocultadas inicialmente?
- ¿Hay columnas que siempre deben permanecer visibles y no pueden ocultarse?
- ¿Qué alineación horizontal y vertical debe tener cada columna?
- ¿Cómo debe manejarse el desbordamiento de contenidos en cada columna (por ejemplo, envoltura, truncate)?
- ¿Qué columnas deben permitir ordenar: todas, algunas o ninguna?
- ¿Qué columnas deben permitir el filtrado: todas, algunas o ninguna?
- ¿Pueden los usuarios cambiar la posición de las columnas a través de arrastrar y soltar?
- ¿Alguna columna va a ser congelada (fijada) en el lado izquierdo o derecho?
- ¿Hay columnas que deben ser visibles solamente a roles específicos de usuario o niveles de permiso?

**Filas**
- ¿Alguna fila necesita un formato condicional basado en los valores de una columna específica?
- ¿Qué acciones debo permitir por fila? ¿Hay botones de acción habilitados o deshabilitados en función de ciertas condiciones?
- ¿Se pueden seleccionar filas (y una acción realizada en selecto)?
- ¿Pueden los usuarios seleccionar varias filas, filtrar por filas seleccionadas, o realizar acciones en múltiples selecciones (el selector de casilla de verificación de la hoja)?

**Funciones globales de la tabla**
- ¿Se necesitan medidas de nivel de tabla, como crear registros?
- ¿Cómo se mostrarán las fechas en la tabla?
- ¿Los usuarios podrán personalizar el formato de fecha?
- ¿Debería la tabla permitir a los usuarios reajustarlo a su estado original?
- ¿Estará disponible un filtro global para la tabla?
- ¿Debería el soporte de tabla exportar datos a Excel?
- ¿Podrán los usuarios guardar su configuración de tabla? En caso afirmativo, ¿debería ser persistente en los períodos de sesiones o únicamente en el actual período de sesiones?
- ¿Debería la tabla incluir una descripción? Si es así, ¿se debe mostrar como un elemento de herramienta o como texto en línea junto al icono de información?  
- ¿La tabla requiere una leyenda para proporcionar una explicación centralizada para las columnas que comparten significados similares, o para aclarar el uso de iconos y códigos de color?

<br>

No te preocupes si algunos de estos conceptos no están claros en este punto, cada característica se explicará individualmente en detalle en las secciones siguientes.

> [!NOTE]  
> Esta solución sólo funciona con datos que ya se han persistido en la base de datos.
> Es **not intended** para manejar los datos actualmente siendo editados en memoria en el frontend y aún no guardados en la base de datos.

<br><br>



<a id="42-date-formatting"></a>
### 4.2 Formato de fechas
A primera vista, el formato de la fecha puede parecer sencillo, pero puede convertirse rápidamente en una fuente de confusión para los usuarios finales si no se planifica de forma pensada desde el principio.

El componente **ECS PrimeNG Table** le da control completo sobre cómo se muestran las fechas. Puede definir una configuración **global** que se aplica a todas las columnas de fecha en una tabla, o **override** en el nivel de columna cuando necesita un formato más específico. Esto le permite personalizar:
- **Format**: Esto define cómo se mostrará la fecha y hora al usuario.  
  Por ejemplo, `"dd-MMM-yyyy HH:mm:ss zzzz"` significa:
  - `dd` → día del mes (01-31).
  - `MMM` → nombre corto del mes (Jan, Feb, etc.).
  - `yyyy` → año completo (2025).
  - `HH:mm:ss` → horas, minutos y segundos en formato 24 horas.
  - `zzzz` → nombre de la zona horaria o offset.

  La tabla a continuación resume los símbolos que puede utilizar al definir el **Format** para fechas.

  **Nota:** No todos los símbolos están garantizados para comportarse de forma consistente en la parte delantera, ya que algunos pueden ser interpretados de manera diferente por componentes Angulares u otros componentes del lado cliente o exportaciones a Excel. Siempre prueba tu formato elegido en la interfaz de usuario.
  
<div align="center">

| Signatura | Significado | Ejemplo |
|--------|---------|---------|
| `d` | Día del mes, sin plomo cero | 1–31 |
| `dd` | Día del mes, con cero líder | 01–31 |
| `ddd` | Día Abreviado de la semana | Mon, Tue |
| `dddd` | Día completo de la semana | Lunes, martes |
| `M` | Mes, no hay cero líder | 1–12 |
| `MM` | Mes, con cero líder | 01–12 |
| `MMM` | Nombre del mes Abreviado | Jan, Feb |
| `MMMM` | Nombre del mes completo | Enero, febrero |
| `yy` | Año, dos dígitos | 25 |
| `yyyy` | Año, cuatro dígitos | 2025 |
| `h` | Hora en formato de 12 horas, sin cero líder | 1–12 |
| `hh` | Hora en formato de 12 horas, con cero líder | 01–12 |
| `H` | Hora en formato 24 horas, sin cero líder | 0–23 |
| `HH` | Hora en formato 24 horas, con cero líder | 00–23 |
| `m` | Minuto, no hay cero líder | 0–59 |
| `mm` | Minuto, con cero líder | 00–59 |
| `s` | Segundo, no hay cero líder | 0–59 |
| `ss` | Segundo, con cero líder | 00–59 |
| `f`–`fffffff` | Segundos fraccionados (tentos, centésimas, milisegundos...) | 1 → 0.1s, 123 → 0.123s |
| `t` | Primer personaje de AM/PM | A o P |
| `tt` | Diseñador completo de AM/PM | AM, PM |
| `K` | Zona horaria offset (`Z` para UTC o +02:00) | +02:00 |
| `zzzz` | Zona de tiempo offset con minutos | +02:00 |
| `zz` | Zona horaria offset, horas solamente | +02 |

</div>

- **Time zone**: Esto especifica la zona horaria que se utilizará para mostrar la fecha/hora.  
  Por ejemplo, `"+00:00"` es UTC (Tiempo Universal coordinado). Cambiar esto ajustará el tiempo mostrado a la zona deseada.
- **Culture**: Esto determina el lenguaje y el formato de las convenciones para la fecha, tales como nombres de mes, nombres de día, y el orden del día/mes/año. Default `"en-US"` utiliza convenciones en inglés (Estados Unidos). Utilizando `"es-ES"` mostraría nombres de mes y de día en español, por ejemplo.

Puede configurar esta personalización por tabla, y **override por columna si es necesario**, con varios enfoques posibles:
- **Static**: Use los valores predeterminados o valores alternativos de código duro si se ajustan a sus necesidades.
- **Server-based**: Utilice la configuración del entorno del servidor donde se implementa su aplicación.
- **Per-user**: Guardar la configuración preferida de cada usuario, permitiendo a los usuarios elegir cómo se muestran las fechas en sus tablas. Esto requiere una configuración adicional, pero proporciona la máxima flexibilidad.

> [!NOTE]
> Aunque la configuración por tabla es posible, se recomienda establecer una configuración **global** para todas las tablas.  
> 
> También puede anular la configuración **per-column** (por ejemplo, aplicar un formato de fecha diferente o una zona horaria que el predeterminado de la tabla).  
> Sin embargo, use esto cuidadosamente. Tener formatos mixtos o zonas temporales puede confundir a los usuarios.  
> 
> Si una columna utiliza una zona horaria personalizada, es muy recomendable hacerlo explícito, ya sea:
> - En el encabezado **column**, o  
> - Directamente dentro del formato **date** (por ejemplo, el offset de la zona horaria).
>
> Mantener formatos consistentes ayuda a evitar malentendidos y mejora la legibilidad general.

<br><br>



<a id="date-configuration-behavior"></a>
#### Comportamiento de la configuración de fechas
El **ECS PrimeNG Table** ofrece múltiples capas de control de configuración de fechas, lo que le permite personalizar cómo las fechas aparecen tanto en pantalla como cuando se exportan a Excel. Esta flexibilidad existe principalmente porque **Excel no interpreta los formatos de fecha de la misma manera que la tabla hace**, por lo que cada entorno puede requerir su propia configuración de formato para asegurar resultados correctos y predecibles. Las capas de configuración ofrecidas son las siguientes:
- Configuraciones de fechas globales para la renderización de tablas: Definir un formato de fecha predeterminado, cultura y zona horaria que se aplica a todas las columnas de fecha en la interfaz de usuario. Esto garantiza una presentación coherente en toda la tabla a menos que una columna la anule explícitamente.
- Configuraciones de fechas por columna anuladas: Cada columna puede proporcionar su propio formato, cultura y zona horaria para la renderización de la interfaz de usuario. Esto le permite manejar casos en los que un campo específico requiere un formato diferente (por ejemplo, horarios del servidor vs. visualización local).
- Formato de fecha global para la exportación de Excel: Puede especificar un formato de exportación **table-level** que se aplicará a las columnas de fecha cuando genere archivos Excel. Este formato está destinado al consumo de Excel y puede diferir del formato en pantalla para dar cabida a las reglas de formato de Excel.
- Sobrevaloración de formato de fecha por columna para la exportación de Excel: Cada columna puede definir un formato de fecha específicamente para la salida de Excel. En la actualidad, este formato de exportación de nivel de columna tiene precedencia sobre el formato de exportación de nivel de tabla.

<br><br>



<a id="resolution-priority"></a>
#### Prioridad de resolución
Al mostrar fechas en UI o exportar, la configuración final de una columna de fecha determinada se resuelve en el siguiente orden:
1. Nivel de columna (puede ser diferente entre la IU y la exportación).
2. Nivel de tabla (puede ser diferente entre la IU y la exportación).
3. Fallback a configuraciones predeterminadas.

Esta prioridad asegura que las fechas alwyas tengan una configuración de fecha definida y que las necesidades específicas de cada columna pueden anular los ajustes globales.

<br><br>



<a id="recommendations-with-dates"></a>
#### Recomendaciones para las fechas
Preferir un formato de tabla global consistente para la legibilidad de la interfaz de usuario, y sólo utilizar per-column anula cuando sea necesario. Para Excel, prefiera formatos de exportación explícitos e incluya indicios de zona horaria o cultura en los nombres de columna cuando sea aplicable para evitar la ambigüedad en el lado del consumidor.

<br><br>



<a id="43-column-configurations"></a>
### 4.3 Configuración de columnas
El **ECS PrimeNG Table** permite definir una variedad de configuraciones que controlan cómo se comporta cada columna cuando se muestra a los usuarios y qué se les permite hacer con ellos.



<a id="431-data-type"></a>
#### 4.3.1 Tipo de datos
Las columnas se pueden configurar para definir cómo se muestran y tratan los datos de las celdas. El **ECS PrimeNG Table** admite cinco tipos principales de datos, y elegir el tipo adecuado es importante, ya que también afecta las opciones de filtrado disponibles (el filtrado de columna se explica en secciones posteriores):
- **Text**: Para datos que deben tratarse como texto simple.
- **Numeric**: Para valores numéricos.
- **Boolean**: Para valores de sí/no (true/false).
- **Date**: Para valores de fecha. El formato de visualización se controla a través de la configuración de formato de fecha descrita en secciones anteriores.
- **List**: Una variante de texto especializada diseñada para columnas que contienen datos separados por `";"`. Este tipo está destinado principalmente a filtros predefinidos. Si no está configurado, el texto crudo se mostrará simplemente (los filtros predefinidos se explican en secciones posteriores).

> [!NOTE]  
> Todos los tipos de datos soportan valores nulos (vacíos), permitiendo que las celdas permanezcan en blanco si no hay datos disponibles.

<br><br>



<a id="432-visibility"></a>
#### 4.3.2 Visibilidad
Por defecto, todas las columnas son visibles. Sin embargo, mostrar demasiadas columnas a la vez puede abrumar a los usuarios, por lo que puede querer ocultar algunas de ellas inicialmente. Esto se puede configurar en la configuración de la tabla.

La tabla incluye un menú integrado de propiedades **column** (se puede utilizar por defecto), que permite a los usuarios mostrar o ocultar columnas en cualquier momento sin necesidad de volver a cargar o reconfigurar la tabla. Este menú es accesible directamente desde la interfaz de la tabla y proporciona una simple lista de comprobación de todas las columnas disponibles. (Explicado en más detalle en secciones posteriores.)

También puede restringir los cambios de visibilidad para columnas específicas. Por ejemplo, algunas columnas se pueden marcar como **always visible**, evitando que los usuarios los escondan.

Además, los desarrolladores pueden definir las columnas **utility** que permanecen ocultas de la interfaz de usuario. Estas columnas (como los IDs de fila o las referencias internas) no sólo son invisibles al usuario final, sino también excluidos del menú de propiedades de la columna, asegurando que permanezcan ocultos mientras todavía están disponibles para la lógica o los procesos internos.

<br><br>



<a id="433-horizontal-and-vertical-alignment"></a>
#### 4.3.3 Alineación horizontal y vertical
Cada columna se puede configurar para controlar cómo se alinean los datos dentro de sus celdas, tanto horizontal como verticalmente.

**Opciones de alineación horizontal:**
- **Left**: Alinea el contenido al lado izquierdo de la celda. Comúnmente utilizado para los valores de texto.
- **Center**: centra el contenido en la celda. Opción predeterminada.
- **Right**: Alinea el contenido al lado derecho de la celda. Típicamente utilizado para datos numéricos.

**Opciones de alineación vertical:**
- **Top**: Alinea el contenido a la parte superior de la celda.
- **Middle**: centra el contenido verticalmente. Opción predeterminada.
- **Bottom**: Alinea el contenido a la parte inferior de la celda.

Por defecto, las columnas se fijan en **center** horizontalmente y **middle** verticalmente.

Los usuarios pueden cambiar la alineación de cualquier columna usando un menú dedicado de propiedades de columna (explicado en secciones posteriores). Puede restringir este comportamiento de dos maneras:
- **Restrict per column**: Evitar que los usuarios cambien la alineación horizontal y/o vertical para columnas específicas.
- **Deshabilitado globalmente**: Apague todo el menú de Propiedades de la columna para que los usuarios no puedan ajustar la alineación o cualquier otra configuración de la columna.

<br><br>



<a id="434-overflow-behaviour"></a>
#### 4.3.4 Comportamiento del desbordamiento
Cuando el contenido de una celda excede el espacio disponible, el comportamiento **overflow** determina cómo se muestran los datos. Las opciones disponibles son:

- **Hidden**: El contenido extra se corta y no se muestra. Esto evita romper el diseño de la tabla, pero puede ocultar parte de la información.
- **Wrap**: El contenido continúa automáticamente en una nueva línea dentro de la misma celda, asegurando que todos los datos sean visibles pero potencialmente aumentando la altura de la fila.

Por defecto, el comportamiento de desbordamiento de todas las columnas se establece en **Hidden**.

Los usuarios pueden ajustar el comportamiento de desbordamiento de cada columna a través del menú de propiedades **column** (explicado en secciones posteriores). Esta característica se puede controlar de dos maneras:
- **Restrict per column**: Evitar que los usuarios cambien el comportamiento de desbordamiento para columnas específicas.
- **Disable globally**: Apague el menú de propiedades de la columna entera para que los usuarios no puedan modificar el comportamiento de desbordamiento o cualquier otra configuración de la columna.

<br><br>



<a id="435-column-properties-menu"></a>
#### 4.3.5 Menú de propiedades de columna
Por defecto, la tabla incluye un botón de propiedades **column ** situado en la esquina superior izquierda. Este botón abre un modal que permite a los usuarios personalizar cómo se muestran y formatean las columnas.
<p align="center">
    <img width="205" height="132" alt="Modify column properties button" src="https://github.com/user-attachments/assets/dcd3bbf3-585d-4a9a-adb6-490b8b419578"/>
</p>

Este menú puede ser **disabled globally** si no desea que los usuarios hagan ninguna modificación a las propiedades de la columna o la visibilidad.

Cuando está habilitado, haga clic en el botón abre una ventana modal que proporciona las siguientes características:
- **Column list**: Muestra todas las columnas disponibles en la tabla ordenada desde A-Z (excepto las columnas **utility**). El pedido automático se puede desactivar si se desea.
- **Search bar**: Una entrada de búsqueda global para filtrar columnas por nombre. Las columnas se enumeran alfabéticamente (A–Z).
- **Editable properties** (si no está bloqueado para la columna):
  - Visibilidad (show/hide columns).
  - Alineación horizontal.
  - Alineación vertical.
  - Comportamiento de desbordamiento celular.

En la parte inferior derecha del modal, los usuarios pueden o bien **Cancel** o **Apply** sus cambios:
- Si se aplican cambios de visibilidad, la tabla será **refresh data** y resetear los filtros y la ordenación.
- Si sólo se aplican cambios de formato (alineación o desbordamiento), la tabla se aplicarán filtros **preserve y clasificación** sin datos de actualización.

<p align="center">
	<img width="1276" height="544" alt="Modify column properties menu" src="https://github.com/user-attachments/assets/82b535c8-8445-40cc-8d4d-de107da13b5d" />
</p>

<br><br>



<a id="436-resize"></a>
#### 4.3.6 Cambio de tamaño
Por defecto, todas las columnas pueden ser redimensionadas por el usuario. Esta característica también puede ser deshabilitada para columnas específicas si se desea.

Para cambiar el tamaño de una columna, el usuario debe mover el cursor al borde izquierdo del encabezado de la columna. Cuando el icono de tamaño aparece (<img width="18" height="18" alt="resize icon" src="https://github.com/user-attachments/assets/3a685f5d-41e4-4771-9b36-32084b6e8c85"/>), el usuario puede pulsar y pulsar el botón del ratón, luego arrastre horizontalmente para ajustar el ancho de la columna.

Algunos aspectos importantes del diseño a tener en cuenta:
- Las columnas no pueden ser redimensionadas si no son visibles.
- Por diseño, las columnas de tamaño siempre mantendrán un ancho mínimo (alrededor de 18 px).
- Esto asegura que los usuarios no pueden hacer que una columna desaparezca completamente arrastrándola por debajo de este umbral.
- Las columnas congelados no pueden ser redimensionadas.

<p align="center">
  <img width="757" height="432" alt="resize example" src="https://github.com/user-attachments/assets/f8cb1b9e-f518-4e65-bc1e-875a6de7afdd"/>
</p>

<br><br>



<a id="437-reorder"></a>
#### 4.3.7 Reordenación
El **ECS PrimeNG Table** también incluye la capacidad de los usuarios para reordenar las columnas mostradas en la tabla. Esta función puede ser habilitada o deshabilitada por columna.

Cómo funciona es como sigue:

1. El usuario hace clic y mantiene el **header** de la columna que quieren mover. Importante: El clic debe estar en el área principal del encabezado (no en iconos y no en los bordes, de lo contrario será detectado como una acción de tamaño).
2. Cuando la acción se hace correctamente, una copia **semi-transparent** del encabezado de la columna (una cabecera "fantasma") aparecerá y seguirá el puntero del ratón.
3. Mientras sostiene el botón del ratón, el usuario puede arrastrar este encabezado fantasma horizontalmente a la ubicación deseada.
4. Para colocar la columna:
    - El encabezado fantasma debe alinearse al lado **left** de la columna donde el usuario quiere insertarla.
    - Cuando la posición es válida, las flechas **two** (una arriba y otra abajo) aparecerán como indicadores.
5. Una vez que las flechas sean visibles, la liberación del botón del ratón reordenará la columna a la nueva posición.

> [!TIP]
> Como sugerencia de diseño, se recomienda mantener la reordenación de columnas consistentes en la tabla:
> - O reordenar deshabilitado para todas las columnas, o permitirlo para todos.
> - Si necesita restringir columnas específicas, es mejor aplicarlo sólo a las columnas **frozen**.

<p align="center">
  <img width="1542" height="649" alt="column reorder example" src="https://github.com/user-attachments/assets/a731ffa5-87e6-414f-b3b3-6cf64d9e9de8"/>
</p>

<br><br>



<a id="438-frozen"></a>
#### 4.3.8 Columnas fijas
Algunas columnas se pueden configurar como **frozen**, dependiendo del diseño de la tabla.

Las columnas congelados siempre se colocan en uno de los bordes de la tabla: ya sea en el lado **left** o en el lado **right**.

Estas columnas permanecen **visible en todo momento**, incluso cuando el usuario desplaza la tabla horizontalmente.

<p align="center">
  <img width="661" height="526" alt="frozen columns example" src="https://github.com/user-attachments/assets/1a38a4b3-e3e7-430b-ad90-189654363aa6"/>
</p>

<br><br>



<a id="439-descriptions"></a>
#### 4.3.9 Descripciones
Las columnas pueden incluir un **description** para proporcionar contexto adicional. Cuando una columna tiene una descripción, aparecerá un icono **information** (<img width="18" height="18" alt="info icon" src="https://github.com/user-attachments/assets/3c3d602b-c4b9-4c7c-b3e7-d7906767916d"/>) en el lado derecho del encabezado de la columna.

El icono utilizado para descripciones de columnas se puede personalizar a nivel de tabla a través de las opciones de configuración de la tabla. Si no se proporciona un icono personalizado, se utilizará el icono de información predeterminado.

Si el usuario pasa el ratón sobre este icono, se mostrará un **tooltip** mostrando la descripción de la columna.

Esta característica es especialmente útil para columnas que pueden requerir detalles adicionales para ayudar a los usuarios a comprender mejor los datos que se presentan.

<p align="center">
  <img width="496" height="143" alt="column description example" src="https://github.com/user-attachments/assets/48b98b97-a922-4fec-895f-07ed6b1232b5"/>
</p>

<br><br>



<a id="4310-cell-tooltip"></a>
#### 4.3.10 Información emergente de la celda
Por defecto, cada celda en todas las columnas mostrará una información sobre herramientas cuando el ratón se apila sobre ella, excepto para las columnas configuradas con un tipo de datos booleano. El contenido de la herramienta será el mismo que el valor de la celda.

También es posible configurar la punta de la herramienta para mostrar el valor de otra columna (que también funciona con columnas con tipo de datos booleanos). Esto puede ser útil, por ejemplo, cuando una columna sólo muestra un icono para indicar si una subida fue exitosa o no: si la subida falló, navegar por el ratón sobre el icono puede mostrar el mensaje de error correspondiente en la punta de la herramienta.
<p align="center">
  <img width="461" height="195" alt="image" src="https://github.com/user-attachments/assets/56af01b5-49d6-4968-b381-09f8192d5353" />
</p>

> [!CAUTION]
> Tenga en cuenta que cuando se hace referencia a otras columnas, sólo puede acceder a los datos de las columnas que actualmente son visibles en la tabla. Por lo tanto, evite la asignación de herramientas a columnas que los usuarios pueden ocultar, y en lugar de utilizar columnas de utilidad que permanecen siempre disponibles.

<br><br>



<a id="4311-sorting"></a>
#### 4.3.11 Ordenación
Por defecto, todas las columnas son clasificables. Puede desactivar ordenar en columnas específicas si no desea que los usuarios las ordenen.

**Cómo funciona la ordenación:**
- Haga clic en un encabezado de columna una vez para ordenar en **ascending order**.
- Haga clic en el mismo encabezado por segunda vez para ordenar en **descending order**.
- Haga clic en una tercera vez para **sort ascendiendo de nuevo**.

Si una columna diferente se hace clic mientras que otra columna ya está ordenada, la nueva columna se ordenará en orden ascendente, y la columna anterior tendrá su ordenación despejada.

La tabla admite la ordenación **multi-column**: los usuarios pueden mantener la tecla **Ctrl** haciendo clic en varios encabezados de columna para ordenar por varias columnas simultáneamente.

También puede definir una ordenación **default** para una o más columnas cuando el usuario no ha aplicado ninguna ordenación.

En la esquina **top-left de la tabla**, hay un botón para **clear todo tipo de clasificación** aplicado por el usuario. Este botón está habilitado sólo cuando al menos una ordenación aplicada por el usuario está activa.
<p align="center">
  <img width="230" height="140" src="https://github.com/user-attachments/assets/9b2cd936-7bd0-4054-9940-fa7dbc53a20f" alt="Clear sorting button">
</p>

> [!NOTE]
> Si ninguna columna permite ordenar, puede ocultar este botón. Sin embargo, es **not recomendado** ocultarlo si algunas columnas son clasificables, ya que esto podría confundir a los usuarios evitando que reajusten la ordenación.

<br><br>



<a id="4312-filtering"></a>
#### 4.3.12 Filtrado
Por defecto, todas las columnas en el soporte de tabla **filtering**. Esta función también puede desactivarse para columnas específicas si es necesario.

**Cómo funciona el filtro:**
- Cada encabezado de columna incluye un icono **filter**.
- Cuando el usuario hace clic en este icono, aparece un menú de filtro.
- El tipo de filtro que se muestra depende del **data tipo** o de un filtro **predefinido** (**predefinido filtros** explicado en secciones posteriores).

En la parte superior de cada menú de filtro (excepto los tipos booleanos), el usuario puede elegir entre:
- **Match all** (default): sólo se devuelven los registros que satisfacen las reglas *all* definidas para esa columna.
- **Match any**: se devuelven los registros que satisfacen *at al menos one* de las reglas.

Los usuarios pueden definir **up a dos reglas por columna**, excepto las columnas booleanas.

Las reglas disponibles por tipo de datos son las siguientes:

- **Text**
  - Empieza con
  - Contains
  - No contiene
  - Finales con
  - Igualdad
  - No es igual

- **Numeric**
  - Igualdad
  - No es igual
  - Menos que
  - Menos o igual a
  - Más grande que
  - Mayor o igual a

- **Boolean**
  - Un simple **true/false selector**

- **Date**
  - Fecha
  - La fecha no es
  - La fecha es anterior
  - La fecha es después
 
- **List**
  - Si no se establece como un filtro predefinido, funcionará como el filtro de texto.

Para el tipo de datos `date`, los filtros consideran sólo la porción de la fecha e ignoran el tiempo. Por ejemplo, si el usuario aplica el filtro **Date is** con el valor `23-Sep-2024`, todos los registros con una fecha entre `23-Sep-2024 00:00:00` y `23-Sep-2024 23:59:59` serán devueltos.

La conversión de la zona horaria es manejada automáticamente por la tabla. Por ejemplo, si la tabla está configurada para usar GMT+02:00 y un usuario aplica el filtro `23-Sep-2024`, la consulta filtrará correctamente los registros entre `23-Sep-2024 02:00:00 UTC` y `24-Sep-2024 01:59:59 UTC`.

En la esquina **top-left de la tabla**, hay un botón para **clear todos los filtros activos**. Este botón está habilitado sólo cuando por lo menos un filtro ha sido aplicado por el usuario.

<p align="center">
  <img width="224" height="92" alt="Button delete filters" src="https://github.com/user-attachments/assets/757cda01-d30d-40b4-a1c4-0d2d4b2919a7"/>
</p>

> [!NOTE]
> Si ninguna columna permite filtrar, puede ocultar el botón "Clear filtros". Sin embargo, si algunas columnas son filtrables, es **recomendado para mantener este botón visible** para evitar confundir a los usuarios y proporcionar una manera rápida de restablecer filtros.

Un ejemplo para un menú de filtro para el tipo de datos de texto:
<p align="center">
  <img width="588" height="296" alt="Filter menu example for text" src="https://github.com/user-attachments/assets/8453051f-80f8-44ca-8e0c-83ddf4bb8353" />
</p>

<br><br>



<a id="4313-predefined-filters"></a>
#### 4.3.13 Filtros predefinidos
> [!CAUTION]
> Evite usar esta característica en columnas que pueden tener un gran número de valores diferentes, ya que puede causar problemas de rendimiento.
> Los filtros predefinidos están destinados a columnas con un conjunto limitado de valores conocidos.

Los filtros predefinidos son un tipo especial de filtro donde, en lugar de permitir que el usuario ingrese cualquier valor, limita la selección a un **dropdown con valores conocidos** para esa columna.

Además, los filtros predefinidos le permiten a **costomizar cómo se muestran los valores** en una celda. Los formatos de pantalla compatibles incluyen:

- **Plain text**, donde se puede personalizar el color del texto (o otras propiedades como fuente o tamaño).
- **Tags**, donde puede personalizar el color de la etiqueta.
- **Icons**, donde se puede personalizar el color y el tamaño del icono. Los iconos pueden provenir de múltiples bibliotecas, como los iconos PrimeNG, Font Awesome, Material Icons, etc...
- **Images**, que se mostrará directamente en la celda. La tabla administra la carga de imágenes y muestra un esqueleto mientras se descarga. Las imágenes pueden ser alojadas localmente en su servidor o provienen de URL externas.

El mismo formato aplicado a la celda también aparecerá en el desplegable para el filtrado.

El desplegable incluye una barra **global de búsqueda ** y permite al usuario seleccionar **one o más elementos** simultáneamente (el filtro aplicado es de tipo "OR").

Los filtros predefinidos también tienen un caso de uso especial para columnas de tipo `list`. En este caso, todos los elementos de la columna están separados por `;`, permitiendo que varios elementos de su lista se muestren simultáneamente aplicando el formato definido.

Además, los filtros predefinidos se pueden configurar para que se haga clic. Al hacer clic, puede acceder tanto a los datos de fila como a toda la información del elemento de filtro predefinido que fue seleccionado.

> [!TIP]
> Puede combinar formatos en filtros predefinidos. Por ejemplo, podría mostrar un **image** y **plain text** juntos.
<p align="center">
  <img width="1052" height="453" alt="Predefined filter example" src="https://github.com/user-attachments/assets/90b15f1a-c1f2-42a9-b853-83583acb26f8" />
</p>

<br><br>



<a id="4314-initial-width"></a>
#### 4.3.14 Ancho inicial
Puede definir un ancho inicial para columnas de tabla en píxeles. La fijación de anchos explícitos es particularmente importante para las columnas **frozen**, ya que garantiza la alineación adecuada y evita los cambios de diseño cuando se entrega la tabla.

Tenga en cuenta que el ancho inicial **overrides cualquier ancho guardado en vistas**, por lo que utilice cuidadosamente con columnas que los usuarios pueden cambiar de tamaño.

<br><br>



<a id="44-row-configurations"></a>
### 4.4 Configuración de filas
El **ECS PrimeNG Table** le permite configurar varias configuraciones que controlan cómo se comporta cada fila cuando se muestra a los usuarios, así como las acciones asociadas con ellos.



<a id="441-single-select"></a>
#### 4.4.1 Selección individual
La tabla ECS PrimeNG permite la selección de filas **single** para filas. Cuando está habilitado, esta función permite al usuario seleccionar una sola fila.

Usted puede asociar acciones cuando un usuario selecciona o unselecta una fila. Además, puede acceder a la fila seleccionada en cualquier momento y realizar acciones.

Los usuarios también pueden **unseleccionar una fila previamente seleccionada**. Hay dos maneras de configurar este comportamiento:
- **CTRL + Haga clic (por defecto):** Sostenga la tecla `CTRL` y haga clic en la fila ya seleccionada para deseleccionarla.
- **Click only:** Simplemente haga clic en la fila ya seleccionada para deseleccionarla, sin necesidad de presionar `CTRL`.

<p align="center">
	<img width="1915" height="250" alt="Single row select example" src="https://github.com/user-attachments/assets/021d054d-56b7-4d96-8866-5c831c1d9e4d" />
</p>

> [!NOTE]
> En dispositivos móviles (teléfonos o tabletas), se ignora la configuración clave `CTRL`. Los usuarios pueden unseleccionar una fila previamente seleccionada haciendo simplemente clic en ella, ya que los dispositivos móviles no tienen una tecla `CTRL`.

> [!CAUTION]
> Si el comportamiento predeterminado (guardando hacia abajo `CTRL` a unselect) está habilitado, haciendo clic repetidamente en la misma fila **sin tenencia `CTRL`** contará como múltiples selecciones.  
> Esto puede causar comportamiento no deseado si las acciones se activan en cada selección, así que planifique sus acciones de fila en consecuencia.

<br><br>



<a id="442-checkbox-select"></a>
#### 4.4.2 Selección mediante casillas de verificación
Si necesita usuarios de **select multiple rows simultáneamente**, puede activar la función **checkbox select**.  

Cuando esté habilitado:  
- Una nueva columna aparece en la tabla para las casillas de verificación.  
- Esta columna **cannot se ocultó** o ha cambiado su alineación a través de la `column properties menu`.  
- La columna también incluye un **filter**, permitiendo a los usuarios filtrar entre las filas **selected** y **unselected**.  

Usted puede asociar acciones cuando un usuario selecciona o unselecciona una fila usando la casilla de verificación. Además, puede acceder a las filas seleccionadas en cualquier momento y realizar acciones basadas en ellas.  


El **checkbox select column** tiene estas opciones adicionales personalizables:
- **Condición de activación:** Una condición que permite determinar si la casilla de verificación está activada.
- **Frozen column:** Default es `true`.
- **Header title:** Default es `"Selected"`.
- **Position:** Default se deja.
- **Alineación horizontal de los elementos**: El valor predeterminado es `center`.
- **Alineación vertical**: Predeterminado es `middle`.
- **Resizable por usuario:** Default es `false`.
- **Width:** Default es `150px`.

<p align="center">
  <img width="311" height="362" alt="Checkbox row select example" src="https://github.com/user-attachments/assets/0e387896-6569-46f0-96cb-9f9f68536932" />
</p>

<br><br>



<a id="443-dynamic-styling"></a>
#### 4.4.3 Estilos dinámicos
La Tabla ECS PrimeNG le permite a **apply estilo dinámico a filas específicas**, haciéndolos visualmente distintos de otras filas o incluso cambiar su apariencia en tiempo de ejecución.

El caso de uso más común es a **change el formato de texto o fondo** de una fila basado en un valor de columna específico.

En el ejemplo a continuación:
- Si la columna `Employment status list` contiene el valor `Full-time`, la fila mostrará su texto en **bold** y **italic**.
- Si el valor `Unemployed` existe en la columna `Employment status list`, la fila **color de fondo** cambiará a **rojo claro**, el **color de texto** a **rojo oscuro**, y **font weight** será **Atrevidos**.

<p align="center">
	<img width="1915" height="563" alt="Dynamic row styling" src="https://github.com/user-attachments/assets/1c58a0c5-fe29-4d61-8c66-676184fb68aa" />
</p>

> [!TIP]
> Una fila puede combinar varios estilos simultáneamente, aplicados de diferentes reglas.

<br><br>



<a id="45-action-buttons"></a>
### 4.5 Botones de acción
El **ECS PrimeNG table** le permite definir los botones **action** tanto en el encabezado de la tabla como dentro de cada fila.

La diferencia clave entre ambos:
- Botones de acción **Header** no tiene acceso a datos de fila.
- **Row botones de acción** puede acceder a los datos de la fila en la que se hacen clic, lo que le permite realizar acciones en un registro específico.

Las propiedades personalizables para botones de acción son:
- **Icon**: Puede mostrar opcionalmente un icono y personalizar su **color** y **size**. Los iconos pueden provenir de múltiples bibliotecas, como los iconos **PrimeNG**, **Font Awesome**, **Material Icons**, etc...
- Posición **Icon**: Por defecto `left`, pero el icono se puede mostrar en el `right`, `bottom` o `top` de la etiqueta.
- **Label**: Texto para mostrar en el botón.
- **Rounded**: Si el botón debe tener esquinas redondas o no.
- **Raised**: Si es activo, añade una sombra para indicar la elevación en el botón.
- **Variant**: El predeterminado es un botón normal, pero también puede tener botones que son texto o delineado.
- **Classes**: Clases extra CSS para aplicar al botón. Se pueden agregar múltiples clases separando los espacios.
- **Style**: Estilos adicionales para añadir al botón.
- **Condición visible**: Permite ocultar completamente el botón si no se cumple una condición específica. Otras condiciones (`Enabled condition` y `Hide if condition not met`) se ignoran cuando el botón no es visible.
- **Enabled condition**: Permite desactivar el botón si no se cumple una condición específica. Evaluado sólo cuando el botón es visible.
- **Hide si la condición no met**: Por defecto, si el `enabled condition` especificado no se cumple, el botón será deshabilitado, pero usted puede elegir ocultarlo por completo en su lugar. Ignorado cuando el botón no es visible.
- **Action**: La función o la operación a ejecutar cuando se hace clic en el botón.
- **Tooltip**: El texto que se mostrará al pulsar el botón.

Un ejemplo de un botón de acción del encabezado: 
<p align="center">
  <img width="158" height="66" alt="Header action buttons" src="https://github.com/user-attachments/assets/be7cbd0a-d148-42d7-8200-98669b8c5532" />
</p>

Cuando se define al menos un botón de acción de fila, una nueva columna aparece automáticamente para mostrar los botones para cada fila. Esta columna tiene las siguientes opciones personalizables:**  
- **Título del encabezado**: El valor predeterminado es `"Actions"`.
- **Position**: Default es `right`.
- **Alineación horizontal de los elementos**: El valor predeterminado es `center`.
- **Alineación vertical**: Predeterminado es `middle`.
- **Width**: Default es `150px`.
- **Columna fija**: El valor predeterminado es `true`.
- **Cambio de tamaño por el usuario**: El valor predeterminado es `false`.

Un ejemplo de las columnas de acción con botones de acción de fila:  
<p align="center">
  <img width="124" height="124" alt="Row action buttons" src="https://github.com/user-attachments/assets/af65a3f1-2cc7-455e-bf85-059f9e372d24" />
</p>

<br><br>



<a id="46-global-filter"></a>
### 4.6 Filtro global
El filtro **global** está habilitado por defecto para todas las columnas y aparece en la esquina **top-right** de la tabla. Permite a los usuarios **search una palabra clave a través de todas las columnas visibles** de la tabla simultáneamente.

Esta función puede desactivarse:
- **Globally**, escondiendo la caja de entrada de filtro global.
- **Per column**, excluyendo columnas específicas de la búsqueda mundial.

El filtro global aplica **not apply** a columnas con un tipo de datos **boolean**, ya que no hay una palabra clave que coincida.

**Cómo funciona:**
- Cuando un usuario escribe un valor en el cuadro de entrada de filtro global, la tabla:
  - Devuelve todas las filas que contienen la palabra clave en cualquiera de las columnas mostradas.
  - Destaca el texto emparejado en **yellow**.
- La palabra clave puede coincidir con **any parte del texto**.
- Si el cuadro de entrada de filtro global contiene un valor, un icono **"X"** aparece a la derecha, permitiendo al usuario limpiar el filtro con un solo clic.

Un ejemplo del filtro global:
<p align="center">
	<img width="1916" height="568" alt="Global filter example" src="https://github.com/user-attachments/assets/f817be2b-ff64-49c4-a9f8-fc72a3bafb0d" />
</p>

> [!CAUTION]
> Utilizar el filtro global puede afectar significativamente el rendimiento, especialmente en conjuntos de datos grandes.  
> Considere las siguientes mejores prácticas para mantenerlo eficiente:
> - **Limitar el número máximo de columnas que pueden ser visibles al mismo tiempo**, ya que el filtro global corre a través de todas las columnas mostradas.
> - **Se cauteloso con columnas de fecha**, ya que los convertidores de filtros globales datan de cadenas y es más caro.
> - **Optimice su backend** para búsquedas de palabras clave (por ejemplo, usando índices adecuados).
> - **Limitar el número total de registros** recuperado inmediatamente si el rendimiento es una preocupación.

<br><br>



<a id="47-pagination-and-record-count"></a>
### 4.7 Paginación y recuento de registros
El **ECS PrimeNG table** gestiona automáticamente tanto la paginación como el registro contando para usted. Esto significa que sólo los datos necesarios para la página actual se cargan en la parte delantera, optimizando el rendimiento y minimizando la cantidad de información transferida.

En la parte inferior de la tabla encontrará dos áreas principales:
- **Lado izquierdo:** muestra un mensaje como *"Mostrar archivos X de X disponibles"*.
  - Si se aplican filtros, la parte *"Mostrar X"* solo refleja los resultados filtrados.
  - La parte * de X disponible"* siempre muestra el número total de registros en el conjunto de datos, independientemente de los filtros.

- **A la derecha:** contiene los controles de paginación.
  - Los usuarios pueden navegar páginas haciendo clic en un número de página o usando las flechas.
  - Una sola flecha mueve una página hacia adelante o hacia atrás.
  - Una flecha doble salta directamente a la primera o última página.

Además, a la derecha de la paginación, hay un menú desplegable que permite a los usuarios cambiar cuántos elementos se muestran por página. Las opciones disponibles son completamente personalizables.

Un ejemplo de la **pagination y conteo record**:
<p align="center">
  <img width="1889" height="225" alt="Pagination and record count example" src="https://github.com/user-attachments/assets/7003a255-2516-4c2a-97c9-6084b4abb861" />
</p>

> [!CAUTION]
> Evite permitir un número muy alto de elementos por página, ya que esto puede reducir el rendimiento.

> [!CAUTION]
> Los elementos permitidos por página son 255.

<br><br>



<a id="48-copy-cell-content"></a>
### 4.8 Copiar el contenido de una celda
Esta función está habilitada por defecto y puede configurarse por tabla.

Permite a los usuarios **press y mantener una celda** copiar su contenido bruto directamente al portapapeles.

También puede personalizar:
- La duración de la prensa antes de la acción de copia se activa.  
- O deshabilitar la característica completamente si no es necesario.

<br><br>



<a id="49-dynamic-height"></a>
### 4.9 Altura dinámica
Permitido por defecto, esta función ajusta automáticamente la altura **maximum** de la tabla para ajustar su contenedor.

La barra de desplazamiento vertical aparecerá **inside la tabla** para navegar registros en la página actual, mientras que el **header y el paginador permanecen visible** en todo momento.

<br><br>



<a id="410-deferred-startup"></a>
### 4.10 Inicio diferido
Por defecto, cuando accede a una página que contiene una tabla **ECS PrimeNG**, la tabla carga automáticamente su configuración y datos.

Este comportamiento puede aplazarse si es necesario. Por ejemplo, en cualquiera de estos escenarios:
- El usuario debe realizar una acción antes de recuperar datos.
- Algunos datos deben buscarse primero para poblar filtros predefinidos.
- Cualquier otro escenario que puedas tener.

Una vez listo, la tabla se puede actualizar manualmente a través de llamadas externas.

<br><br>



<a id="411-changing-the-data-endpoint-dinamically"></a>
### 4.11 Cambio dinámico del endpoint de datos
Es posible cambiar el **data source** de una tabla mientras está en uso, sin necesidad de volver a cargar o descargar toda la configuración de la tabla de nuevo.

Esta característica es especialmente útil en escenarios donde:
- El **columns** (e incluso el **views**) sigue siendo el mismo.
- Sólo tienes que ajustar de dónde saca la tabla sus datos.

Un ejemplo común es cuando se aplica un filtro ** de alto nivel**.

Por ejemplo, cambiar entre diferentes clientes: la tabla mantiene la misma estructura, pero la fuente de datos cambia para que pueda ver información para el cliente seleccionado a través de toda la aplicación.  

<br><br>



<a id="412-excel-report"></a>
### 4.12 Informe de Excel
Con una configuración mínima, puede permitir a los usuarios **exportar datos de mesa** a través de un menú interactivo con múltiples opciones de exportación.

Si está habilitado, un icono **Excel** aparecerá en la parte superior derecha de la tabla. Al hacer clic en ella se abre una ventana modal como esta:
<p align="center">
	<img width="1331" height="530" alt="Excel report example" src="https://github.com/user-attachments/assets/adb02886-b44c-4d1f-b594-b8e60c3a1483" />
</p>

Los usuarios pueden personalizar la exportación con las siguientes opciones:
- **Report filename**: Se puede prellenar con un nombre (por defecto: "Reportar"). También puede evitar que los usuarios lo cambien.
- **Include timestamp**: Por defecto, activado. Añade el tiempo actual en el formato `_{year}{month}{day}_{hours}{minutes}{seconds}_UTC` al nombre de archivo. Los usuarios pueden desactivarlo si quieren.
- **Use iconos en campos booleanos**: Por defecto, deshabilitado. Cuando están deshabilitados, los valores booleanos se exportan utilizando sus valores nativos de Excel `TRUE` o `FALSE`, que Excel automáticamente localiza dependiendo del idioma del usuario. Cuando están habilitados, los campos booleanos se exportan utilizando iconos ✔ (U+2714) para `true` y  ⁇  (U+2718) para `false` y cada icono se estilo con un color correspondiente (verde para `true`, rojo para `false`).
- **Export columns**: Elija si exportar sólo columnas visibles o todas las columnas (por defecto: sólo visible).
- **Filters to apply**: Decide si los filtros de tabla deben aplicarse a la exportación (predeterminado: no aplicado). Si la opción **Selected rows** está activada y no se establece en "Todas las filas", esta opción se vuelve obligatoria aplicando los filtros actuales.
- **Sorts para aplicar**: Incluir la ordenación de tablas en la exportación (por defecto: no aplicado).
- **Selected rows**: Aparece sólo si la tabla tiene el selector **row de la casilla de verificación ** habilitado. Los usuarios pueden exportar filas seleccionadas, filas no seleccionadas, o todas las filas independientemente de la selección.

Una vez satisfecho con la configuración, los usuarios pueden hacer clic en **Export** para generar el archivo Excel, que se descargará automáticamente a su dispositivo.

Programmatically, el proceso de exportación se puede configurar para utilizar los formatos de fecha **specific** para Excel, independiente de la pantalla UI. Esto significa que puedes:
- Define un formato de fecha **global Excel** que se aplica a todas las columnas de la fecha.
- Superar el formato **per column**, permitiendo que ciertas columnas tengan un formato de Excel diferente al resto.
- Asegúrate de que los archivos de Excel exportados muestren fechas consistentemente de acuerdo con tus reglas de formato preferidas, independientemente de cómo aparecen las fechas en la tabla de pantalla.

<br><br>



<a id="413-views"></a>
### 4.13 Vistas
Como se observa en secciones anteriores, los usuarios tienen muchas opciones para personalizar cómo se muestran los datos en la tabla.

A veces los usuarios quieren **ave todas estas personalizaciones** por lo que no tienen que recordar o volver a aplicar cada vez.

El **ECS PrimeNG Table** proporciona esta característica a través de **"Views"**.

Las vistas se guardan **per tecla de tabla y usuario**. Para habilitar esto, solo tienes que:
- Asignar un **unique key** a cada tabla que debe apoyar las vistas.
- Elija cómo se almacenan las vistas. Opciones disponibles:
  - **Session storage**: Las vistas se guardan sólo durante la sesión. Cerrar la ficha del navegador o el navegador eliminará las vistas.
  - ** Almacenamiento local**: Las vistas se almacenan localmente en el navegador. Persisten más tiempo pero pueden perderse si el usuario limpia los datos del navegador o cambia los dispositivos.
  - **Depósito de base de datos**: La opción más versátil. Las vistas se almacenan en una base de datos, permitiendo a los usuarios mantenerlos permanentemente y accederlos a través de diferentes navegadores o dispositivos. Requiere una configuración adicional.  

> [!CAUTION]  
> Las teclas de tabla deben ser únicas al usar vistas. De lo contrario, las vistas de una tabla podrían aparecer en otra, causando errores en su aplicación.

Si las vistas están habilitadas, los usuarios verán el siguiente menú en el centro del encabezado de la tabla:
<p align="center">
	<img width="256" height="48" alt="Views top menu" src="https://github.com/user-attachments/assets/cd407df7-6305-4d5e-842d-7eb01a355148" />
</p>

Este menú muestra la vista aplicada actualmente:
- **Current view text:** Muestra el nombre de la vista actualmente aplicada.  
  - Cuando no se selecciona la vista, se muestra un texto por defecto `"--- Select a view ---"`.  
  - El texto predeterminado se puede personalizar utilizando la opción apropiada.  
  - Se pueden aplicar clases adicionales de CSS al botón para mayor personalización.
- **Replay botón:** Reaplica la última configuración de la vista seleccionada.  
  - Soporta múltiples opciones de personalización, incluyendo clases de CSS personalizadas.  
  - El icono del botón también se puede personalizar si es necesario.

Cuando se presiona el texto del menú, se muestra el siguiente modal:
<p align="center">
	<img width="1379" height="457" alt="Views menu" src="https://github.com/user-attachments/assets/0de305dc-a33b-42d7-a7bf-741126f3639f" />
</p>

En el modal, los usuarios pueden gestionar las vistas de la tabla y crear nuevas. Para cada vista, las opciones disponibles son:
- **Load on startup**
- **Aplicar la vista**
- **Actualizar la vista**
- **Cambia la vista alias**
- **Delete la vista**

Reglas y limitaciones de las opiniones:
- No puede haber dos puntos de vista en la misma tabla con el mismo alias.  
- Por defecto, una tabla puede tener hasta 10 puntos de vista (configurable si es necesario).  
- **Load on startup**: Si se comprueba para una vista, se aplicará automáticamente la próxima vez que se cargue la tabla. Sólo una vista puede tener esto habilitado en un momento.

<br><br>



<a id="414-configurable-dynamic-column-exclusion"></a>
### 4.14 Exclusión dinámica configurable de columnas
En ciertos escenarios, es posible que desee permitir a los usuarios acceder a todas las columnas disponibles, mientras que en otros podría ser necesario restringir o ocultar las específicas.  
Esta función le permite a **dynamically excluir columnas** tanto de operaciones de visualización como de exportación, basado en reglas de backend o configuración.

La exclusión de columna se puede configurar independientemente para:
- ** Visualización útil** (que columnas puede ver el usuario)
- **Excel exports** (que columnas están incluidas en los datos exportados)

Algunos casos de uso de ejemplos son los siguientes:
- Un cliente con licencia **limited o plan de menor nivel** no debe tener acceso a algunas columnas de datos premium.
- Una columna contiene información **sensible** (por ejemplo, desglose de costos o datos de auditoría) que deben ocultarse para funciones específicas de usuario o usuarios externos.
- Ciertas columnas son sólo **relevant en módulos o contextos específicos** y se pueden ocultar en otros lugares para simplificar la interfaz de usuario.
- **Requisitos de localización o cumplimiento:** escondiendo columnas para usuarios en regiones específicas debido a limitaciones legales o de privacidad.

> [!TIP]  
> Si bien las exclusiones de columna pueden configurarse de manera diferente para las operaciones de visualización y exportación de tablas, generalmente se recomienda mantenerlas consistentes en ambas para una experiencia de usuario coherente.  
> La opción de definir exclusiones separadas está disponible para dar cabida a escenarios especiales o excepcionales en los que se requieren diferentes reglas de visibilidad.

<br><br>



<a id="415-table-description"></a>
### 4.15 Descripción de la tabla
Puede incluir opcionalmente una descripción **table** en el encabezado (en el lado izquierdo) para proporcionar un contexto adicional sobre el propósito de la tabla o explicar cómo utilizar características específicas.

Esta característica es **configured por table** y admite **rich HTML content**, lo que le permite formatear el texto con elementos como `<b>` (bold), `<u>` (en línea), `<i>` (italic), colores personalizados o diferentes fuentes.

La descripción de la tabla se puede mostrar de dos maneras diferentes:
- Como **tooltip**, que muestra la descripción cuando el usuario pasa por encima del icono (la punta de la herramienta aparece a la derecha del icono si hay suficiente espacio, si no se mostrará a continuación).
- Como **inline text**, se muestra directamente a la derecha del icono.

El icono de descripción en sí es **fully customizable** y admite iconos de cualquier biblioteca, incluyendo PrimeIcons, Iconos Materiales, o Font Awesome.

Los siguientes ejemplos ilustran cómo aparece la descripción de la tabla cuando se configura como elemento de herramienta y como texto en línea respectivamente.

<p align="center">
	<img width="330" height="128" alt="Tooltip" src="https://github.com/user-attachments/assets/45b22225-c1fb-44e4-a8d4-f6c8d769e907" />
</p>

<p align="center">
	<img width="633" height="120" alt="Text" src="https://github.com/user-attachments/assets/4c827a01-62ed-4646-a86f-742740878713" />
</p>

> [!TIP]
> Para mantener el encabezado de la tabla limpio y fácil de leer, se recomienda utilizar la descripción como punta de la herramienta siempre que sea posible.

<br><br>



<a id="416-table-legend"></a>
### 4.16 Leyenda de la tabla
Una leyenda **table** se puede añadir al pie de tabla. Se muestra como un botón que permanece visible mientras se desplaza verticalmente y, cuando se hace clic, abre una popover que contiene el contenido de la leyenda.

Esta característica es **configured por table** y admite **rich HTML content**, lo que le permite incluir texto formateado, iconos o listas dentro de la leyenda.  
Su propósito principal es proporcionar una referencia de columna compartida para la tabla, por ejemplo para describir símbolos, códigos de color o convenciones de datos específicos utilizados en múltiples columnas, evitando descripciones redundantes en cada columna.

El botón que abre el panel de leyenda se puede personalizar utilizando las mismas opciones de configuración disponibles para cualquier otro botón de tabla.

La siguiente imagen ilustra un ejemplo de cómo se muestra una leyenda de la tabla:
<p align="center">
	<img width="315" height="250" alt="Legend" src="https://github.com/user-attachments/assets/35d63f1e-6f81-4fcf-9e46-6b38b8133534" />
</p>

> [!TIP]
> Utilice la leyenda de la tabla para centralizar referencias compartidas y reducir la redundancia en descripciones de columnas.

<br><br>



<a id="417-reset-table-view"></a>
### 4.17 Restablecer la vista de la tabla
Por defecto, el botón **reset Vista de la tabla** se muestra junto al botón **refresh de la tabla** en la parte superior derecha de la tabla. Permite a los usuarios devolver la tabla a su estado original, exactamente como fue cuando se presentó por primera vez. Reiniciar los efectos:
- Columnas visibles  
- Ancho de columna  
- Orden de columna  
- Filtros de columna  
- Filtro global  
- Ordenación  
- Pagination  
- Página actual  

Si es necesario, este botón puede ser completamente deshabilitado o su icono personalizado.  
A continuación se muestra un ejemplo de la apariencia predeterminada del botón:
<p align="center">
	<img width="525" height="173" alt="Reset table view button" src="https://github.com/user-attachments/assets/cf10f99d-64be-471b-8d85-6f7f1b3ebf27" />
</p>

<br><br>



<a id="418-configurable-dynamic-column-attributes"></a>
### 4.18 Atributos dinámicos configurables de las columnas
Aunque cada columna de tabla tiene un conjunto predefinido de atributos que normalmente se fijan, `ECS PrimeNG Table` le permite anular dinámicamente estos valores en tiempo de ejecución.

Un caso de uso común está ajustando el **timezone** de una columna específica sin modificar los defectos de nivel de tabla.  
Otros ejemplos incluyen cambiar el encabezado de la columna, modificar el comportamiento del filtro o ajustar la alineación.  
En la práctica, esta característica le permite personalizar dinámicamente casi cada atributo que una columna puede exponer.

> [!TIP]  
> Los atributos de columna dinámicos se pueden configurar **independientemente** para pantalla de tabla y para operaciones de exportación.  
> Sin embargo, mantener ambas configuraciones alineadas es muy recomendable para preservar una experiencia de usuario consistente.  
>
> Recuerde que **Excel no soporta los mismos patrones de formato de fecha** usados por Angular, .NET u otros marcos.  
> Por ejemplo, las pautas como `zzzz` (contrar la zona temporal) no son reconocidas por Excel.  
> Debido a esto, es posible que necesite definir un formato de fecha separado específicamente para las exportaciones de Excel.

<br><br><br>



---
<a id="419-optional-state-when-returning-from-a-detail-page"></a>
### 4.19 Conservación opcional del estado al volver de una página de detalle

Activa `statePersistence` para recordar los filtros de columna, la búsqueda global, la ordenación, la página actual y el tamaño de página mientras el usuario permanezca dentro del ámbito de una lista y sus detalles. Está **desactivado de forma predeterminada**:

```ts
tableOptions = createTableOptions({
  statePersistence: {
    enabled: true, // false disables automatic save/restore
    key: 'people-list'
  },
  urlTableConfiguration: 'People/GetTableConfiguration',
  urlTableData: 'People/GetTableData'
});
```

**Desactivar la conservación del estado**

Omite `statePersistence` o establece `enabled: false`:

```ts
statePersistence: {
  enabled: false,
  key: 'people-list'
}
```

Cuando se activa, se requiere una clave no vacía y un proveedor del servicio en el componente padre del ámbito; de lo contrario, el componente informa de un error de configuración. Si la función está desactivada, no se necesita el proveedor del servicio de estado.

Cambiar `enabled` a `false` no borra los filtros que ya aparecen en pantalla. Impide guardarlos al salir y elimina la entrada almacenada para esa clave cuando se destruye la tabla. En la siguiente inicialización, una tabla con la función desactivada no restaura esa entrada. Volver a activarla afecta a las siguientes navegaciones; no carga inmediatamente los filtros antiguos en la tabla visible.

Cada tabla necesita una clave única dentro de su ámbito. Incluye cualquier identificador de contexto (por ejemplo, el identificador del cliente) en la clave cuando la misma tabla muestre distintos conjuntos de datos.

**Definir el ámbito en la aplicación que utiliza el componente**

Proporciona `ECSPrimengTableStateService` en un **componente** padre que permanezca activo al navegar entre la lista y sus páginas de detalle:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ECSPrimengTableStateService } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'app-people-scope',
  standalone: true,
  imports: [RouterOutlet],
  providers: [ECSPrimengTableStateService],
  template: '<router-outlet />'
})
export class PeopleScope {}
```

Agrupa las rutas relacionadas bajo ese componente, utilizando tus propios componentes de lista y detalle:

```ts
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'people',
    component: PeopleScope,
    children: [
      { path: '', pathMatch: 'full', component: PeopleList },
      { path: ':id/edit', component: PersonDetail }
    ]
  },
  { path: 'invoices', component: InvoiceList }
];
```

Utiliza Angular Router para navegar entre la lista y su detalle sin recargar la aplicación. Por ejemplo, dentro del componente de lista:

```ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

private readonly router = inject(Router);

editPerson(row: { rowID: string }): void {
  void this.router.navigate(['/people', row.rowID, 'edit']);
}
```

Conecta la propiedad `action` de un botón de fila con `this.editPerson(row)`. Vuelve desde el detalle con `routerLink="/people"` (importando `RouterLink`) o con `router.navigate(['/people'])`. Una recarga completa, incluida la navegación mediante `window.location`, descarta el ámbito almacenado en memoria.

| Navegación | Resultado |
|---|---|
| Lista de personas → detalle de persona → lista de personas | Restaura la última consulta y solicita los datos actualizados |
| Lista de personas → facturas → lista de personas | Comienza sin la consulta temporal anterior |
| Detalle de persona → facturas → lista de personas | Comienza sin la consulta temporal anterior |
| Conservación del estado desactivada | Utiliza el comportamiento normal de inicio de la tabla |

La tabla guarda el estado cuando se destruye el componente de lista. El servicio del padre permanece activo durante la navegación al detalle. Al salir del padre, se destruye el servicio y se descartan sus estados. Las recargas del navegador y las pestañas nuevas comienzan sin ese estado: esta función utiliza únicamente la memoria, no sessionStorage, localStorage ni la base de datos.

No proporciones el servicio en la raíz de la aplicación, en `app.config.ts` ni en el propio componente de lista. Un proveedor en la raíz conservaría el estado entre pantallas sin relación; uno en la lista se destruiría al navegar al detalle. Utiliza `providers` del componente padre, no `providers` de la configuración de rutas, para vincular su duración a la del componente. Esto presupone la destrucción normal de rutas de Angular; una RouteReuseStrategy personalizada que desacople el padre debe gestionar explícitamente la duración del estado.

**Restauración y vistas existentes**

El estado se restaura después de cargar la configuración del backend y las vistas de inicio, antes de la primera consulta de datos. Se conservan los metadatos actuales de las columnas y se ignoran los filtros y criterios de ordenación de campos eliminados. Las fechas siguen siendo objetos Date y se restauran las selecciones de filtros predefinidos.

El estado temporal tiene prioridad sobre una vista guardada marcada para el inicio. Si no existe estado temporal, incluso cuando la función está desactivada, se mantiene el comportamiento de las vistas guardadas. Salir del ámbito elimina únicamente el estado temporal; las vistas guardadas explícitamente siguen disponibles y pueden aplicarse al inicio.

No se almacenan los datos de las filas, las selecciones de filas ni el filtro de filas seleccionadas. La distribución de columnas sigue gestionándose mediante la función de vistas existente. Restablecer la tabla también borra la consulta recordada. Para eliminar entradas explícitamente, inyecta `ECSPrimengTableStateService` en el ámbito y llama a `clear('people-list')` o a `clear()` para eliminarlas todas; esto no restablece una tabla que ya esté visible. Utiliza `resetTableView()` en esa tabla para restablecer su consulta actual.

**Probar la demo incluida**

Las [rutas de la demo](Frontend/ECSPrimengTable/src/app/app.routes.ts) utilizan `/home` como ámbito de personas, `/home/:id/edit` para el detalle y `/other` como ruta externa al ámbito. Los [componentes del ámbito](Frontend/ECSPrimengTable/src/app/pages/home/navigation-demo.ts) proporcionan el servicio de estado y una configuración compartida para la casilla de verificación. El [componente de lista](Frontend/ECSPrimengTable/src/app/pages/home/home.ts) asigna esa configuración a `tableOptions.statePersistence`.

1. Inicia la API y el frontend siguiendo [Preparación del entorno](#2-setup-the-environment-to-try-the-demo).
2. Abre `/home`. La casilla **Conservar filtros al volver del detalle** está marcada en la demo; en la biblioteca, la función sigue desactivada de forma predeterminada.
3. Aplica un filtro de columna o una búsqueda global y pulsa el botón de edición con forma de lápiz de una fila.
4. Pulsa **Volver al listado de personas**. Se restauran los filtros, la ordenación y la paginación, y se solicitan datos actualizados.
5. Pulsa **Ir a otra sección (salir del ámbito)** y vuelve a la lista. La consulta temporal se habrá descartado.
6. Desmarca **Conservar filtros al volver del detalle**, vuelve a filtrar y repite la navegación al detalle y de regreso. La consulta no se restaura.

La página de detalle solo demuestra la navegación; no modifica registros. Una vista guardada manualmente y marcada para el inicio puede aplicar filtros de forma independiente. Desmarca esa vista para probar un inicio sin filtros.

La configuración de la casilla se conserva entre la lista y el detalle porque pertenece al ámbito. Al salir de él y volver, se crea una configuración nueva.

Desde `Frontend/ECSPrimengTable`, ejecuta las pruebas automatizadas:

```sh
npm run test:state
```

Esto compila la biblioteca y ejecuta pruebas de restauración, destrucción del ámbito, conservación desactivada, vistas de inicio, restablecimiento e inicialización diferida.

---

<a id="5-feature-to-code-mapping"></a>
## 5 Correspondencia entre funcionalidades y código
El propósito de esta sección es proporcionar un cuadro que mapee las características descritas anteriormente a su correspondiente implementación técnica. Utilice la tabla de abajo como referencia para realizar esta asignación.

**Nota**: También se recomienda leer las primeras subsecciones de la sección 6, ya que no están numeradas directamente para que coincidan con las características funcionales, pero todavía proporcionan una orientación útil.

<div align="center">

| Ámbito | Función funcional | Aplicación técnica |
|-|-|-|
| Cuadro | [4.1 Planificación de la tabla](#41-planning-your-table) | [6.1 Conceptos básicos](#61-understanding-the-basics) |
| Cuadro | [4.2 Formato de fechas](#42-date-formatting) | [6.2 Configuración de los formatos de fecha](#62-configuring-date-formats) |
| Columnas | [4.3.1 Tipo de datos](#431-data-type) | [6.3.1 Elección del tipo de datos adecuado](#631-choosing-the-appropriate-data-type) |
| Columnas | [4.3.2 Visibilidad](#432-visibility) | [6.3.2 Configuración de la visibilidad y el orden](#632-configuring-visibility-and-order) |
| Columnas | [4.3.3 Alineación horizontal y vertical](#433-horizontal-and-vertical-alignment) | [6.3.3 Alineación horizontal y vertical](#633-horizontal-and-vertical-alignment) |
| Columnas | [4.3.4 Comportamiento del desbordamiento](#434-overflow-behaviour) | [6.3.4 Comportamiento del desbordamiento](#634-overflow-behaviour) |
| Columnas | [4.3.5 Menú de propiedades de columna](#435-column-properties-menu) | [Menú de propiedades de columna](#635-column-properties-menu) |
| Columnas | [4.3.6 Cambio de tamaño](#436-resize) | [6.3.6 Cambio de tamaño](#636-resize) |
| Columnas | [4.3.7 Reordenación](#437-reorder) | [6.3.7 Reordenación](#637-reorder) |
| Columnas | [4.3.8 Columnas fijas](#438-frozen) | [6.3.8 Columnas fijas](#638-frozen) |
| Columnas | [4.3.9 Descripciones](#439-descriptions) | [6.3.9 Descripciones](#639-descriptions) |
| Columnas | [4.3.10 Información emergente de la celda](#4310-cell-tooltip) | [6.3.10 Información emergente de la celda](#6310-cell-tooltip) |
| Columnas | [4.3.11 Ordenación](#4311-sorting) | [6.3.11 Ordenación](#6311-sorting) |
| Columnas | [4.3.12 Filtrado](#4312-filtering) | [6.3.12 Filtrado](#6312-filtering) |
| Columnas | [4.3.13 Filtros predefinidos](#4313-predefined-filters) | [Filtros predefinidos](#6313-predefined-filters) |
| Columnas | [4.3.14 Ancho inicial](#4314-initial-width) | [6.3.14 Ancho inicial](#6314-initial-width) |
| Rows | [4.4.1 Selección individual](#441-single-select) | [6.4.1 Selección individual](#641-single-select) |
| Rows | [4.4.2 Selección mediante casillas de verificación](#442-checkbox-select) | [6.4.2 Selección mediante casillas de verificación](#642-checkbox-select) |
| Rows | [4.4.3 Estilos dinámicos](#443-dynamic-styling) | [6.4.3 Estilos dinámicos](#643-dynamic-styling) |
| Cuadro | [4.5 Botones de acción](#45-action-buttons) | [6.5 Configuración de los botones de acción de filas y encabezados](#65-setting-up-row-and-header-action-buttons) |
| Cuadro | [4.6 Filtro global](#46-global-filter) | [6.6 Configuración del filtro global](#66-configuring-the-global-filter) |
| Cuadro | [4.7 Paginación y recuento de registros](#47-pagination-and-record-count) | [6.7 Propiedades de paginación](#67-pagination-properties) |
| Cuadro | [4.8 Copiar el contenido de una celda](#48-copy-cell-content) | [6.8 Copiar el contenido de una celda](#68-copy-cell-content) |
| Cuadro | [4.9 Altura dinámica](#49-dynamic-height) | [6.9 Altura dinámica](#69-dynamic-height) |
| Cuadro | [4.10 Inicio diferido](#410-deferred-startup) | [6.10 Inicio diferido](#610-deferred-startup) |
| Cuadro | [4.11 Cambio dinámico del endpoint de datos](#411-changing-the-data-endpoint-dinamically) | [6.11 Cambio dinámico del endpoint de datos](#611-changing-the-data-endpoint-dinamically) |
| Informe de Excel | [4.12 Informe de Excel](#412-excel-report) | [6.12 Configuración de los informes de Excel](#612-configuring-excel-reports) |
| Vistas | [4.13 Vistas](#413-views) | [6.13 Configuración de vistas](#613-setting-up-views) |
| Columnas | [4.14 Exclusión dinámica configurable de columnas](#414-configurable-dynamic-column-exclusion) | [6.14 Exclusión dinámica configurable de columnas](#614-configurable-dynamic-column-exclusion) |
| Cuadro | [4.15 Descripción de la tabla](#415-table-description) | [6.15 Descripción de la tabla](#615-table-description) |
| Cuadro | [4.16 Leyenda de la tabla](#416-table-legend) | [6.16 Leyenda de la tabla](#616-table-legend) |
| Cuadro | [4.17 Restablecer la vista de la tabla](#417-reset-table-view) | [6.17 Restablecer la vista de la tabla](#617-reset-table-view) |
| Columnas | [4.18 Atributos dinámicos configurables de las columnas](#418-configurable-dynamic-column-attributes) | [6.18 Atributos dinámicos configurables de las columnas](#618-configurable-dynamic-column-attributes) |

</div>

<br><br><br>



---
<a id="6-technical-overview"></a>
## 6 Descripción técnica
El objetivo de esta sección es proporcionar un panorama técnico de la tabla **ECS PrimeNG**. Se sumerge en las opciones de configuración y los detalles de la implementación, dando a los desarrolladores una comprensión clara de cómo funciona la tabla bajo la capucha. Esta sección le ayuda a captar la mecánica, e integrar la tabla de manera eficiente en sus proyectos.

<br><br>

<a id="table-startup-flow-and-rendering-limitations"></a>
### Flujo de inicio de la tabla y limitaciones de renderizado
El **ECS PrimeNG Table**, cuando se carga en un componente, sigue la secuencia de abajo (a menos que aplace el proceso de inicio):
```
Component is loaded.
└─> Fetch table configuration.
    └─> Load views (if enabled) and preload a view if previously selected by the user.
        └─> First data retrieval.
```

> [!CAUTION]
> Si está utilizando SSR Angular, tenga en cuenta que este componente actualmente solo admite **client-side rendering (CSR)**. Intentar utilizar Server-Side Rendering (SSR) o renderizado estático resultará en errores.

<br><br>



<a id="recommended-architecture"></a>
### Arquitectura recomendada
Al construir puntos finales que impliquen lógica empresarial, acceso a datos o operaciones complejas, se recomienda seguir una arquitectura capa para promover **separación de preocupaciones**, **testability**, y **maintainability**.  

Una estructura típica (y la utilizada en el proyecto de ejemplo) podría parecerse a esto:
```
Controller
└─> IService (Interface)
    └─> Service (Implementation)
        └─> IRepository (Interface)
            └─> Repository (Implementation, Data Access)
```

**Explicación de cada capa:**
- **Controller**:  
  - Maneja las solicitudes de HTTP de la parte delantera.
  - Valida los parámetros de entrada.
  - Llama el método de interfaz de servicio correspondiente.

- **IService (Interface)**:  
  - Define el contrato para su servicio.
  - Garantiza la consistencia y hace más fácil burlarse o reemplazar el servicio en pruebas unitarias.

- **Service (Implementation)**:  
  - Implementa la lógica de negocio.
  - Recibe solicitudes del controlador y las transforma en consultas de repositorio.
  - Maneja lógica adicional como mapear DTOs, filtrar, ordenar y paginación.

- **IRepository (Interface)**:  
  - Define el contrato para las operaciones de acceso a datos.  
  - Proporciona abstracción sobre la fuente de datos subyacente (por ejemplo, EF Core, API externas).  
  - Hace que sea más fácil burlarse o intercambiar implementaciones en pruebas unitarias.  
  
- **Repository**:  
  - Interacciona directamente con la base de datos u otras fuentes de datos.
  - Ejecuta consultas y devuelve datos crudos.
  - Mantiene la lógica de acceso a los datos separada de la lógica empresarial para mantenerla.

> [!TIP]  
> Este enfoque de capa asegura **separation de preocupaciones**, **testability**, y **scalability**.  
> El `Controller` sólo orquesta solicitudes, el `Service` maneja reglas de negocio, y el `Repository` se ocupa de datos brutos.
> La separación de capas en diferentes proyectos es opcional, pero se recomienda para aplicaciones más grandes.  
> Esta estructura promueve la arquitectura **clean** y hace más fácil escalar o reemplazar partes de forma independiente.

<br><br>



<a id="61-understanding-the-basics"></a>
### 6.1 Conceptos básicos
Para cada **ECS PrimeNG table** que desee utilizar, incluso al mostrar datos simples sin características adicionales como botones personalizados o tipos de datos específicos (por ejemplo, fecha, lista), se requiere la siguiente configuración mínima:

- **Backend:**
  - **DTO:** Un objeto de transferencia de datos decorado con un atributo especial que especifica los parámetros utilizados para configurar las columnas de la tabla.
  - **Endpoints:** Se requieren dos puntos finales. Uno proporciona la configuración de la tabla, y el otro recupera datos paginados al aplicar todas las reglas de ordenación y filtrado.

- **Frontend:**
  - **Componente:** Importar el `ECSPrimengTable` en el componente que mostrará la tabla.
  - **Template:** Utiliza el elemento `<ecs-primeng-table>` en el HTML del componente y configura las propiedades mínimas requeridas.

Esta sección se centra en crear una tabla que muestre datos simples sin acciones de fila u otras características avanzadas.

<br><br>


<a id="611-backend"></a>
#### 6.1.1 Backend
<a id="6111-setting-up-the-dto"></a>
##### 6.1.1.1 Configuración del DTO
En primer lugar, siempre necesita un DTO que represente la tabla completa, incluyendo todas las columnas posibles, tanto las columnas de uso interno como las columnas mostradas al usuario (columnas que son siempre visibles o opcionalmente ocultables).  

Su DTO debe incluir un `RowID` de tipo `Guid` con este nombre exacto, ya que muchas de las características avanzadas de la tabla dependen de él (por ejemplo, el selector de filas). Los valores de esta columna deben ser únicos.

Aquí está un ejemplo DTO con `RowID` y tres tipos de datos básicos: texto, numérico y booleano:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Username")]
	public string Username { get; set; } = string.Empty;

	[ColumnAttributes("Money", dataType: DataType.Numeric)]
	public decimal Money { get; set; }

	[ColumnAttributes("Has a house", dataType: DataType.Boolean)]
	public bool House { get; set; }
}
```
Desde el DTO anterior, los fundamentos de una tabla se definen con tres columnas visibles y una cuarta columna (`RowID`) que está oculta a los usuarios finales pero disponible en el extremo delantero.

Algunos puntos importantes sobre este ejemplo DTO:
- Cada propiedad destinada como columna tiene un decorador `ColumnAttributes`. Esto indica a **ECS PrimeNG table** que debe incluir esta propiedad como columna. Las propiedades sin este decorador son ignoradas y no aparecerán en la tabla.
- La columna `RowID` tiene `sendColumnAttributes` configurada en `false`, garantizando que sus datos estén siempre disponibles en el extremo delantero mientras permanecen ocultos en la tabla. Los usuarios no pueden cambiar su visibilidad. Esta opción se puede aplicar a cualquier columna que desee mantener oculto de los usuarios pero accesible en el extremo frontal.
- El primer parámetro de `ColumnAttributes` especifica el nombre de la columna mostrado en el extremo frontal. En este ejemplo, las columnas visibles serán `"Username"`, `"Money"` y `"Has a house"`.
- Es importante manejar correctamente las propiedades nulables y no nulables para asegurar la cartografía adecuada. Por ejemplo, si `"Username"` no puede ser null en su conjunto de datos, declararlo como `string` e inicializarlo con `string.Empty`. Si puede ser nulo, use `string?` sin asignar un valor predeterminado.
- Por defecto, las columnas se tratan como `Text`. Para utilizar otros tipos de datos, especifique el parámetro `dataType` en `ColumnAttributes`.
- El orden de las propiedades de la clase determina su orden de izquierda a derecha en la tabla final en el extremo frontal. Las excepciones son columnas fijas: las fijadas a la izquierda aparecen antes de todas las demás columnas, y las fijadas a la derecha aparecen al final de la tabla.

> [!NOTE]
> Los posibles tipos de datos son:
> - **Text**: Para valores de cadena.
> - **Numeric**: Para números como `int`, `long`, `decimal`, etc.
> - **Boolean**: Para valores `bool`.
> - **Date**: Para valores `DateTime`. Otras opciones de personalización se explican en capítulos posteriores.
> - **List**: Un tipo `Text` especializado utilizado con `predefined filters` para representar datos separados por `;`, incluyendo etiquetas, iconos, imágenes o texto.

> [!IMPORTANT]
> Siempre incluye una propiedad `RowID` en tu clase con un decorador `ColumnAttributes` y `sendColumnAttributes` configurado en `false`. Esta columna es requerida por la tabla para el rendimiento de renderizado y para características avanzadas. Asegúrese de que los valores en esta columna son **unique**.

> [!TIP]
> Todas las propiedades destinadas a ser columnas de tabla deben tener un decorador `ColumnAttributes`. Esto le dice a **ECS PrimeNG table** que los incluya como columnas. Las propiedades sin este decorador son ignoradas y no aparecerán en la tabla.

> [!CAUTION]
> Evite agregar una propiedad llamada `Selector` en su clase, especialmente si planea utilizar la función de selección de filas. Este nombre se reserva como una columna virtual utilizada internamente por la tabla, y utilizarla puede causar conflictos.

<br><br>



<a id="6112-setting-up-the-endpoints"></a>
##### 6.1.1.2 Configuración de los endpoints
<a id="creating-the-table-configuration-endpoint"></a>
###### Creación del endpoint de configuración de la tabla
El primer punto final requerido es el punto final de configuración **table**, que proporciona la configuración **minimum** necesaria para que la tabla funcione. Este punto final debe ser un método `GET`.

Junto con el punto final de datos, forma la configuración **core** necesaria para ejecutar la tabla. Los puntos finales y la lógica adicionales se pueden añadir más adelante según sea necesario.

Este punto final debe devolver un `TableConfigurationModel`, que se puede obtener llamando a su servicio:
```c#
EcsPrimengTableService.GetTableConfiguration<T>();
```

Donde `T` es tu clase DTO.

El método `GetTableConfiguration` inspecciona automáticamente el `ColumnAttributes` definido en el DTO (`T`) y construye un `TableConfigurationModel` que contiene:

- **Column definitions**: Metadatos sobre cada columna (nombre, tipo, visibilidad, orden, estado congelado, etc.).
- **Allowed items per page**: Las opciones de paginación disponibles para la tabla.
- **Date format**: El formato predeterminado para mostrar los valores de la fecha.
- **Timezone**: La zona horaria utilizada para la renderización fecha/hora.
- **Culture**: La cultura utilizada para el formato numérico y de fecha.
- **Max permitió vistas**: El número máximo de vistas que un usuario puede guardar.

Por defecto, se aplican los siguientes valores si no se proporcionan anulaciones:
```c#
internal class TableConfigurationDefaults {
    public static readonly int[] AllowedItemsPerPage = [10, 25, 50];
    public static readonly string DateFormat = "dd-MMM-yyyy HH:mm:ss zzzz";
    public static readonly string DateTimezone = "+00:00";
    public static readonly string DateCulture = "en-US";
    public static readonly byte MaxViews = 10;
    public static readonly string ExportDateFormat = "dd-mmm-yyyy hh:mm:ss";
}
```

<br>

**_Ejemplo_**

A continuación se muestra un ejemplo de trabajo mínimo que muestra cómo implementar la configuración **table endpoint** y su servicio correspondiente asumiendo que utiliza el `TableConfigurationDefaults`. No es necesario que el repositorio ya que no hay acceso a los datos necesarios en este punto final.

El punto final **table** en el controlador puede parecerse a esto:
```c#
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase {
    private readonly ITestService _service;

    public TestController(ITestService service) {
        _service = service;
    }

    [HttpGet("[action]")]
    public IActionResult GetTableConfiguration() {
        try {
            return Ok(_service.GetTableConfiguration()); // Delegates the configuration retrieval to the service
        } catch (Exception ex) {
            return StatusCode(StatusCodes.Status500InternalServerError, 
                $"An unexpected error occurred: {ex.Message}");
        }
    }
}
```

El `GetTableConfiguration` de su `service` puede parecerse a esto (definición de servicio mínimo):
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {

        public TableConfigurationModel GetTableConfiguration() {
            return EcsPrimengTableService.GetTableConfiguration<TestDto>();
        }
    }
}
```

> [!TIP]
> Reemplazar `TestDto` con el DTO utilizado para su tabla. El servicio leerá automáticamente sus definiciones de columna y construirá la configuración en consecuencia.

<br><br>



<a id="creating-the-table-data-endpoint"></a>
###### Creación del endpoint de datos de la tabla
El segundo punto final requerido es el punto final de datos **table**, que proporciona los datos **minimum necesarios** para poblar la tabla. Este punto final debe ser un método `POST`.

Este punto final, junto con el punto final de configuración de la tabla, forma la configuración **core** requerida para que la tabla funcione. Maneja la recuperación de datos, filtrado, ordenación y paginación, asegurando que la tabla muestre las filas correctas basadas en la interacción del usuario y los parámetros de consulta. Los puntos finales adicionales o la lógica empresarial se pueden añadir más adelante según sea necesario.

Este punto final debe devolver un `TablePagedResponseModel`, que se puede obtener llamando a su servicio:
```c#
EcsPrimengTableService.PerformDynamicQuery(inputData, baseQuery);
```

Donde:
- `inputData` es un `TableQueryRequestModel` enviado por el **ECS PrimeNG table** en el cuerpo de solicitud.
- `baseQuery` es un `IQueryable` construido sobre una clase DTO decorada con `ColumnAttributes`.  
  Este debe ser el **same DTO** utilizado en el punto final de configuración de la tabla (ejemplo de sección anterior).

El método `PerformDynamicQuery` ejecuta una secuencia de operaciones (detallada abajo) y devuelve un `TablePagedResponseModel` que contiene:
- **Current page**: El número de página donde se encuentra el usuario.
- **Accesorios totales**: Se aplican el número total de registros *after*.
- **Unfiltered total records**: El número total de registros *before* se aplican filtros. 
- **Data**: El contenido real de la página, representado como datos dinámicos.

El método `EcsPrimengTableService.PerformDynamicQuery()` realiza los siguientes pasos para:
1. **Sorting**: Aplica las reglas de ordenación definidas en el `TableQueryRequestModel`:  
   - Si se proporcionan reglas, se aplican.
   - Si no se proporcionan reglas y se especifica un `defaultSortColumnName`, se aplicará ese tipo predeterminado.
   - Si no se proporciona ninguno, no se realiza ninguna ordenación.
2. **Count before filtering**: Delega una operación `COUNT` al motor de bases de datos para determinar el número total de registros *before* se aplican filtros.
3. **Global filter**: Si se especifica en el `TableQueryRequestModel`, aplica el filtro global a todas las columnas elegibles.
4. **Column filters**: Aplica todas las reglas de filtro per-column de la `TableQueryRequestModel`, añadiéndolas a la `IQueryable`.
5. **Count después de filtrar**: Delega una operación `COUNT` al motor de bases de datos para determinar el número total de registros Se aplican filtros *after*.
6. **Pagination check**: Calcula el número total de páginas basadas en artículos por página y filtros. Si la página actual supera el recuento de página disponible (por ejemplo, el usuario estaba en la página 100 pero los filtros reducen el conjunto de datos a 7 páginas), la página actual se ajusta a la última página disponible y el frontend se encarga de mover al usuario en consecuencia.
7. **Dynamic select**: Proyectos sólo las columnas requeridas mediante la adición de un `SELECT` al `IQueryable`.
   - La consulta se materializa luego utilizando `ToDynamicList()`, delegando la ejecución a la base de datos.
   - El resultado es una lista que contiene sólo las columnas solicitadas, incluyendo aparte de las solicitadas, las que tienen el `sendColumnAttributes` fijado a `false`.
8. **Return result**: Finalmente, devuelve un `TablePagedResponseModel` con los datos procesados en el frontend.

> [!IMPORTANT]
> Algunos aspectos importantes a considerar siempre son los siguientes:
> - **Validation**: validar siempre el tamaño de la página y las columnas solicitadas antes de llamar a `PerformDynamicQuery`, utilizando `ValidateItemsPerPageAndCols`.
> - **Performance**: Asegúrese de que el `IQueryable` utiliza `AsNoTracking()` ya que no se necesita un seguimiento de entidad. Esto también mejora el rendimiento.
> - **Reusability**: Define un método privado en el servicio que construye la base `IQueryable`. Esto permite reutilizar la misma consulta tanto para el punto final de datos **table** y características como **Excel export**, asegurando la coherencia de los datos.

<br>

**_Ejemplo_**

A continuación se muestra una configuración simplificada que muestra cómo implementar el endpoint de datos **table**, su servicio y repositorio.

El punto final **table data** en su controlador puede parecerse a esto:
```c#
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase {
    private readonly ITestService _service;

    public TestController(ITestService service) {
        _service = service;
    }

    [HttpPost("[action]")]
    public IActionResult GetTableData([FromBody] TableQueryRequestModel inputData) {
        try {
            (bool success, TablePagedResponseModel data) = _service.GetTableData(inputData);
            if(!success) {
                return BadRequest("Invalid items per page");
            }
            return Ok(data);
        } catch (Exception ex) {
            return StatusCode(StatusCodes.Status500InternalServerError, 
                $"An unexpected error occurred: {ex.Message}");
        }
    }
}
```

El método `GetTableData` en su servicio se puede implementar de esta manera (ejemplo mínimo). Incluye un método `GetBaseQuery` privado que centraliza la lógica de la consulta base, lo que le permite a **reuse it** para características tales como **Excel export**, garantizando la consistencia a través de puntos finales. Esta implementación de servicios también hace uso de un repositorio para acceder a los datos subyacentes:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true, EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery()));
        }

        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    Money = u.Money,
                    House = u.House
                });
        }
    }
}
```

El repositorio que accede a su servicio podría parecerse a esto:
```c#
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace ECSPrimengTableExample.Repository {
    public class TestRepository {

        private readonly primengTableReusableComponentContext _context;

        public TestRepository(primengTableReusableComponentContext context) {
            _context = context;
        }

        public IQueryable<TestTable> GetTableData() {
            return _context.TestTables
                   .AsNoTracking();
        }
    }
}
```

Con esta configuración, su punto final de datos de tabla es totalmente funcional y listo para integrarse con el frontend de tabla ECS PrimeNG.

<br><br>



<a id="612-frontend"></a>
#### 6.1.2 Frontend
Asumiendo que haya completado todos los pasos en la sección de configuración y que está utilizando componentes independientes en su frontend, esta sección le guiará sobre cómo implementar una tabla básica **ECS PrimeNG** que simplemente muestra datos.

En el archivo TipoScript de componente deseado, una definición mínima debe parecerse a esto (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData"
  });
}
```
> [!CAUTION]
> Es importante que la variable que utiliza como `tableOptions` sea inicializada usando `createTableOptions`. Esto asegura que la tabla se cree con la configuración base necesaria, evitando errores o comportamiento inesperado.

En este componente, sólo se definen las trayectorias a los puntos finales de la API. Se supone que el componente de tabla ECS PrimeNG ya se ha proporcionado con la URL base de la API en la inyección de servicio HTTP.

En el HTML de su componente, la tabla se puede mostrar de la siguiente manera:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

Sólo tienes que pasar la propiedad `tableOptions`.

Una vez que inicie su API y sirva al frontend, usted debe ser capaz de ver la tabla renderizada en la página si todo se establece correctamente.

Además, puede suscribirse a eventos de ciclo de vida de tabla para detectar cuando se ha completado un **data fetch**. Esto es útil, por ejemplo, cuando el usuario cambia la página, aplica un filtro o activa cualquier acción que requiera recargar los datos de la tabla si necesita escucharlo.
- **`onDataEndUpdate`**: Emitido después de la tabla ha terminado de buscar y actualizar sus datos. Este evento no proporciona ninguna carga útil (tipo: `void`).

Un ejemplo de esta suscripción podría ser:

En el archivo TipoScript del componente deseado:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData"
  });

  onDataUpdated(): void {
    console.log("Table data has been refreshed.");
    // Add your custom logic here (e.g., update UI state, log analytics, etc.)
  }
}
```

En su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions" (onDataEndUpdate)="onDataUpdated()"/>
```

<br><br>



<a id="62-configuring-date-formats"></a>
### 6.2 Configuración de los formatos de fecha
En su servicio donde se llama `EcsPrimengTableService.GetTableConfiguration`, puede pasar parámetros adicionales para personalizar cómo se muestran las fechas.

La tabla **ECS PrimeNG** se encargará automáticamente de la conversión de la fecha, y las configuraciones que defina en el backend se reflejarán en el frontend al renderizar las celdas de la tabla.

Para la máxima flexibilidad, se recomienda almacenar las preferencias del usuario para:
- **Date format**: Una cadena, por ejemplo. `"dd-MMM-yyyy HH:mm:ss zzzz"`
- **Date timezone**: A string, e.g. `"+00:00"`
- **Date culture**: Una cadena, por ejemplo. `"en-US"`
- **Formato de fecha para los informes de Excel**: Una cadena, por ejemplo. `"dd-MMM-yyyy HH:mm:ss"`

Supongamos que estos valores se almacenan en una variable llamada `userPreferences` y que usted está trabajando con un `TestDto`.

Un ejemplo de la implementación de servicios podría parecerse a esto:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {

        public TableConfigurationModel GetTableConfiguration() {
            var userPreferences = getUserDataFromDatabase(); // Get the user preferences from the database
            return EcsPrimengTableService.GetTableConfiguration<TestDto>(null, userPreferences.dateFormat,
                userPreferences.dateTimezone, userPreferences.dateCulture, userPreferences.exportDateFormat);
        }
    }
}
```

> [!NOTE]
> Si no se especifican argumentos, el formato predeterminado para las fechas es:
> - **Date format**: `"dd-MMM-yyyy HH:mm:ss zzzz"`
> - **Date timezone**: `"+00:00"`
> - **Date culture**: `"en-US"`
> - **Formato de fecha para los informes de Excel**: `"dd-MMM-yyyy HH:mm:ss"`

Es posible anular el formato global de fecha de tabla para columnas individuales directamente desde el backend especificando los campos pertinentes en el `ColumnAttributes` del DTO utilizado para construir la tabla. Además, diferentes formatos de fecha, zonas horarias y configuraciones de visualización se pueden aplicar específicamente para la exportación de Excel, proporcionando la máxima flexibilidad.

<br><br>



<a id="63-columns"></a>
### 6.3 Columnas
<a id="631-choosing-the-appropriate-data-type"></a>
#### 6.3.1 Elección del tipo de datos adecuado
Por defecto, todas las columnas de su tabla son tratadas como **text**. Sin embargo, como se describe en la documentación funcional relacionada, existen **cinco tipos de datos principales** disponibles.

Elegir el tipo de datos correcto es importante porque:
- Influye en cómo se producen las celdas en la tabla.
- Afecta cómo se comportan ciertas características **ECS PrimeNG table** (por ejemplo, filtrado, ordenación, formato).

Además, es crucial para **declare si una columna es nullable**. Si esto no está correctamente definido, las consultas dinámicas pueden fallar, causando que su punto final de datos de tabla se rompa en ciertos escenarios.

Un enum llamado `DataType` está disponible, que define los cinco posibles tipos de datos que puede asociar con una columna.

Para configurar el tipo de datos, simplemente definirlo en la propiedad `dataType` de la `ColumnAttributes` aplicada a sus propiedades DTO.

<br>

**_Ejemplo_**

Considere un DTO con:  
- Un identificador de filas (GUID)  
- Dos cuerdas (una nulable, una no)  
- Un valor numérico  
- Una fecha nula  
- Un booleano  

La declaración de la ODT parecería así:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Username")]
	public string Username { get; set; } = string.Empty;

	[ColumnAttributes("Alias")]
	public string? Alias { get; set; }

	[ColumnAttributes("Money", dataType: DataType.Numeric)]
	public decimal Money { get; set; }

	[ColumnAttributes("Birthday", dataType: DataType.Date)]
	public DateTime? Birthday { get; set; }

	[ColumnAttributes("Has a house", dataType: DataType.Boolean)]
	public bool House { get; set; }
}
```

> [!IMPORTANT]
> Siempre seleccione el `DataType` adecuado para sus columnas para asegurar la correcta renderización y el manejo de consultas confiable. 

> [!CAUTION]
> Si una columna puede contener valores nulos, debe marcar explícitamente la propiedad como nullable en C# por appending `?` después del tipo.
 
<br><br>



<a id="632-configuring-visibility-and-order"></a>
#### 6.3.2 Configuración de la visibilidad y el orden
<a id="visibility"></a>
##### Visibilidad
Por defecto, todas las columnas son **visible**. Puede controlar la visibilidad de la columna usando el `ColumnAttributes` de su DTO configurando las siguientes opciones:

- **`sendColumnAttributes`**
  - Utilice esto cuando necesite una columna para funcionalidad **frontend** pero no lo desee visible para el usuario.
  - Si se establece en `false`, la columna siempre permanecerá oculta, y todas las otras opciones de visibilidad (`canBeHidden`, `startHidden`) serán ignoradas.
  - Caso de uso de ejemplo: IDs internos, claves o referencias técnicas requeridas por la lógica de aplicación.

- **`canBeHidden`**
  - Determina si el usuario puede cambiar la visibilidad de la columna en el menú de propiedades de la columna.
  - Predeterminado: `true` (los usuarios pueden cambiar la visibilidad).
  - Si se establece en `false`, la columna siempre permanecerá visible, y el usuario no puede ocultarla.

- **`startHidden`**
  - Define si la columna es visible cuando la tabla carga primero.
  - Predeterminado: `false` (la columna es visible inicialmente).
  - Si se establece en `true`, la columna comenzará como oculta, pero el usuario puede hacerlo visible a través del menú de propiedades de la columna.
  - **Important**: si `canBeHidden` es `false`, la opción `startHidden` es ignorada, y la columna siempre será visible.

<br><br>



<a id="order"></a>
##### Orden
Por defecto, las columnas se muestran en el frontend ** siguiendo el orden de su declaración en su DTO class**:
- La primera propiedad en la clase corresponde a la columna **leftmost**.
- La última propiedad corresponde a la columna **rightmost**.

Existen dos excepciones a esta regla:
1. **Frozen columns**: Estas pueden ser sujetadas al lado izquierdo o derecho de la tabla, y siempre permanecerán fijas en esa posición independientemente del orden DTO.
2. **Selector and row action columns** (explicado en secciones posteriores):
   - Si están congelados, permanecen en los lados extremos de la tabla.
   - Si no se congelan, se colocan en los lados, directamente antes de cualquier columna fija.

<br><br>



<a id="633-horizontal-and-vertical-alignment"></a>
#### 6.3.3 Alineación horizontal y vertical
Por defecto, todas las columnas están alineadas **horizontalmente a `Center`** y **verticalmente en `Middle`**, lo que significa que el contenido de cada celda se muestra en su centro.

Se permite a los usuarios cambiar tanto la alineación horizontal como vertical a través del menú de propiedades **column** por defecto.

Si se requieren diferentes alineaciones iniciales, o si la personalización del usuario debe ser restringida, el `ColumnAttributes` del DTO ofrece las siguientes opciones de configuración:

- **Alineación interior**
  - **`dataAlignHorizontal`**: Usa el `DataAlignHorizontal` Enum. Valor predeterminado es `Center`. Los valores posibles `Left`, `Center` y `Right`.
  - **`dataAlignVertical`**: Usa el `DataAlignVertical` Enum. Valor predeterminado es `Middle`. Los valores posibles `Top`, `Middle` y `Bottom`.

- **Restricting alignment changes**
  - **`dataAlignHorizontalAllowUserEdit`**: Por defecto se establece `true`. Si se establece `false`, el usuario no puede cambiar la alineación horizontal de la columna en el menú de propiedades.
  - **`dataAlignVerticalAllowUserEdit`**: Por defecto se establece `true`. Si se establece `false`, el usuario no puede cambiar la alineación vertical de la columna en el menú de propiedades.

<br><br>



<a id="634-overflow-behaviour"></a>
#### 6.3.4 Comportamiento del desbordamiento
Todas las columnas vienen con un comportamiento de desbordamiento **cell predeterminado** de `Hidden`.

Por defecto, se permite a los usuarios cambiar el comportamiento de desbordamiento de una columna a través del menú de propiedades **column**.

Si necesita un comportamiento predeterminado diferente, o si desea evitar que los usuarios lo modifiquen, el `ColumnAttributes` de su DTO ofrece las siguientes opciones:

- **`cellOverflowBehaviour`**: Define cómo se maneja el contenido de la celda cuando supera el ancho de la columna. Utiliza el `CellOverflowBehaviour` enum, que tiene dos valores posibles:
  - `Hidden` (default): exceder el ancho de la columna será truncado y no se mostrará.
  - `Wrap`: El contenido de Exceso se envuelve en nuevas líneas, permitiendo que la fila se expanda verticalmente según sea necesario para adaptarse a todo el contenido.

- **`cellOverflowBehaviourAllowUserEdit`**: Controla si los usuarios pueden cambiar el comportamiento de desbordamiento de la columna a través del menú de propiedades de columna. Default es `true`. Establecelo `false` para evitar que los usuarios modifiquen esta configuración.

> [!NOTE]
> Cuando el tipo de datos de la columna es `boolean`, el ajuste `cellOverflowBehaviour` se anulará automáticamente a `Hidden`.

<br><br>



<a id="635-column-properties-menu"></a>
#### 6.3.5 Menú de propiedades de columna
Como se describe en la documentación funcional para esta sección, la tabla incluye un botón en la esquina superior izquierda por defecto. Al hacer clic, este botón abre el menú de propiedades **Column**.

Puede personalizar el comportamiento del menú de propiedades de la columna a través de las siguientes opciones de tabla:

- **`selectorEnabled`**: *(por defecto: `true`)* Controla la visibilidad del botón de arriba izquierda.
  - `true`: El botón es visible y los usuarios pueden abrir el menú de propiedades de la columna.
  - `false`: El botón está escondido.
- **`selectorIcon`**: *(default: PrimeNG icono `pi pi-pen-to-square`)* Especifica el icono mostrado en el botón. Puede reemplazarlo con cualquier icono de PrimeNG u otras bibliotecas como Font Awesome o Material Icons.
- **`selectorOrderByColumnName`**: *(por defecto: `true`)* Cuándo `true`, las columnas en el selector se muestran alfabéticamente (A–Z). Cuándo `false`, las columnas guardan el orden proporcionado por el backend.

<br><br>



<a id="636-resize"></a>
#### 6.3.6 Cambio de tamaño
Por defecto, todas las columnas son reizables. La única excepción es las columnas fijas, que no pueden ser redimensionadas.

Para evitar que los usuarios redimensionen una columna específica no congelado, puede utilizar la siguiente opción en el `ColumnAttributes` de la columna dentro del DTO:
- **`canBeResized`**: Defaults to `true`. Si se establece `true`, la columna puede ser redimensionada por el usuario. Set to `false` para desactivar el redimensionamiento para esa columna.

Además, hay una propiedad llamada `initialWidth` que se puede utilizar para establecer el ancho inicial de una columna en píxeles.

<br><br>



<a id="637-reorder"></a>
#### 6.3.7 Reordenación
Por defecto, todas las columnas son reordenables, excepto las columnas fijas que no se pueden mover.

Para evitar que los usuarios reordenen una columna específica no congelado, utilice la siguiente opción en el `ColumnAttributes` de la columna dentro del DTO:
- **`canBeReordered`**: Defaults to `true`. Cuándo `true`, el usuario puede arrastrar y soltar la columna para cambiar su posición. Set to `false` para desactivar esta funcionalidad para esa columna.

<br><br>



<a id="638-frozen"></a>
#### 6.3.8 Columnas fijas
Activar una columna fija en su tabla que sigue el desplazamiento horizontal es directo.

En el `ColumnAttributes` de su columna dentro del DTO, las siguientes propiedades determinan el comportamiento de la columna fija:
- **`frozenColumnAlign`**: Un enum de tipo `FrozenColumnAlign`, predeterminado a `None`. Los valores disponibles son:
  - `None`: La columna no se congelará y no seguirá desplazamiento horizontal.
  - `Left`: La columna está congelada a la izquierda, permaneciendo visible en el lado izquierdo mientras la tabla se desplaza horizontalmente.
  - `Right`: La columna está congelada a la derecha, permaneciendo visible en el lado derecho mientras la tabla se desplaza horizontalmente.

Cuando una columna tiene un valor `frozenColumnAlign` que no sea `None`, se aplican las siguientes reglas:
- **`canBeResized`** se anula automáticamente `false`. Las columnas congelados no pueden ser redimensionadas.
- **`canBeReordered`** se anula automáticamente `false`. Las columnas congelados no pueden ser reordenadas.
- **`initialWidth`** se establece que `100px` por defecto al congelar la columna. Usted puede ajustar este valor si es necesario especificando un `initialWidth` más grande que 0 para anular este valor predeterminado.

<br><br>



<a id="639-descriptions"></a>
#### 6.3.9 Descripciones
Si desea que una columna incluya una descripción, debe definirse en el backend dentro de su clase DTO modificando el `ColumnAttributes` de la columna. Los bienes pertinentes son:
- **`columnDescription`**: Defaults a una cuerda vacía. Si se proporciona un valor, aparecerá un icono de información en el encabezado de la columna. Cuando el usuario salta sobre este icono, se mostrará un elemento de herramienta que muestra la descripción especificada en el frontend.

El icono mostrado para descripciones de columnas se puede personalizar a nivel de tabla desde el frontend utilizando la configuración `ITableOptions`:
- **`columnDescriptionIcon`** *(Default: `"pi pi-info-circle"`)*: Define el icono mostrado en el encabezado de la columna cuando una descripción está presente. Si no se especifica, se utilizará el icono de información predeterminado.

<br><br>



<a id="6310-cell-tooltip"></a>
#### 6.3.10 Información emergente de la celda
De forma predeterminada, todas las celdas (excepto las que tienen un tipo de datos `boolean`) muestran una información sobre herramientas con su valor cuando el usuario se desplaza sobre la celda.

Si desea desactivar este comportamiento, o mostrar un puntaje de herramientas basado en una columna diferente, puede configurar las siguientes propiedades en el `ColumnAttributes` de su clase DTO:
- **`dataTooltipShow`**: Defaults to `true`. Cuando se establece `false`, no se mostrará ningún elemento de herramienta cuando el usuario se desplaza sobre una celda en esa columna.
- **`dataTooltipCustomColumnSource`**: Defaults a una cuerda vacía. Le permite mapear el contenido de la herramienta a otra columna.

Utilizar `dataTooltipCustomColumnSource` para hacer referencia a una columna con `sendColumnAttributes` fijada en `false` puede ser particularmente útil, ya que esto asegura que los datos estén siempre disponibles en el frontend para el uso de herramientas, incluso si no se muestra directamente en la tabla.

> [!IMPORTANT]
> La columna referenciada en `dataTooltipCustomColumnSource` debe tener el mismo nombre que la propiedad en la clase.
> El primer personaje puede ser mayúscula o minúscula, ya que se convertirá automáticamente en minúscula para el frontend.

<br><br>



<a id="6311-sorting"></a>
#### 6.3.11 Ordenación
Todas las columnas de la tabla (excepto para la columna de acciones y la columna selectora de filas) pueden ser clasificadas por el usuario.

Para desactivar la ordenación de una columna específica, configurela en el backend modificando el `ColumnAttributes` de la columna en su clase DTO:
- **`canBeSorted`**: Defaults to `true`. Cuando se establece `false`, la columna no puede ser ordenada por el usuario.

También puede definir una orden de ordenación predeterminada que se aplicará cuando el usuario no haya establecido ningún tipo de orden.

Para ello, debe crear listas **two de la misma longitud**:
- Una lista de nombres de columna (como cadenas), donde cada nombre coincide con el nombre de propiedad de su clase DTO.
- Una lista de pedidos de tipo (utilizando el enum `ColumnSort` proporcionado por la tabla **ECS PrimeNG**) correspondiente a cada columna.

Ambas listas deben ser pasadas como argumentos a `EcsPrimengTableService.PerformDynamicQuery` en su servicio y la ordenación se aplicará en el orden de sus listas.

Un ejemplo de un servicio que aplica ordenación predeterminada a `Age` y `EmploymentStatusName`, uno en orden descendente y el otro en orden ascendente se vería así:  
```c#
using ECSPrimengTable.Services;
using ECS.PrimengTable.Enums;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        private readonly List<string> columnsToOrderByDefault = ["Age", "EmploymentStatusName"];
        private readonly List<ColumnSort> columnsToOrderByOrderDefault = [ColumnSort.Descending, ColumnSort.Ascending];

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true, EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), null, columnsToOrderByDefault, columnsToOrderByOrderDefault));
        }

        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    Money = u.Money,
                    House = u.House
                });
        }
    }
}
```

> [!WARNING]  
> Ambas listas de tipos predeterminados deben tener la misma longitud.

En el frontend, tiene dos opciones de configuración relacionadas con la ordenación. Dentro de la entrada `header` de la variable de su componente que sostiene el `ITableOptions`, las siguientes propiedades están disponibles:
- **`clearSortsEnabled`**: Defaults to `true`. Cuando se establece `false`, el **claras** El botón estará oculto.
- **`clearSortsIcon`**: Permite personalización de la **claras** icono de botón. Por defecto, utiliza `pi pi-sort-alt-slash` de la biblioteca de iconos PrimeNG. Usted puede utilizar otros iconos de PrimeNG o proveedores de terceros, como Iconos Materiales o Iconos de Fuente.

<br><br>



<a id="6312-filtering"></a>
#### 6.3.12 Filtrado
Todas las columnas de la tabla (excepto para la columna de acciones) pueden ser filtradas por el usuario.

Para desactivar el filtrado para una columna específica, configure en el backend usando `ColumnAttributes` de la columna:
- **`canBeFiltered`**: Defaults to `true`. Cuando se establece `false`, la opción de filtro no estará disponible para esa columna.

En el frontend, dos opciones de configuración relacionadas con el filtrado están disponibles bajo la entrada `header` de la variable de su componente que sostiene el `ITableOptions`:
- **`clearFiltersEnabled`**: Defaults to `true`. Cuando se establece `false`, el **filtros claros** El botón estará oculto.
- **`clearFiltersIcon`**: Permite personalización de la **filtros claros** icono de botón. Por defecto, utiliza `pi pi-filter-slash` de la biblioteca de iconos PrimeNG. También se pueden utilizar otros iconos de las bibliotecas PrimeNG o de terceros (por ejemplo, Iconos Materiales, Iconos de Fuente).

> [!TIP]  
> El menú de filtro mostrado depende del tipo de datos configurado para la propiedad en su clase DTO en el backend.

<br><br>



<a id="6313-predefined-filters"></a>
#### 6.3.13 Filtros predefinidos
> [!CAUTION]  
> No utilice esta característica en columnas que puedan contener un gran número de valores distintos, ya que podría conducir a problemas de rendimiento. Esta característica está destinada a columnas con un pequeño y limitado conjunto de valores.

En algunos escenarios, es posible que desee restringir las opciones de filtro disponibles para una columna a una lista predefinida de posibles valores.

Existen dos estrategias para definir filtros predefinidos:
- **Hardcoding the list in the frontend**: Apto cuando usted tiene una pequeña lista fija de valores (por ejemplo, `"Open"`, `"Closed"`).
- **Siguiendo la lista desde el backend**: El frontend puede llamar a un endpoint antes de cargar la tabla. La tabla admite un proceso de arranque **deferred**, asegurando que no intenta cargar datos hasta que estos valores estén listos (ver la sección *Actualización diferida*).

Independientemente de la estrategia, los filtros predefinidos deben definirse primero en el TipoScript de su componente. Para ello, cree un diccionario y proporcione el número requerido de listas predefinidas que se utilizarán.

> [!NOTE]
> Si una columna puede contener los valores de `null`, usted hace **not** necesidad de añadir `null` al array `IPredefinedFilter`. La tabla simplemente no dará ninguna opción para los valores nulos.

> [!NOTE]  
> La herramienta para un valor predefinido mostrará el contenido de su propiedad `value`.

> [!NOTE]  
> Si está utilizando el tipo de datos `List`, hará que cada valor posible se separe con ";".

> [!TIP]
> Un único elemento del array `IPredefinedFilter` puede utilizar múltiples representaciones al mismo tiempo (por ejemplo, combinando un icono con texto). También puede mezclar diferentes representaciones dentro de la misma matriz: un valor podría ser mostrado con un icono, mientras que otro podría ser mostrado como una etiqueta. 

<br>

**_Ejemplo_**

Gestionar dos listas de filtros predefinidas en la misma tabla (asumiendo que el componente se llama `Home` y es un componente independiente):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions, IPredefinedFilter } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  listOfPredifinedValues1: IPredefinedFilter[] = [];
  listOfPredifinedValues2: IPredefinedFilter[] = [];
  myPredifinedFiltersCollection: { [key: string]: IPredefinedFilter[] } = {
    'nameOfList1': this.listOfPredifinedValues1,
    'nameOfList2': this.listOfPredifinedValues2
  };

  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    predefinedFilters: this.myPredifinedFiltersCollection
  });
}
```

En este punto, la tabla tiene dos listas de filtros predefinidas disponibles: `nameOfList1` y `nameOfList2`.

Para asociar columnas con las listas predefinidas, configurelas en el DTO utilizando `ColumnAttributes`:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Example column 1", filterPredefinedValuesName: "nameOfList1", ...)]
	public string? Column1 { get; set; }

	[ColumnAttributes("Example column 2", filterPredefinedValuesName: "nameOfList2", ...)]
	public string? Column2 { get; set; }
}
```

El valor de `filterPredefinedValuesName` debe coincidir con la tecla **dictionary** creada en el componente de frontend.

Una vez hecho esto, los filtros predefinidos funcionarán tan pronto como los poblarás con datos.

Para que la tabla coincida con los valores de las celdas con las opciones de filtro predefinidas, el valor devuelto por el backend para una celda debe coincidir con la propiedad `value` de uno de los elementos en el array `IPredefinedFilter`.

Las siguientes secciones describen las diferentes representaciones de un filtro predefinido, que debe configurarse al poblar la lista `IPredefinedFilter`.

Si el filtrado está habilitado en una columna donde se ha configurado un filtro predefinido, cuando el usuario pulsa el botón del filtro aparecerá un modal mostrando las opciones disponibles. El usuario puede seleccionar uno o más valores, y una barra de búsqueda también estará disponible para conveniencia.

> [!CAUTION]
> Cada **dictionary key** debe ser único a través de las columnas, de lo contrario, los filtros de desplegable asociados no funcionarán correctamente.

<br><br>



<a id="plain-text"></a>
##### Texto sin formato
Para mostrar un elemento como texto plano en un filtro predefinido, es necesario definir en cada entrada `IPredefinedFilter` por lo menos estas propiedades:
- **`value`**: Debe coincidir con el valor subyacente de la celda, para que la tabla pueda mapear correctamente.
- **`name`**: El texto mostrado en la celda.
- **`displayName`**: Set to `true` así que el valor en `name` se muestra en realidad.
- **`nameStyle`**: *(opcional)*: Si quieres aplicar un estilo al texto, como por ejemplo, cambiando su color o tamaño.

<br>

**_Ejemplo_**

Supongamos que usted tiene los siguientes valores posibles en una columna que desea representar como texto simple:
- Ok
- Advertencia → naranja (utilizando el color RGB)
- Critical → rojo y atrevido

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        name: "OK",
        displayName: true
    }, {
        value: "backendValueForWarning",
        name: "Warning",
        displayName: true,
        nameStyle: {
            color: 'rgb(255, 130, 30)'
        }
    }, {
        value: "backendValueForCritical",
        name: "Critical",
        displayName: true,
        nameStyle: {
            color: 'red',
            fontWeight: 'bold'
        }
    }
];
```

> [!IMPORTANT]
> Se recomienda en este escenario que en el `IPredefinedFilter` array, las propiedades **`value`** y **`name`** contiene el mismo texto.
> Esto asegura que el filtro **global** funciona como se espera, ya que la UI muestra el `name` pero el filtro global utiliza internamente el `value`.

<br><br>



<a id="tag"></a>
##### Etiqueta
Para mostrar un elemento como una etiqueta en un filtro predefinido, es necesario definir en cada entrada `IPredefinedFilter` por lo menos estas propiedades:
- **`value`**: Debe coincidir con el valor subyacente de la celda, para que la tabla pueda mapear correctamente.
- **`name`**: El texto que se muestra en la etiqueta.
- **`displayTag`**: Set to `true` por lo que la etiqueta se muestra conteniendo como texto `name`.
- **`tagStyle`** *(opcional)*: Si quieres aplicar un estilo a la etiqueta, como por ejemplo, cambiando su color.

<br>

**_Ejemplo_**

Supongamos que usted tiene los siguientes valores posibles en una columna que desea representar en una etiqueta con los siguientes colores:
- Ok → verde
- Advertencia → naranja (utilizando el color RGB)
- Critical → rojo y atrevido

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        name: "OK",
        displayTag: true,
        tagStyle: {
            background: 'rgb(0, 255, 0)'
        }
    }, {
        value: "backendValueForWarning",
        name: "Warning",
        displayTag: true,
        tagStyle: {
            background: 'rgb(255, 130, 30)'
        }
    }, {
        value: "backendValueForCritical",
        name: "Critical",
        displayTag: true,
        tagStyle: {
            background: 'red',
            fontWeight: 'bold'
        }
    }
];
```

> [!IMPORTANT]
> Se recomienda en este escenario que en el `IPredefinedFilter` array, las propiedades **`value`** y **`name`** contiene el mismo texto.
> Esto asegura que el filtro **global** funciona como se espera, ya que la UI muestra el `name` pero el filtro global utiliza internamente el `value`.

<br><br>


<a id="icon"></a>
##### Icono
Para mostrar un elemento como icono en un filtro predefinido, es necesario definir en cada entrada `IPredefinedFilter` por lo menos estas propiedades:
- **`value`**: Debe coincidir con el valor subyacente de la celda, para que la tabla pueda mapear correctamente.
- **`icon`**: Especifica el icono a mostrar. Puede utilizar iconos de PrimeNG u otras bibliotecas, como Font Awesome o Material Icons.
- **`iconColor`** *(opcional)*: Define el color del icono.
- **`iconStyle`** *(opcional)*: Le permite especificar estilos CSS adicionales para el icono, como el tamaño de la fuente.

<br>

**_Ejemplo_**

Supongamos que usted tiene los siguientes valores posibles en una columna que desea representar con un icono con las siguientes opciones:
- Ok → Usa `pi-check` con color verde.
- Advertencia → Usa `pi-exclamation-triangle` con color naranja.
- Critical → Utiliza `pi-times` con color rojo y un tamaño de fuente de tamaño 1.5 rem.

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        icon: "pi pi-check",
        iconColor: "green"
    }, {
        value: "backendValueForWarning",
        icon: "pi pi-exclamation-triangle",
        iconColor: "orange"
    }, {
        value: "backendValueForCritical",
        icon: "pi pi-times",
        iconColor: "red",
        iconStyle: "font-size: 1.5rem"
    }
];
```
> [!TIP]  
> Si está usando un icono de PrimeNG, puede agregar `pi-spin` para hacer que gire (por ejemplo, `pi pi-spin pi-spinner`).
> Tenga en cuenta que en versiones más recientes de PrimeNG, el efecto de giro puede no aparecer si las animaciones están deshabilitadas en el sistema operativo o el navegador.

> [!IMPORTANT]  
> Si un filtro predefinido muestra sólo iconos, se recomienda deshabilitar el filtro global para esa columna en su clase DTO en su backend.
> Esto impide que el filtro global trate de filtrar por una columna sin texto, lo que podría ser confuso para los usuarios.

<br><br>


<a id="image"></a>
##### Imagen
Hay tres maneras de mostrar una imagen en un filtro predefinido:
- Proporcionar la imagen directamente a través de una URL.
- Pase la imagen como `Blob`.
- Pase un punto final desde el que se puede buscar la imagen `Blob`.

Ahora cubriremos los tres métodos diferentes.

> [!IMPORTANT]
> Si un filtro predefinido muestra sólo imágenes, se recomienda deshabilitar el filtro global para esa columna en su clase DTO en su backend.
> Esto impide que el filtro global trate de filtrar por una columna sin texto, lo que podría ser confuso para los usuarios.

> [!NOTE]
> El ancho y la altura de la imagen (y el esqueleto) se pueden personalizar si es necesario. Si no se da altura, se utilizará un valor predeterminado de 22px.

<br>

<a id="using-a-url"></a>
###### Uso de una URL
Para buscar una imagen desde una URL, es necesario definir en cada entrada `IPredefinedFilter` por lo menos estas propiedades:
- **`value`**: Debe coincidir con el valor subyacente de la celda, para que la tabla pueda mapear correctamente.
- **`imageURL`**: La URL de la que se recuperará la imagen.

<br>

**_Ejemplo_**

Supongamos que una columna puede tener los siguientes estados, cada uno representado por una imagen:
- Ok → `https://somesite.com/imageOk.png`  
- Advertencia → `https://somesite.com/imageWarning.png`  
- Critical → `https://somesite.com/imageCritical.png` 

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        imageURL: "https://somesite.com/imageOk.png"
    }, {
        value: "backendValueForWarning",
        imageURL: "https://somesite.com/imageWarning.png"
    }, {
        value: "backendValueForCritical",
        imageURL: "https://somesite.com/imageCritical.png"
    }
];
```

<br>

<a id="using-a-blob"></a>
###### Uso de un Blob
Para mostrar una imagen de un Blob proporcionado directamente al frontend, es necesario definir en cada entrada `IPredefinedFilter` por lo menos estas propiedades:
- **`value`**: Debe coincidir con el valor subyacente de la celda, para que la tabla pueda mapear correctamente.
- **`imageBlob`**: Una imagen válida Blob (p. ej., PNG, JPEG) que se mostrará.

<br>

**_Ejemplo_**

Supongamos que una columna puede tener los siguientes estados, cada uno representado por una variable Blob:
- Ok → `blobOk`  
- Advertencia → `blobWarning`  
- Critical → `blobCritical` 

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        imageBlob: blobOk
    }, {
        value: "backendValueForWarning",
        imageBlob: blobWarning
    }, {
        value: "backendValueForCritical",
        imageBlob: blobCritical
    }
];
```

<br>

<a id="fetching-a-blob-from-an-endpoint"></a>
###### Obtención de un Blob desde un endpoint
El **ECS PrimeNG table** admite la captura de imágenes automáticamente desde un punto de vista final que devuelve una imagen válida `Blob`. Una vez configurado, el componente solicitará el bloque, manejará la respuesta y mostrará la imagen sin configuración adicional.

Para lograrlo, defina las siguientes propiedades en cada entrada `IPredefinedFilter`:  
- **`value`**: Debe coincidir con el valor subyacente de la celda para que la tabla pueda mapear correctamente.
- **`imageBlobSourceEndpoint`**: El punto final de backend desde el que se buscará el bloque de imagen.

Cuando el proceso de embrague comience, se mostrará un marcador de esqueleto hasta que se recupere el bloque. Si la solicitud tiene éxito, la tabla poblará automáticamente la propiedad `imageBlob` de la entrada `IPredefinedFilter` correspondiente con la `Blob` recuperada.

Si la solicitud falla, la propiedad **`imageBlobFetchError`** se establecerá `true` para esa entrada, lo que le permite detectar y manejar los errores con gracia.

<br>

**_Ejemplo_**

Supongamos que una columna puede tomar los siguientes estados, cada uno asociado con los siguientes puntos finales para buscar un bloque de imagen:
- Ok → `https://somesite.com/api/getBlob/ok`  
- Advertencia → `https://somesite.com/api/getBlob/warning`  
- Critical → `https://somesite.com/api/getBlob/critical` 

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        imageBlobSourceEndpoint: "https://somesite.com/api/getBlob/ok"
    }, {
        value: "backendValueForWarning",
        imageBlobSourceEndpoint: "https://somesite.com/api/getBlob/warning"
    }, {
        value: "backendValueForCritical",
        imageBlobSourceEndpoint: "https://somesite.com/api/getBlob/critical"
    }
];
```

<br><br>



<a id="associating-actions"></a>
##### Asociación de acciones
Un filtro predefinido puede tener una acción asociada para que cuando el usuario haga clic en él, se realice una acción.

Esta acción contendrá los datos de fila y la información del elemento predefinido que se ha hecho clic.

Para asociar una acción a un filtro predefinido, es necesario definir en la entrada `IPredefinedFilter` la siguiente propiedad:
- **`action`**: La acción para ejecutar cuando se haga clic en el filtro predefinido.

La propiedad `action` es una función con la siguiente firma:
```ts
action?: (rowData: any, option: IPredefinedFilter) => void;
```

Esto significa que cuando el usuario haga clic en el filtro, la función recibirá:
- **rowData**: Los datos de la fila donde se aplica el filtro.
- **option**: El elemento de filtro predefinido completo que se hizo clic, dándole acceso a su nombre, valor, estilo y cualquier otra propiedad definida en `IPredefinedFilter`.

<br>

**_Ejemplo_**

Supongamos que usted tiene los siguientes valores posibles en una columna que desea representar como texto simple:
- Ok
- Advertencia
- Crítica

Y el valor `Critical` tiene una acción asociada.

Su lista `IPredefinedFilter` en TipoScript podría parecerse a esto:
```ts
examplePredfinedFilter: IPredefinedFilter[] = [
    {
        value: "backendValueForOK",
        name: "OK",
        displayName: true
    }, {
        value: "backendValueForWarning",
        name: "Warning",
        displayName: true
    }, {
        value: "backendValueForCritical",
        name: "Critical",
        displayName: true,
        action: (rowData, option) => {
          // The action to be performed on click.
          //
          // Use `rowData` to access data from the row where the predefined filter was clicked.
          // Example: `rowData.rowID` to access the `rowID` of the row.
          //
          // `option` is a IPredefinedFilter that will contain the information for `Critical`.
          // This means that if you do `option.value` it will give you `"backendValueForCritical"`.
        }
    }
];
```

> [!TIP]
> No todos los elementos `IPredefinedFilter` del array, necesitan tener una acción asociada.

<br><br>


<a id="6314-initial-width"></a>
#### 6.3.14 Ancho inicial
Puede especificar un ancho inicial para una columna configurando la siguiente propiedad en el `ColumnAttributes` de su clase DTO:
- **`initialWidth`**: El ancho inicial de la columna en píxeles.

Este es **strongly recomendado para columnas fijas** para asegurar la alineación adecuada y evitar cambios de diseño.

Para columnas no congeladas, utilícela con precaución: si el usuario puede cambiar el tamaño de la columna, el ancho guardado en la vista será anulado por el `initialWidth`, que puede conducir a confusión.

<br><br>



<a id="64-rows"></a>
### 6.4 Filas
<a id="641-single-select"></a>
#### 6.4.1 Selección individual
La función **single row selection** utiliza la columna `RowID`, que debe definirse en la clase DTO utilizada con su tabla.

Por defecto, esta característica es **disabled**. Para habilitarlo, configurarlo desde el frontend. En la configuración `ITableOptions` de su componente, dentro de la propiedad `rows`, puede utilizar el objeto `singleSelector` con las siguientes propiedades:
- **`enabled`** *(Default: `false`)*: Si se establece `true`, los usuarios pueden hacer clic en una fila para seleccionarla. Luego puede suscribirse a eventos de selección para ejecutar acciones personalizadas.
- **`metakey`** *(Default: `true`)*: Cuando `true`, los usuarios deben mantener **CTRL** y haga clic en una fila seleccionada para sinseleccionarla. Cuándo `false`, los usuarios pueden unseleccionar una fila simplemente haciendo clic de nuevo.

Puede suscribirse a cambios en la selección de filas utilizando los siguientes emisores de eventos:
- **`onRowSelect`**: Triggered cuando se selecciona una fila.
- **`onRowUnselect`**: Triggered cuando una fila es sin elección.

Ambos emisores proporcionan un objeto con la siguiente estructura:
- **`rowID`**: El identificador de fila único, proporcionado por el backend a través del `RowID` propiedad en la clase DTO.
- **`rowData`**: Los datos de la fila cruda, que contienen todas las columnas disponibles actualmente en el frontend.

> [!NOTE]
> En dispositivos móviles (teléfonos o tabletas), se ignora la configuración clave `CTRL`. Los usuarios pueden unseleccionar una fila previamente seleccionada haciendo simplemente clic en ella, ya que los dispositivos móviles no tienen una tecla `CTRL`.

> [!CAUTION]
> Si el comportamiento predeterminado (guardando hacia abajo `CTRL` a unselect) está habilitado, haciendo clic repetidamente en la misma fila **sin tenencia `CTRL`** contará como múltiples selecciones.  
> Esto puede causar comportamiento no deseado si las acciones se activan en cada selección, así que planifique sus acciones de fila en consecuencia.

<br>

**_Ejemplo_**

Para habilitar el selector de filas únicas y suscribirse a cambios, en el archivo de componente deseado TipoScript, una definición mínima debe parecerse a esto (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    rows: {
      singleSelector: {
        enabled: true,
        // metakey: false // Uncomment to allow unselecting rows by clicking them directly
      }
    }
  });

  onRowSelect(event: { rowID: any, rowData: any }){
    // You can access the event.rowID or event.rowData here of the selected row
    console.log("Row selected:", event.rowID, event.rowData);
  }
  onRowUnselect(event: { rowID: any, rowData: any }){
    // You can access the event.rowID or event.rowData here of the unselected row
    console.log("Row unselected:", event.rowID, event.rowData);
  }
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions" (onRowSelect)="onRowSelect($event)" (onRowUnselect)="onRowUnselect($event)"/>
```

<br><br>



<a id="642-checkbox-select"></a>
#### 6.4.2 Selección mediante casillas de verificación
La función **checkbox row selection** se basa en la columna `RowID`, que debe definirse en la clase DTO utilizada con su tabla.

Por defecto, esta característica es **disabled**. Para habilitarlo, configurarlo desde el frontend.

En la configuración `ITableOptions` de su componente, dentro de la propiedad `rows`, utilice el objeto `checkboxSelector` con las siguientes opciones:
- **`enabled`** *(Default: `false`)*Si. `true`, se mostrará una nueva columna con casillas de verificación. Los usuarios pueden seleccionar o no seleccionar filas usando estas casillas de verificación. Además, se habilitará una opción para filtrar por esta columna.
- **`enabledCondition`**: Opcional. Una función que determina si la casilla de verificación debe ser habilitada para una fila determinada.
  - **`rowData`** parámetro: El objeto de datos de fila.
  - Devuelve `true` si la casilla de verificación de botones está habilitada; `false` de lo contrario.
- **`frozen`** *(Default: `true`)*Si. `true`, la columna permanece visible al desplazar horizontalmente la tabla.
- **`header`** *(Default: `"Selected"`)*: La etiqueta del encabezado para la columna de selección de la casilla de verificación.
- **`horizontalAlignment`** *(Default: `DataAlignHorizontal.Center`)*: Cómo la casilla de verificación dentro de la columna selectora está alineada horizontalmente.
- **`positionRight`** *(Default: `false`)*Si. `true`, la columna aparecerá en el lado derecho de la tabla. De lo contrario, aparecerá a la izquierda.
- **`verticalAlignment`** *(Default: `DataAlignVertical.Middle`)*: Cómo la casilla de verificación dentro de la columna selectora está alineada verticalmente.
- **`width`** *(Default: `150`)*: El ancho de la columna fija en píxeles.
- **`resizable`** *(Default: `false`)*Si. `true`, los usuarios pueden cambiar el tamaño de la columna.

Puede suscribirse a cambios en la selección de la casilla de verificación de filas utilizando:
- **`onRowCheckboxChange`**: Encadenado cada vez que se selecciona una casilla de verificación de filas o no se selecciona. El objeto emitido tiene la siguiente estructura:
  - **`rowID`**: El identificador de fila único, proporcionado por el backend a través del `RowID` propiedad en la clase DTO.
  - **`selected`**: `true` si se selecciona la fila, `false` si no es elegido.

En cualquier momento, puede acceder a la propiedad `selectedRowsCheckbox` del componente, que contiene una variedad de filas seleccionadas actualmente (`rowID`).

> [!NOTE]
> Cuando la columna de selección de la casilla de verificación se coloca a la izquierda, siempre aparecerá **after** la columna de acción (si la columna de acción es visible y se coloca a la izquierda).
>
> Cuando se coloca a la derecha, siempre aparecerá **before** la columna de acción (si la columna de acción es visible y se coloca a la derecha).
>
> Este comportamiento es consistente solamente si las columnas de selector de filas de acción y de casilla de verificación están congeladas al mismo tiempo (o si no son desfavorecidas al mismo tiempo).

<br>

**_Ejemplo_**

Para habilitar el selector de filas de la casilla de verificación, suscríbete a los cambios de selección y accede a la propiedad `selectedRowsCheckbox` de la tabla, el archivo TypeScript puede tener una configuración mínima como esta (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  @ViewChild('dt') dt!: ECSPrimengTable; // Get the reference to the object table

  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    rows: {
      checkboxSelector: {
        enabled: true,
        // header: "Selected", // Uncomment to change header
        // positionRight: false, // Uncomment to change the location of the column
        // width: 150, // Uncomment to change column width in px
        // frozen: true, // Uncomment to change frozen status
        // resizable: false, // Uncomment to change column resize behaviour
        // enabledCondition: (rowData) => (rowData.canBeDeleted === true), // Uncomment to evaluate if the checkbox should be enabled in a row
        // horizontalAlignment: DataAlignHorizontal.Right, // Uncomment to change the horizontal aligment of the checkbox
        // verticalAlignment: DataAlignVertical.Top  // Uncomment to change the vertical aligment of the checkbox
      }
    }
  });

  onRowCheckboxChange(event: { rowID: any, selected: boolean }){
    // You can access the event.rowID or event.selected here of the selected row
    console.log("Row checkbox change:", event.rowID, event.selected);
    // Also you could access the array of selected rowID
    console.log("Row checkbox currently selected:", this.dt.selectedRowsCheckbox);
  }
}
```

Y en su HTML (nota la referencia de la plantilla `#dt` para acceder a la instancia de tabla de TipoScript):
```html
<ecs-primeng-table #dt [tableOptions]="tableOptions" (onRowCheckboxChange)="onRowCheckboxChange($event)"/>
```

Con esta configuración:
- La referencia de la plantilla `#dt` le permite acceder directamente a la instancia de componente de la tabla en TipoScript. Puede utilizarlo para leer el array `selectedRowsCheckbox` en cualquier momento. 
- La unión de eventos `(onRowCheckboxChange)` garantiza que su método `onRowCheckboxChange` se llame cuando se selecciona una casilla de verificación de filas o no se selecciona, dándole acceso a la `rowID` y `selected` de la fila afectada.

<br><br>



<a id="643-dynamic-styling"></a>
#### 6.4.3 Estilos dinámicos
La función **dynamic styling** permite personalizar el aspecto de las filas ya sea aplicando estilos **inline** o añadiendo clases **CSS**.

Ambos enfoques reciben el objeto `rowData` como entrada, dándole acceso a todos los valores actualmente mantenidos en la fila. Esto le permite definir reglas basadas en valores de columna y ajustar dinámicamente el estilo.

En la configuración `ITableOptions` de su componente, dentro de la propiedad `rows`, puede definir:
- **`style`**: Una función que devuelve un objeto que contiene estilos CSS inline para aplicar cuando se cumple una condición.
- **`class`**: Una función que devuelve uno o más nombres de clase CSS para ser inyectado cuando se cumple una condición.

Tanto las funciones `style` como `class` se evalúan dinámicamente y se pueden actualizar en tiempo de ejecución, permitiendo que las reglas de estilo reaccionen a los cambios de datos.

> [!NOTE]
> El `rowData` pasó a las funciones `style` y `class` contiene los datos actualmente disponibles en el frontend para el procesamiento de la fila específica.

<br>

**_Ejemplo_**

Supongamos que tiene una columna de tipo `List`, donde los valores se almacenan como una cadena separada de semicolon (por ejemplo, `"Full-time; Remote; Contract"`).
Usted quiere aplicar:
- Un **inline style** específico si la lista contiene el valor `"Full-time"`.
- Un **CSS específico** si la lista contiene el valor `"Unemployed"`.

Su componente TipoScript archivo podría definirse de la siguiente manera (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    rows: {
      style: (rowData: any) => {
        const list = rowData?.employmentStatusNameList?.split(';').map((s: string) => s.trim()) || [];
        if (list.includes("Full-time")) {
          return { fontWeight: 'bold', fontStyle: 'italic' };
        }
        return {};
      },
      class: (rowData: any) => {
        const classes = [];
        const list = rowData?.employmentStatusNameList?.split(';').map((s: string) => s.trim()) || [];
        if(list.includes("Unemployed")){
          classes.push('exampleClass');
        }
        return classes;
      }
    }
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

Debido a que la clase está empujando el `exampleClass`, usted tiene que declarar la clase CSS a un componente o nivel global para que pueda ser renderizado correctamente. Asumiendo que lo definas a nivel global, tu `styles.scss` podría parecerse a esto:
```scss
.exampleClass {
  background-color: #ffcccc !important;
  color: #990000 !important;
  font-weight: bold !important;
}
```

<br><br>



<a id="65-setting-up-row-and-header-action-buttons"></a>
### 6.5 Configuración de los botones de acción de filas y encabezados
<a id="button-definitions"></a>
#### Definición de botones
Los botones de acción se pueden utilizar ya sea en el encabezado de la tabla o como botones de acción de la fila. Ambos tipos de botones comparten el mismo conjunto de propiedades.

La diferencia principal es que los botones de acción **row** reciben el objeto `rowData`, que contiene los datos actualmente mantenidos en el frontend para esa fila específica.

Las propiedades disponibles son:
- **icon**: Opcional. El icono a mostrar en el botón. Debe ser un nombre de icono válido de PrimeNG, Iconos Materiales, Awesome Font, o bibliotecas similares.
- **iconPos**: Opcional. La posición del icono relativa a la etiqueta de botón. Defaults to `"left"`. Valores posibles: `"left"`, `"right"`, `"top"`, `"bottom"`.
- **label**: Opcional. La etiqueta de texto mostrada en el botón.
- **rounded**: Opcional. Si `true`, el botón será redondo. Defaults to `false`.
- **raised**: Opcional. Si `true`, añade una sombra para indicar la elevación. Defaults to `false`.
- **variant**: Opcional. Especifica la variante del botón. Puede ser `null` (por defecto), `"text"`, o `"outlined"`.
- **class**: Opcional. Clases adicionales de CSS para aplicar al botón.
- **style**: Opcional. Estilos adicionales en línea CSS para el botón.
- **visibleCondition**: Opcional. Una función que determina si el botón debe ser visible para una fila dada.  
  - **rowData** parámetro: El objeto de los datos de fila (null para botones de encabezado).  
  - Devuelve `true` si el botón debe ser visible; `false` de lo contrario.  
  - Cuando esto devuelve `false`, el botón no será renderizado y se ignoran todas las demás condiciones (`enabledCondition`, `conditionFailHide`).
- **enabledCondition**: Opcional. Una función que determina si el botón debe ser habilitado para una fila determinada.  
  - **rowData** parámetro: El objeto de los datos de fila (null para botones de encabezado).  
  - Devuelve `true` si el botón debe ser habilitado; `false` de lo contrario.  
  - Ignorado si `visibleCondition` devuelve `false`.
- **conditionFailHide**: Opcional. Controla el comportamiento cuando `enabledCondition` devuelve `false`.  
  - Si `true`, el botón será oculto cuando no se cumpla la condición.  
  - Si `false` o `undefined`, el botón permanecerá visible pero deshabilitado.  
  - Ignorado si `visibleCondition` devuelve `false`.
- **action**: Opcional. La acción para ejecutar cuando se hace clic en el botón.
  - **rowData** parámetro: El objeto de los datos de fila de la fila pulsada (null para botones de encabezado).
- **tooltip**: Opcional. Texto de la herramienta para mostrar cuando el usuario salta sobre el botón.

El enfoque recomendado es definir **two arrays separados** de `ITableButton`: uno para los botones de acción **header** y uno para los botones de acción **rowZ**.

- **Antes botones de acción**:  
  El array de `ITableButton` debe ser asignado a la propiedad `buttons` dentro del objeto `header` de su configuración `ITableOptions`.  
  Estos botones se muestran en el encabezado de la tabla y normalmente activan acciones que no son específicas para una sola fila (por ejemplo, creando un nuevo registro).

- Botones de acción **Row**:  
  El array de `ITableButton` debe ser asignado a la propiedad `buttons` dentro del objeto `actions` del objeto `rows` en su configuración `ITableOptions`.
  Estos botones se muestran para cada fila y pueden acceder a la `rowData` de la fila correspondiente. Por lo general desencadenan acciones que operan en esa fila específica (por ejemplo, editar, eliminar).
  Se recomienda utilizar el `rowID` al realizar cualquier acción de backend en ese registro.

> [!TIP]
> Los botones añadidos al array `ITableButton` y pasados a la tabla siempre se renderizan de izquierda a derecha. El primer botón en el array aparece a la izquierda, mientras que el último botón aparece a la derecha.

> [!IMPORTANT]
> Para los botones de acción de fila, si usted depende de cualquier elemento de los datos de fila, recuerde que sólo los datos de columnas ocultas y columnas que no pueden ser ocultados por el usuario está garantizado para estar disponibles. No confíe en los datos de las columnas intercambiables por el usuario, ya que no siempre puede ser accesible en el frontend.

> [!CAUTION]
> Nunca asuma que un botón visible para el usuario puede ser ejecutado de forma segura solo en condiciones de frontend. Siempre realizar una validación final en el backend, ya que cualquier dato o estado expuesto en el frontend puede ser fácilmente manipulado.

<br>

**_Ejemplo_**

Supongamos que desea tener botones de acción de cabecera y fila:
- **Antes botones de acción**:
  - Un botón para agregar un nuevo disco.
- Botones de acción **Row**:
  - Un botón para eliminar un registro (sólo disponible para usuarios autorizados).
  - Un botón para editar un registro.

Su componente TipoScript archivo podría definirse de la siguiente manera (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions, ITableButton } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  headerActionButtons: ITableButton[] = [
    {
      icon: 'pi pi-plus',
      class: 'p-button-success',
      action: () => {
        // Action to execute when clicked.
        // Example: Open a modal to create a new record.
      },
      label: "CREATE",
      tooltip: "Create new record"
    }
  ];
  rowActionButtons: ITableButton[] = [
    {
      icon: 'pi pi-trash',
      tooltip: 'Delete record',
      class: 'p-button-danger',
      action: (rowData) => {
        // Action to execute when clicked, only if condition evaluates to true.
        // Example: Open a confirmation modal before deleting the record.
        // Use rowData.rowID to identify the record in the backend.
      },
      enabledCondition: (rowData) => (rowData.canBeDeleted === true)
    }, {
      icon: 'pi pi-file-edit',
      tooltip: 'Edit record',
      class: 'p-button-primary',
      action: (rowData) => {
        // Action to execute when clicked.
        // Example: Open a modal to edit the record.
        // Use rowData.rowID to identify the record in the backend.
      }
    }
  ];

  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    header: {
      buttons: this.headerActionButtons
    },
    rows: {
      action: {
        buttons: this.rowActionButtons
      }
    }
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="row-actions-column"></a>
#### Columna de acciones de las filas
Si se proporciona al menos un botón de acción de fila, se añadirá una columna adicional a la tabla para mostrar estos botones. 

Algunas propiedades de esta columna se pueden personalizar a través del objeto `actions` dentro del objeto `rows` de su configuración `ITableOptions`. Las opciones disponibles son:
- **`frozen`** *(Default: `true`)*Si. `true`, la columna permanece visible al desplazar horizontalmente la tabla.
- **`header`** *(Default: `"Actions"`)*: La etiqueta de cabecera de la columna de acciones de fila.
- **`horizontalAlignment`** *(Default: `DataAlignHorizontal.Center`)*: Cómo los elementos dentro de la columna de acción están alineados horizontalmente.
- **`positionRight`** *(Default: `true`)*Si. `true`, la columna aparecerá en el lado derecho de la tabla. De lo contrario, aparecerá a la izquierda.
- **`resizable`** *(Default: `false`)*Si. `true`, los usuarios pueden cambiar el tamaño de la columna.
- **`verticalAlignment`** *(Default: `DataAlignVertical.Middle`)*: Cómo los elementos dentro de la columna de acción están alineados verticalmente.
- **`width`** *(Default: `150`)*: El ancho de la columna fija en píxeles.

> [!NOTE]
> Cuando la columna de acciones de fila se coloca a la izquierda, siempre aparecerá **at el principio** de la tabla.
>
> Cuando se coloca a la derecha, siempre aparecerá **at el end** de la tabla.

<br><br>



<a id="66-configuring-the-global-filter"></a>
### 6.6 Configuración del filtro global
<a id="overview-of-the-global-filter"></a>
#### Descripción del filtro global
El filtro **global** permite a los usuarios realizar una consulta `LIKE` en cada columna que tenga habilitada esta función (por defecto, todas las columnas).

Convierte automáticamente todos los tipos de datos en texto (por ejemplo, números) para que sean verificables. Para las columnas **date**, se requiere una configuración adicional, aunque esto es opcional.

Las columnas con un tipo de datos booleanos son ignoradas por el filtro global.

Además, cuando se encuentra un partido, el filtro global lo destaca en amarillo dentro de la columna correspondiente, facilitando que el usuario identifique dónde ocurrió el partido.

El filtro global se puede limpiar si contiene datos, ya sea haciendo clic en el icono "X" en el lado derecho de la entrada o pulsando los filtros **clear** (si está habilitado).

> [!NOTE]
> La búsqueda global de filtros es **case-insensible**.

> [!IMPORTANT]
> Aunque el filtro global es muy útil, también tiene una desventaja.
>
> Dado que realiza una consulta `LIKE` por columna (con `%` tanto al inicio como al final del plazo de búsqueda), esta es una de las operaciones más caras en SQL.
>
> Cuanto más columnas sean visibles (y estén habilitadas para el filtrado global), más tiempo tomará actualizar los datos mostrados cuando el filtro global cambie.

<br><br>



<a id="column-level-configuration"></a>
#### Configuración por columna
Para desactivar el filtro global por columna esto se puede hacer estableciendo a `false` la propiedad `canBeGlobalFiltered` en el `ColumnAttributes` de tu clase DTO backend

<br>

**_Ejemplo_**

Asumiendo que su clase DTO se llama `TestDTO` y desea desactivar el filtrado global para la columna `Username`:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Username", canBeGlobalFiltered: false)]
	public string Username { get; set; } = string.Empty;

	// Other properties of your class
}
```

<br><br>



<a id="global-settings"></a>
#### Configuración global
Si desea desactivar el filtro global por completo para que no aparezca en el frontend, o si desea modificar la longitud máxima que un usuario puede introducir en el cuadro de entrada, puede personalizarse a través del objeto `globalFilter` dentro de su configuración `ITableOptions`. Las opciones disponibles son:
- **`enabled`** *(Default: `true`)*: Permite o desactiva la entrada de filtro global. Cuando se establece `true`, los usuarios pueden buscar en todas las columnas de la tabla utilizando la barra de búsqueda global. Cuándo `false`, la entrada de búsqueda global no se hará.
- **`maxLength`** *(Default: `20`)*: Número máximo de caracteres permitidos en la entrada de filtro global.

<br>

**_Ejemplo_**

Asumiendo que quieras limitar la longitud de tu filtro global a 15 caracteres, puedes hacerlo en el archivo TipoScript de tu componente (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    globalFilter: {
      maxLength: 15,
      // enabled: false // Uncomment to disable the global filter
    }
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>


<a id="configuring-global-filter-for-date-columns"></a>
#### Configuración del filtro global para columnas de fecha
Por defecto, las columnas de fecha no funcionarán con filtro global, ya que requieren una función de base de datos que convierte las fechas en texto usando exactamente el mismo formato en el que se renderizan en el frontend.

Garantizar la coherencia entre la transformación de la base de datos y la reproducción de frontend es crítica, de lo contrario, los usuarios pueden estar confundidos al aplicar el filtro global a las columnas de fecha.

El proyecto de ejemplo incluye una función SQL Server que puede utilizar: [04 FormatoFechaConCulture.sql](Database%20scripts/04%20FormatDateWithCulture.sql).

Si usted está trabajando con un motor de base de datos que no sea SQL Server, tendrá que adaptar el script en consecuencia.

Asumiendo que usted está usando SQL Server como motor de base de datos y que ya ha establecido la función de base de datos descrita anteriormente, ahora debe ir al backend y registrar la función de base de datos para que pueda ser utilizado.

Crearemos junto al contexto un nuevo archivo cs que actuará como una extensión del contexto base. Lo haremos de esta manera para evitar que EF sobreescriba nuestros cambios al andamiaje, y puesto que el contexto se crea como parcial, puede extenderse sin problemas.

La forma de extenderse es la siguiente:
```c#
namespace YourDatabaseContextNamespace {
    public partial class YourDatabaseContextClass {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder) {
            modelBuilder.HasDbFunction(() => MyDBFunctions.FormatDateWithCulture(default, default!, default!, default!))
                        .HasName("FormatDateWithCulture")
                        .HasSchema("dbo");
        }
    }
    public static class MyDBFunctions {
        [DbFunction("FormatDateWithCulture", "dbo")]
        public static string FormatDateWithCulture(DateTime inputDate, string format, string timezone, string culture) {
            throw new NotImplementedException("This method is a placeholder for calling a database function.");
        }
    }
}
```
Aquí la función de la base de datos está siendo registrada dentro del modelo Entity Framework. El método `HasDbFunction` vincula la función SQL `FormatDateWithCulture` al método C# estático. De esta manera EF sabe cómo llamar a la función SQL Server desde LINQ. La clase estática `MyDBFunctions` con la anotación `[DbFunction]` funciona como un puente entre el código C# y la función de la base de datos. La función no se ejecuta en C#, EF traduce su uso en SQL.

Una vez hecho, en su servicio puede pasar la función de base de datos de esta manera:  
```c#
using YourDatabaseContextNamespace;
using ECSPrimengTable.Services;
using ECS.PrimengTable.Enums;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;
using System.Reflection;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), [typeof(DateTime), typeof(string), typeof(string), typeof(string)])!; // Needed import for being able to perform global search on dates

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true, EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault));
        }

        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    Money = u.Money,
                    House = u.House
                });
        }
    }
}
```
En este bloque se obtiene la `MethodInfo` de la función `FormatDateWithCulture` para que pueda inyectarse en las consultas dinámicas. Esto es necesario porque el generador de consulta (`EcsPrimengTableService.PerformDynamicQuery`) necesita saber cómo aplicar la función a las columnas de fecha cuando se utiliza el filtro global. El `MethodInfo` funciona como referencia a la función de base de datos que se ejecutará.

Con esto hecho, ahora podrá utilizar el filtro global en las columnas de tipo de datos de la fecha.

> [!CAUTION]  
> Si usted no va a utilizar esta característica, recuerde desactivar el `canBeGlobalFiltered` en el `ColumnAttributes` de su clase DTO backend para columnas de tipo fecha, de lo contrario, aunque no se va a filtrar, el frontend subrayará el partido en la fecha, lo que lo hace confuso para los usuarios.

<br><br>



<a id="67-pagination-properties"></a>
### 6.7 Propiedades de paginación
El **ECS PrimeNG table** gestiona la paginación automáticamente. No hay necesidad de configuración de frontend adicional.

La única personalización disponible se define en el **backend**, donde se especifica qué tamaños de página se permiten para el usuario.

Esto se hace en el método `EcsPrimengTableService.GetTableConfiguration`.

<br>

**_Ejemplo_**

La siguiente configuración mínima de servicio permite **10, 20, 30, 40 y 50 elementos por página**:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {

        public static readonly int[] AllowedItemsPerPage = [10, 20, 30, 40, 50];

        public TableConfigurationModel GetTableConfiguration() {
            return EcsPrimengTableService.GetTableConfiguration<TestDto>(AllowedItemsPerPage);
        }
    }
}
```

> [!CAUTION]
> Debido a que los elementos por página usan byte internamente, el máximo permitido por página es 255.

<br><br>



<a id="68-copy-cell-content"></a>
### 6.8 Copiar el contenido de una celda
Por defecto, la función **copy cell content** está activada.

Cuando un usuario sostiene el ratón en una celda durante cierto tiempo, el contenido de la celda se copia automáticamente al portapapeles.

Puede ajustar este comportamiento o desactivarlo completamente a través de la configuración `ITableOptions` en su componente de frontend.
- **`copyToClipboardTime`**: Define el número de segundos que el usuario debe mantener el botón del ratón en una celda antes de que su contenido sea copiado al portapapeles. Set to `<= 0` para apagar esta función por completo.

<br>

**_Ejemplo_**

Para configurar el contenido de celda **copy** para copiar después de mantener el ratón hacia abajo para los segundos 0.8, en el archivo TipoScript del componente deseado, una definición mínima debe parecerse a esto (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    copyToClipboardTime: 0.8
  });
}
```

<br><br>



<a id="69-dynamic-height"></a>
### 6.9 Altura dinámica
Para mantener el **header** y **Controles de paginación** fija mientras permite desplazamiento vertical para el cuerpo de tabla, puede configurar la altura de desplazamiento a través de la **`verticalScroll`** objeto dentro del `ITableOptions`.
- **`fitToContainer`** *(Default: `true`)*: Cuando se establece `true`, la altura se calcula dinámicamente basado en el tamaño de contenedor disponible. Esto se recomienda cuando la tabla debe ajustarse automáticamente en el tamaño de la ventana.
- **`height`** *(Default: `0`)*: Define una altura estática en píxeles (`px`). Este valor solo se utiliza si no `fitToContainer` ni tampoco `cssFormula` están activos.
- **`cssFormula`** *(Default: `undefined`)*: Proporciona la máxima flexibilidad delegando el cálculo al navegador. Acepta cualquier valor CSS válido para la altura, como:  
  - Un valor fijo → `"500px"`
  - Cálculo de CSS → `"calc(100vh - 200px)"`

Las reglas de precedencia que deben tenerse en cuenta:
1. Si. **`cssFormula`** se define, siempre tiene prioridad.
2. Si. **`cssFormula`** no se define y **`fitToContainer`** es `true`, la altura se calcula dinámicamente en TipoScript.
3. Si ninguno de los anteriores se aplica, el valor numérico de **`height`** se utiliza.

<br>

**_Ejemplo_**

Para configurar la tabla de manera que su altura sea determinada por una fórmula CSS (por ejemplo, `"calc(100vh - 200px)"`), puede definirla en el archivo TypeScript de su componente.

A continuación se muestra un ejemplo mínimo asumiendo que el componente se llama `Home`:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    verticalScroll: {
      // When using cssFormula, fitToContainer should be disabled
      fitToContainer: false,

      // Apply a CSS formula so the height is resolved by the browser
      cssFormula: "calc(100vh - 200px)",

      // Alternative: use a fixed numeric height (in pixels).
      // This will only be applied if cssFormula is not set and fitToContainer is false.
      // height: 500
    }
  });
}
```

<br><br>



<a id="610-deferred-startup"></a>
### 6.10 Inicio diferido
Usted puede aplazar la inicialización de la tabla estableciendo la **`isActive`** propiedad a `false` en tu `ITableOptions` configuración.

El **`isActive`** La bandera controla si la tabla debe buscar su configuración y datos de columna:
- **`true`** (default): la tabla sembra automáticamente la configuración y los datos cuando el componente comienza.
- **`false`**: la tabla no realizará ninguna solicitud hasta que la active explícitamente de nuevo utilizando la función `updateData()` de la tabla.

Esto es particularmente útil si desea retrasar la carga de tablas hasta que se cumplan condiciones específicas, como recuperar algunos datos iniciales que se requieren antes de que se muestre la tabla.

<br>

**_Ejemplo_**

Supongamos que desea evitar que su tabla busque su configuración y datos sobre la puesta en marcha de componentes. Su componente TipoScript archivo podría definirse de la siguiente manera (asumiendo que el componente se llama `Home`):
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    isActive: false
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="611-changing-the-data-endpoint-dinamically"></a>
### 6.11 Cambio dinámico del endpoint de datos
Usted puede cambiar dinámicamente el punto final de la fuente de datos de su tabla por desactivarlo temporalmente con **`isActive`** y luego actualizar el **`urlTableData`** propiedad en su `ITableOptions` configuración. Para ello:
1. Set **`isActive`** a `false` para evitar que la tabla se actualice.
2. Actualizar **`urlTableData`** propiedad con el nuevo endpoint.
3. Espere al menos un ciclo anular antes de reactivar la tabla (para permitir que la detección del cambio se propaga).
4. Por último, llama **`updateData()`** en la instancia de tabla para buscar datos del nuevo punto final.

> [!IMPORTANT]  
> - Si la tabla ya ha sido inicializada, cambiando **`urlTableConfiguration`** no tendrá ningún efecto. El **ECS PrimeNG table** Sólo pulsa configuración una vez durante su primera carga.
> - Esta función está destinada a escenarios en los que la configuración **column mantiene la misma ** y sólo los cambios **data source**.

<br>

**_Ejemplo_**

Supongamos que desea actualizar el punto final de datos de su componente.

Si su variable `ITableOptions` se llama `tableOptions` y está utilizando `#dt` como referencia de plantilla para la tabla, puede hacer lo siguiente: 
```ts
updateTableEndpoint(newEndpoint: string){
    this.tableOptions.isActive = false;
    this.tableOptions.urlTableData = newEndpoint;
    setTimeout(() => {
        this.dt.updateData();
    }, 1);
}
```

También puede restablecer filtros y ordenar mientras se actualiza el punto final si se desea: 
```ts
updateTableEndpoint(newEndpoint: string){
    this.tableOptions.isActive = false;
    this.tableOptions.urlTableData = newEndpoint;
    this.dt.clearFilters(this.dt, true); // Clear all active filters
    this.dt.clearSorts(this.dt, true); // Clear all active sorts
    setTimeout(() => {
        this.dt.updateData();
    }, 1);
}
```

<br><br>



<a id="612-configuring-excel-reports"></a>
### 6.12 Configuración de los informes de Excel
Esta característica se basa en [CerradoXML](https://github.com/ClosedXML/ClosedXML), así que asegúrate de tener el paquete NuGet instalado en tu backend antes de proceder.

La generación de informes de Dynamic Excel le permite exportar los mismos datos mostrados en su tabla en un archivo `.xlsx`, con soporte para la personalización del usuario al generar el informe.

Para configurar los informes de Excel, necesita definir un nuevo punto final de servicio y controlador en su backend.

Si ya ha creado un `IQueryable` para obtener los datos de la tabla (utilizados por la consulta dinámica), puede reutilizar la misma consulta para generar el archivo Excel.

Un servicio típico puede parecerse a esto:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public (bool success, byte[]? file, string errorMsg) GenerateExcelReport(ExcelExportRequestModel inputData) {
            return EcsPrimengTableService.GenerateExcelReport(inputData, GetBaseQuery());
        }

        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    Money = u.Money,
                    House = u.House
                });
        }
    }
}
```
Al igual que con otros servicios, el método `EcsPrimengTableService.GenerateExcelReport` acepta algunos argumentos opcionales:
- Una **función de base de datos** para convertir las fechas en cadenas de texto y garantizar la coherencia entre el backend y el frontend.
- A **list de columnas de orden predeterminado**.
- Su dirección de orden **initial** (ascendente o descendente).
- A **dictionary** para anular propiedades de columnas específicas durante la exportación.
- Una lista de columnas que serán excluidas durante la exportación.

Ahora necesita un endpoint en su controlador que llame al servicio y devuelva el archivo Excel al cliente. Una implementación mínima podría parecerse a esto:
```c#
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase {
    private readonly ITestService _service;

    public TestController(ITestService service) {
        _service = service;
    }

    [HttpPost("[action]")]
    public IActionResult GenerateExcel([FromBody] ExcelExportRequestModel inputData) {
        try {
            (bool success, byte[]? file, string errorMsg) = _service.GenerateExcelReport(inputData);
            if(!success) {
                return BadRequest(errorMsg);
            }
            return File(file!, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", inputData.Filename);
        } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
            return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
        }
    }
}
```
**_ Notas técnicas:_**
- El servicio devuelve el archivo de Excel generado como `byte[]`.
- En el controlador, el método `File()` se utiliza para devolver el archivo con el tipo MIME correcto para Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
- El manejo de excepciones garantiza que los errores inesperados devuelven un mensaje claro con el estado HTTP `500`.
- El formato de fecha utilizado es el definido en la configuración de la tabla bajo la configuración `exportDateFormat`.

Una vez que el punto final de backend está en su lugar, el siguiente paso es configurar el frontend. Como mínimo, debe proporcionar la URL de endpoint backend para la generación de informes de Excel.

El comportamiento del informe de Excel se puede personalizar a través del objeto `excelReport` dentro de su configuración `ITableOptions`. Las opciones disponibles son:
- **`url`** *(Default: `undefined`)*: Permite los informes de Excel especificando el punto final creado anteriormente (por ejemplo, `"Test/GenerateExcel"`).
- **`defaultTitle`** *(Default: `"Report"`)*: Define el título de informe predeterminado.
- **`titleAllowUserEdit`** *(Default: `true`)*: Determina si el usuario puede anular el título al exportar, o si el `defaultTitle` siempre se hace cumplir.

Su componente TipoScript puede parecerse a esto: 
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    excelReport: {
      url: "Test/GenerateExcel",
      // defaultTitle: "NEW TITLE", // Uncomment to override the default value
      // titleAllowUserEdit: false // Uncomment to override the default value
    }
  });
}
```

Y tu HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

Con estos pasos en su lugar:
1. El servicio Backend genera el archivo Excel usando `ClosedXML` con las configuraciones deseadas del usuario.
2. Controller endpoint expone el archivo como una respuesta HTTP.
3. Frontend está configurado para utilizar el endpoint y personalizar el comportamiento a través de `ITableOptions`.

Esta integración proporciona a los usuarios una manera perfecta de exportar sus datos de tablas a Excel manteniendo el control completo sobre algunas opciones de personalización.

<br><br>



<a id="613-setting-up-views"></a>
### 6.13 Configuración de vistas
<a id="generic-configuration"></a>
#### Configuración genérica
Las vistas permiten que los usuarios persistan sus configuraciones de tablas a través de las sesiones. Esta función está deshabilitada por defecto, pero puede ser habilitada cuando sea necesario.

Existen tres posibles estrategias de almacenamiento:  
1. **Session storage** – mínima configuración requerida.
2. ** Almacenamiento local** – mínima configuración requerida.
3. **Depósito de base** – requiere configuración adicional de backend y base de datos.

Independientemente del tipo de almacenamiento, la configuración se realiza a través del objeto `views` dentro de su `ITableOptions`. Las opciones disponibles son:
- **`noViewSelectedText`** *(Default: `"--- Select a view ---"`)*: El texto que se muestra cuando no se selecciona la vista.
- **`reloadViewButtonClass`** *(Default: `undefined`)*: Clases CSS para aplicar al botón utilizado para volver a aplicar una vista. Se pueden proporcionar múltiples clases como una cadena separada del espacio.
- **`reloadViewButtonIcon`** *(Default: `"pi pi-refresh"`)*: El icono que el botón de vista de la aplicación tiene ..
- **`saveMode`** *(Default: `TableViewSaveMode.None`)*: Determina dónde se almacenan las vistas. Los valores posibles son:
  - **`TableViewSaveMode.None`**: Las vistas están desactivadas. El menú de vista no se mostrará.
  - **`TableViewSaveMode.SessionStorage`**: Guarda el estado de la vista en el navegador `sessionStorage`. Los datos se aclaran cuando la pestaña está cerrada. No es accesible desde otros dispositivos.
  - **`TableViewSaveMode.LocalStorage`**: Guarda el estado de la vista en el navegador `localStorage`. Persiste en las sesiones del navegador, pero se perderá si el usuario elimina los datos locales. No es accesible desde otros dispositivos.
  - **`TableViewSaveMode.DatabaseStorage`**: Guarda el estado de vista en una base de datos de backend. Requiere configuración adicional de backend/database pero permite que las vistas se compartan entre dispositivos.
- **`saveKey`** *(Default: `undefined`)*: Un identificador único para la tabla. Se requiere si las vistas están habilitadas.
- **`selectViewButtonClass`** *(Default: `undefined`)*: Una colección de clases personalizadas de CSS para aplicar al botón que abre el menú de vistas. Se pueden proporcionar múltiples clases como una cadena separada del espacio.
- **`urlGet`** *(Default: `undefined`)*: Backend endpoint para recuperar vistas guardadas (sólo utilizado con `DatabaseStorage`).
- **`urlSave`** *(Default: `undefined`)*: Punto final para guardar vistas (sólo utilizado con `DatabaseStorage`).

**Nota:** `urlGet` y `urlSave` son ignorados a menos que se seleccione el modo `DatabaseStorage`.

El menú **view sólo se mostrará** si:
- `saveMode` no es `None`.
- `saveKey` se define.

Un ejemplo de su componente TipoScript puede parecerse a esto, asumiendo que desea utilizar un modo de ahorro `TableViewSaveMode.LocalStorage`: 
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions, TableViewSaveMode } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    views: {
      saveMode: TableViewSaveMode.LocalStorage,
      saveKey: "TEST",
      // urlGet: "URL to get views", // Uncomment if using databaseStorage
      // urlSave: "URL to save views" // Uncomment if using databaseStorage
    }
  });
}
```

Y tu HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="database-persistent-views"></a>
#### Vistas persistentes en la base de datos
<a id="database-setup"></a>
##### Configuración de la base de datos
Para configurar las vistas persistentes de la base de datos, comience creando una tabla en su base de datos para almacenar las vistas. Se recomienda encarecidamente utilizar el script demo como punto de partida: [05 SaveTableViews.sql](Database%20scripts/05%20SaveTableViews.sql).

Puede adaptar el SQL (por ejemplo, cambiar la longitud de la columna `username` o utilizar un tipo de datos diferente como un GUID). La importante semántica de columna que usted necesita para mantener son:
- **`username`**: Identifica al usuario que posee la vista. Puede implementarse utilizando `varchar`/`nvarchar` (para identificadores de usuario textual) o `uniqueidentifier` (si prefiere almacenar IDs de usuario como GUIDs). Elija el tipo que coincida con el tipo utilizado por su identidad de usuario backend.
- **`tableKey`**: Identifica la tabla a la que pertenece la vista. Típicamente una tecla de cuerda corta que denota únicamente la tabla.
- **`viewAlias`**: Un nombre para la vista guardada (esto es introducido por el usuario).
- **`viewData`**: Una carga útil JSON que contiene el estado de vista serializado (columnas, filtros, ordenaciones, paginación, etc.).
- **`lastActive`**: Un booleano para saber si el usuario marcó esta vista por ser cargado en la siguiente tabla init.

Es importante que la combinación de `username`, `tableKey` y `viewAlias` sea única (crear un índice único o único compuesto) por lo que un usuario no puede crear nombres de vista duplicados para la misma tabla. También considere agregar índices apropiados (por ejemplo en `username` y `tableKey`) para mantener el performant de la recuperación.

<br><br>



<a id="backend-setup"></a>
##### Configuración del backend
En el backend necesitas crear un modelo que mapee la tabla de bases de datos utilizada para almacenar las vistas. Se recomienda, especialmente si usted está utilizando andamios, para definir la clase modelo como `partial`. De esta manera se puede ampliar más adelante sin modificar el código generado.

La clase modelo creada debe implementar `ITableViewEntity<TUsername>`, donde `TUsername` representa el tipo que desea utilizar para la columna `username` (por ejemplo, `string` o `GUID`, dependiendo de su esquema de base).

La interfaz tiene la siguiente definición mínima que su modelo (y tabla de bases de datos) debe proporcionar:
```c#
public interface ITableViewEntity<TUsername> {
    TUsername Username { get; set; }
    string TableKey { get; set; }
    string ViewAlias { get; set; }
    string ViewData { get; set; }
    public bool LastActive { get; set; }
}
```

Un ejemplo de cómo se puede implementar esto, asumiendo que su columna `username` se ha definido como `nvarchar` en su base de datos (y como `string` en su modelo):
```c#
public partial class TableView : ITableViewEntity<string> {
    // Inherit ITableViewEntity
}
```

Una vez que se defina el modelo, tendrá que comenzar implementando un repositorio para su servicio. El repositorio que accede a su servicio podría parecerse a esto:
```c#
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;

namespace ECSPrimengTableExample.Repository {
    public class TestRepository {

        private readonly primengTableReusableComponentContext _context;

        public TestRepository(primengTableReusableComponentContext context) {
            _context = context;
        }

        public async Task<List<ViewDataModel>> GetViewsAsync(string username, ViewLoadRequestModel request) {
            return await EcsPrimengTableService.GetViewsAsync<TableView, string>(
                _context,
                username,
                request.TableViewSaveKey
            );
        }

        public async Task SaveViewsAsync(string username, ViewSaveRequestModel request) {
            await EcsPrimengTableService.SaveViewsAsync<TableView, string>(
                _context,
                username,
                request.TableViewSaveKey,
                request.Views
            );
        }
    }
}
```

Una vez hecho el repositorio, debe implementar el servicio para manejar la lógica para recuperar y almacenar las vistas. Un ejemplo de su servicio para cargar y guardar vistas podría ser así:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public async Task<List<ViewDataModel>> GetViews(string username, ViewLoadRequestModel request) {
            return await _repo.GetViewsAsync(username, request);
        }

        public async Task SaveViews(string username, ViewSaveRequestModel request) {
            await _repo.SaveViewsAsync(username, request);
        }
    }
}
```

Por último, debe añadir los dos puntos finales a su controlador que consumen el servicio creado anteriormente:
```c#
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase {
    private readonly ITestService _service;

    public TestController(ITestService service) {
        _service = service;
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> GetViews([FromBody] ViewLoadRequestModel request) {
        try {
            string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
            return Ok(await _service.GetViews(username, request));
        } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
            return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
        }
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> SaveViews([FromBody] ViewSaveRequestModel request) {
        try {
            string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
            await _service.SaveViews(username, request);
            return Ok("Views saved OK");
        } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
            return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
        }
    }
}
```

> [!TIP]  
> Puede configurar el número de vistas **maximum permitido por table** directamente desde el backend.
> 
> Esto se hace en su servicio de configuración **table**, al llamar a `EcsPrimengTableService.GetTableConfiguration`.
>
> Uno de sus argumentos define el número máximo de opiniones permitidas.
> - Si se establece en `null`, se volverá al valor predeterminado de inicialización (**10 views**).
> - Si se establece en un número específico, ese valor anulará el valor predeterminado de esa tabla.

<br><br>



<a id="frontend-setup"></a>
##### Configuración del frontend
Para configurar el frontend, necesita actualizar el objeto `views` dentro de su `ITableOptions`.  
Como mínimo, debe establecer las siguientes opciones:
- **`saveMode`**: Establece esto **`TableViewSaveMode.DatabaseStorage`**.
- **`saveKey`**: Definir una clave única para identificar la tabla. *(Debe ser único a través de su aplicación)*.
- **`urlGet`**: La URL del punto final para recuperar la lista de vistas guardadas.
- **`urlSave`**: La URL de endpoint para persistir las vistas.

Un ejemplo de una configuración del componente TipoScript puede parecerse a esto:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions, TableViewSaveMode } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    views: {
      saveMode: TableViewSaveMode.DatabaseStorage,
      saveKey: "TEST",
      urlGet: "Test/GetViews",
      urlSave: "Test/SaveViews"
    }
  });
}
```

Y tu HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="614-configurable-dynamic-column-exclusion"></a>
### 6.14 Exclusión dinámica configurable de columnas
La función de exclusión de la columna está totalmente gestionada en el backend.  
Este paquete proporciona tres servicios básicos en los que se puede configurar esta funcionalidad:
- **`GetTableConfiguration`**: Limita el conjunto de columnas enviadas al frontend, afectando también las opciones disponibles en el menú selector de columnas.
- **`PerformDynamicQuery`**: Asegura que los usuarios no puedan manipular las solicitudes de frontend para obtener acceso a columnas excluidas.
- **`GenerateExcelReport`**: Restringe qué columnas se pueden incluir en los archivos de Excel exportados.

Todos estos servicios comparten un parámetro común llamado **`excludedColumns`**, que es un **`List<string>?`**.  
Esta lista especifica los nombres de las columnas que deben ser excluidos de la visibilidad o selección.  

Cada artículo de la lista debe coincidir exactamente con el nombre **property** del DTO utilizado para construir la proyección de la consulta.  
La comparación es **case-in responsive**.

<br>

**_Ejemplo_**

Supongamos que usted tiene el siguiente DTO era que desea excluir la columna `Money` a un conjunto de usuarios:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Username")]
	public string Username { get; set; } = string.Empty;

	[ColumnAttributes("Money", dataType: DataType.Numeric)]
	public decimal Money { get; set; }

	[ColumnAttributes("Has a house", dataType: DataType.Boolean)]
	public bool House { get; set; }
}
```

Una implementación mínima de su servicio podría parecer así (asumiendo que desea excluir la columna en los tres servicios posibles):
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        private List<string> FuncThatReturnsColumnsToBeExcluded(){
          // Provide the logic that returns a List<string> with the names of the columns to exclude.
          return ["Money"];
        }

        // Table configuration
        public TableConfigurationModel GetTableConfiguration() {
            return EcsPrimengTableService.GetTableConfiguration<TestDto>(excludedColumns: FuncThatReturnsColumnsToBeExcluded());
        }

        // Table data
        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true, EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), excludedColumns: FuncThatReturnsColumnsToBeExcluded()));
        }

        // Export to Excel
        public (bool success, byte[]? file, string errorMsg) GenerateExcelReport(ExcelExportRequestModel inputData) {
            return EcsPrimengTableService.GenerateExcelReport(inputData, GetBaseQuery(), excludedColumns: FuncThatReturnsColumnsToBeExcluded());
        }

        // Common base query shared between table data and export to Excel
        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    Money = u.Money,
                    House = u.House
                });
        }
    }
}
```

<br><br>



<a id="615-table-description"></a>
### 6.15 Descripción de la tabla
La descripción de la tabla se configura en el frontend a través de la **`description`** objeto dentro del `ITableOptions` interfaz, que proporciona las siguientes propiedades:
- **`icon`** *(Default: `"pi pi-info-circle"`)*: Icono mostrado junto a la descripción de la tabla. Puede utilizar cualquier clase de PrimeIcons o iconos de bibliotecas de terceros, como Iconos Materiales o Iconos de Fuente.
- **`tooltip`** *(Default: `true`)*: Determina cómo se muestra el texto de descripción.
  - `true`, el contenido `text` se muestra como un elemento de herramientas cuando se desplaza sobre el icono de descripción.
  - `false`, el `text` se muestra en línea a la derecha del icono.
- **`text`** *(Default: `undefined`)*: El contenido de descripción a mostrar. Si se deja sin definir o sin cadena, la descripción de la tabla no se mostrará. Soporta HTML básico para el formato de texto rico (por ejemplo, `<b>`, `<u>`, `<i>`).

Para habilitar esta característica, simplemente proporcione un valor `text` no vacío y utilice las otras propiedades para personalizar cómo se muestra la descripción.

<br>

**_Ejemplo_**

Para configurar la tabla para mostrar una descripción que contiene texto HTML rico, renderizado en línea junto al icono, puede definirla en el archivo TipoScript de su componente como sigue.  
A continuación se muestra un ejemplo mínimo asumiendo que el componente se llama `Home`:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    description: {
      text: "Hello world. <b>This is bold.</b> <i>This is italic.</i> <u>This is underlined.</u>",
      tooltip: false,
      // icon: "pi pi-info-circle" // Uncoment to modify the icon displayed
    }
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="616-table-legend"></a>
### 6.16 Leyenda de la tabla
La leyenda de la tabla está configurada en el frontend a través de la **`legend`** objeto dentro del `ITableOptions` interfaz, que proporciona las siguientes propiedades:
- **`content`** *(Default: `undefined`)*: El contenido que se mostrará en la popover de la leyenda. Puede ser rico en HTML.
- **`button`**: Opciones de configuración para el botón de leyenda. Es una `ITableButton` que tiene los siguientes valores predeterminados para este botón son:
  - **`icon`** *(Default: `"pi pi-bars"`)*: Icono mostrado junto al botón de la leyenda de la tabla. Puede utilizar cualquier clase de PrimeIcons o iconos de bibliotecas de terceros, como Iconos Materiales o Iconos de Fuente.
  - **`label`** *(Default: `"Legend"`)*: La etiqueta mostrada en el botón de leyenda.

Para habilitar esta característica, simplemente proporcione un valor `content` no vacío.

> [!NOTE]
> El botón de leyenda siempre tendrá precedencia sobre cualquier acción personalizada, y su clic activará la pantalla de la leyenda popover.

<br>

**_Ejemplo_**

Para configurar la tabla para mostrar una leyenda que contiene texto HTML rico, puede definirla en el archivo TypeScript de su componente como sigue.  
A continuación se muestra un ejemplo mínimo asumiendo que el componente se llama `Home`:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    legend:{
      content: `
        <span><b>MY SUPER LEGEND</b></span>
        <ul>
          <li>
            <i class="pi pi-check-square"></i>
            Item 1
          </li>
          <li>
            <i>Item 2</i>
            <i class="pi pi-paperclip"></i>
          </li>
          <li><u>Item 3</u></li>
        </ul>
      `,
      // button: {
        // icon: "pi pi-bars", // Uncomment to customize the legend button icon
        // label: "Legend", // Uncomment to customize the legend button text
        // You can customize other properties included in the ITableButton
      // }
    }
  });
}
```

Y en su HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



<a id="617-reset-table-view"></a>
### 6.17 Restablecer la vista de la tabla
La vista de tabla de reajuste se puede personalizar a través de la **`resetTableView`** objeto dentro del `ITableOptions` interfaz, que proporciona las siguientes propiedades:
- **`enabled`** *(Default: `true`)*: Si el botón de vista de la tabla de reinicio debe ser habilitado.
- **`icon`** *(Default: `"pi pi-eraser"`)*: Se puede utilizar para especificar un icono diferente para ser utilizado por el botón de vista de tabla de reset. Puede reemplazarlo con cualquier icono de PrimeNG u otras bibliotecas como Font Awesome o Material Icons.

Esta función es habilitada por defecto, pero puede deshabilitarse estableciendo `enabled` a `false` si es necesario.

<br>

**_Ejemplo_**

Para configurar la tabla para ocultar la **`reset table view button`**, puede definirlo en el archivo TypeScript de su componente como sigue.  
A continuación se muestra un ejemplo mínimo asumiendo que el componente se llama `Home`:
```ts
import { Component } from '@angular/core';
import { ECSPrimengTable, ITableOptions, createTableOptions } from '@eternalcodestudio/primeng-table';

@Component({
  selector: 'ecs-home',
  standalone: true,
  imports: [
    ECSPrimengTable
  ],
  templateUrl: './home.html'
})
export class Home {
  tableOptions: ITableOptions = createTableOptions({
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    resetTableView: {
      enabled: false,
      // icon: "pi pi-eraser" // Uncomment to modify the icon used
    }
  });
}
```

<br><br>



<a id="618-configurable-dynamic-column-attributes"></a>
### 6.18 Atributos dinámicos configurables de las columnas
La función de atributos dinámicos de columna está totalmente gestionada en el backend.  
Este paquete proporciona tres servicios básicos en los que se puede configurar esta funcionalidad:
- **`GetTableConfiguration`**: Inyecta atributos de columna dinámicos en los metadatos devueltos al frontend, permitiendo que cada columna muestre encabezados, formatos, reglas de visibilidad, alineación y más actualizados.
- **`PerformDynamicQuery`**: Aplica atributos dinámicos anula durante el procesamiento de consultas, asegurando que el filtrado, la ordenación y otras operaciones del lado del servidor respeten la configuración de columna actualizada.
- **`GenerateExcelReport`**: Utiliza los atributos de columna dinámica para determinar la estructura y el formato del archivo Excel exportado, incluyendo formatos de fecha personalizadas, columnas renombradas, overrides de la zona horaria y cualquier otro ajuste de tiempo de ejecución.

Los tres servicios comparten un parámetro común llamado **`dynamicAttributes`**, que es un **`Dictionary<string, ColumnMetadataOverrideModel>?`**.

Este diccionario contiene la lista de columnas cuyos atributos desea anular.  
Cada clave del diccionario debe coincidir con el **property name** del DTO utilizado en la proyección de la consulta.  
Los campos overridable corresponden a las propiedades definidas en la clase `ColumnMetadataOverrideModel`, cubriendo casi todos los atributos que una columna puede soportar.

<br>

**_Ejemplo_**

Asume el siguiente ejemplo DTO, donde desea anular los atributos de la columna `DateOfBirth` para que utilice una zona horaria diferente a la predeterminada definida para la tabla:
```C#
public class TestDto {
	[ColumnAttributes(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[ColumnAttributes("Username")]
	public string Username { get; set; } = string.Empty;

	[ColumnAttributes("Date of birth", dataType: DataType.Date)]
	public DateTime DateOfBirth { get; set; }

	[ColumnAttributes("Has a house", dataType: DataType.Boolean)]
	public bool House { get; set; }
}
```

Una implementación mínima de su servicio podría parecer así (asumiendo que desea cambiar la zona horaria de la columna en los tres servicios posibles):
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        private Dictionary<string, ColumnMetadataOverrideModel> FuncThatReturnsColumnsToBeModified(){
          // Provide the logic that returns a Dictionary<string, ColumnMetadataOverrideModel> 
          // with the names of the columns and attributes that you want to override.
          return new() {
              { "DateOfBirth", new ColumnMetadataOverrideModel {
                  // Overrides the timezone for this column only
                  DateTimezone = "+05:00"
              }}
          };
        }

        // Table configuration
        public TableConfigurationModel GetTableConfiguration() {
            return EcsPrimengTableService.GetTableConfiguration<TestDto>(dynamicAttributes: FuncThatReturnsColumnsToBeModified());
        }

        // Table data
        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true, EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), dynamicAttributes: FuncThatReturnsColumnsToBeModified()));
        }

        // Export to Excel
        public (bool success, byte[]? file, string errorMsg) GenerateExcelReport(ExcelExportRequestModel inputData) {
            return EcsPrimengTableService.GenerateExcelReport(inputData, GetBaseQuery(), dynamicAttributes: FuncThatReturnsColumnsToBeModified());
        }

        // Common base query shared between table data and export to Excel
        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    Username = u.Username,
                    DateOfBirth = u.DateOfBirth,
                    House = u.House
                });
        }
    }
}
```

<br><br><br>



---
<a id="7-backend-component-reference"></a>
## 7 Referencia del componente backend
Esta sección describe los servicios de backend proporcionados por la biblioteca `ECS.PrimengTable`.

Incluye métodos de servicio, modelos de datos, enums, interfaces y atributos utilizados para apoyar el frontend de tabla ECS PrimeNG.

> [!NOTE]  
> Solo **public methods and types intended for external use** are documented here. Los ayudantes internos, los métodos privados y las clases sólo internas no están cubiertos.

<br><br>



<a id="71-enums"></a>
### 7.1 Enumeraciones
<a id="711-celloverflowbehaviour"></a>
#### 7.1.1 CellOverflowBehaviour
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Especifica cómo debe comportarse el contenido de una celda de tabla cuando desborda su contenedor.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Hidden` | 0 | El contenido desbordante será ocultado y recortado. |
| `Wrap` | 1 | El contenido desbordante se envolverá a la siguiente línea dentro de la celda. |

<br><br>



<a id="712-columnsort"></a>
#### 7.1.2 ColumnSort
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Especifica la dirección de ordenación para una columna de tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Descending` | 0 | Ordenar la columna en orden descendente. |
| `Ascending` | 1 | Ordenar la columna en orden ascendente. |

<br><br>



<a id="713-dataalignhorizontal"></a>
#### 7.1.3 DataAlignHorizontal
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Especifica la alineación horizontal del contenido dentro de una celda de tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Left` | 0 | Alinear el contenido al lado izquierdo de la celda. |
| `Center` | 1 | Alinear el contenido al centro de la celda. |
| `Right` | 2 | Alinear el contenido al lado derecho de la celda. |

<br><br>



<a id="714-dataalignvertical"></a>
#### 7.1.4 DataAlignVertical
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Especifica la alineación vertical del contenido dentro de una celda de tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Top` | 0 | Alinear el contenido a la parte superior de la celda. |
| `Middle` | 1 | Adecuar el contenido a la mitad de la celda. |
| `Bottom` | 2 | Alinear el contenido a la parte inferior de la celda. |

<br><br>



<a id="715-datatype"></a>
#### 7.1.5 DataType
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Representa el tipo de datos de una columna o celda de la tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Text` | 0 | Datos textuales. |
| `Numeric` | 1 | Datos numéricos. |
| `Boolean` | 2 | Datos booleanos (true/false). |
| `Date` | 3 | Datos de fecha o fecha. |
| `List` | 4 | Tipo especial que representa una lista de cadenas separadas por ";" utilizado para la funcionalidad de filtro predefinida avanzada. |

<br><br>



<a id="716-frozencolumnalign"></a>
#### 7.1.6 FrozenColumnAlign
**Espacio de nombres:** `ECS.PrimengTable.Enums`  

<br>

**_Resumen_**  
Especifica la alineación de una columna fija en la tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `None` | 0 | Sin alineación congelada. |
| `Left` | 1 | Columna congelado alineada a la izquierda. |
| `Right` | 2 | Columna congelado alineada a la derecha. |

<br><br>



<a id="72-attributes"></a>
### 7.2 Atributos
<a id="721-columnattributes"></a>
#### 7.2.1 ColumnAttributes
**Espacio de nombres:** `ECS.PrimengTable.Attributes`  
**Uso:** Aplicado a propiedades para definir su comportamiento de columna de tabla en tablas ECS PrimeNG.  

<br>

**_Resumen_**  
Marca una propiedad para definir su comportamiento de columna de tabla en las tablas ECS PrimeNG. Incluye encabezado, tipo de datos, alineación, filtrado, ordenación, redimensionado, visibilidad, información sobre herramientas y comportamiento de columna congelado.

<br>

**_Propiedades configurables (parametros)_**  
| Propiedad | Tipo | Default | Descripción |
|-|-|-|-|
| `canBeFiltered` | `bool` | `true` | Si es verdad, la columna se puede filtrar. |
| `canBeGlobalFiltered` | `bool` | `true` | Si es cierto, los datos pueden ser filtrados a nivel mundial. Discapacitados para columnas booleanas. |
| `canBeHidden` | `bool` | `true` | Si es verdad, la columna puede ser ocultada por el usuario. |
| `canBeReordered` | `bool` | `true` | Si es cierto, la columna puede ser reordenada por el usuario. |
| `canBeResized` | `bool` | `true` | Si es cierto, la columna puede ser redimensionada por el usuario. |
| `canBeSorted` | `bool` | `true` | Si es verdad, la columna puede ser ordenada. |
| `cellOverflowBehaviour` | [`CellOverflowBehaviour`](#711-celloverflowbehaviour) | `Hidden` | Define cómo se comporta el contenido celular cuando se desborda. |
| `cellOverflowBehaviourAllowUserEdit` | `bool` | `true` | Si es cierto, el usuario puede modificar el comportamiento de desbordamiento. Discapacitados para columnas booleanas. |
| `columnDescription` | `string` | `""` | Descripción opcional mostrada a través de un icono en el encabezado de la columna. |
| `dataAlignHorizontal` | [`DataAlignHorizontal`](#713-dataalignhorizontal) | `Center` | Alineación horizontal de los datos en la columna. |
| `dataAlignHorizontalAllowUserEdit` | `bool` | `true` | Indica si el usuario puede modificar la alineación horizontal. |
| `dataAlignVertical` | [`DataAlignVertical`](#714-dataalignvertical) | `Middle` | Alineación vertical de los datos en la columna. |
| `dataAlignVerticalAllowUserEdit` | `bool` | `true` | Indica si el usuario puede modificar la alineación vertical. |
| `dataTooltipCustomColumnSource` | `string` | `""` | Nombre de columna opcional para buscar contenido de información sobre herramientas personalizado. |
| `dataTooltipShow` | `bool` | `true` | Si es cierto, muestra el contenido de la celda como información sobre herramientas en la palanca. |
| `dataType` | [`DataType`](#715-datatype) | `Text` | El tipo de datos en la columna, utilizado para filtrar y formatear. |
| `dateCulture` | `string?` | `null` | Cultura de fecha opcional. |
| `dateFormat` | `string?` | `null` | Formato de fecha opcional. |
| `dateTimezone` | `string?` | `null` | Zona horaria opcional. |
| `exportDateFormat` | `string?` | `null` | Formato de fecha opcional para esta columna en las exportaciones. |
| `filterPredefinedValuesName` | `string` | `""` | Nombre utilizado en TipoScript para almacenar valores de filtro predefinidos. |
| `frozenColumnAlign` | [`FrozenColumnAlign`](#716-frozencolumnalign) | `None` | Indica si la columna está congelada y su alineación. |
| `header` | `string` | `""` | El nombre mostrado para la columna en la tabla. |
| `initialWidth` | `double` | `0` | Ancho inicial de la columna en píxeles. Si se selecciona=0 y se congela, por defecto a 100. |
| `sendColumnAttributes` | `bool` | `true` | Si es verdad, los atributos de columna se enviarán automáticamente en consultas dinámicas. |
| `startHidden` | `bool` | `false` | Si es verdad, la columna comienza oculta (sólo si `canBeHidden` es verdad). |

<br><br>



<a id="73-interfaces"></a>
### 7.3 Interfaces
<a id="731-itableviewentitytusername"></a>
#### 7.3.1 ITableViewEntity<TUsername>
**Espacio de nombres:** `ECS.PrimengTable.Interfaces`  
**Uso:** Implementada por las entidades que se muestran en las vistas de ECS PrimeNG Table.

<br>

**_Resumen_**  
Define las propiedades requeridas para que una entidad se muestre en una vista de tabla.

<br>

**_Parámetros de tipo_**
| Nombre | Descripción |
|-|-|
| `TUsername` | El tipo que representa el nombre de usuario para la entidad. Puede ser `string`, `Guid`, o cualquier tipo de identificador de usuario personalizado. |

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `LastActive` | `bool` | Valor indicando si esta vista fue la última activa para el usuario. |
| `TableKey` | `string` | La clave única que identifica la tabla. |
| `Username` | `TUsername` | El nombre de usuario (o identificador) del usuario que posee esta vista de tabla. |
| `ViewAlias` | `string` | El alias de la vista (nombre descriptivo). |
| `ViewData` | `string` | Los datos de la vista serializada como una cadena. Se utiliza para almacenar orden de columna, visibilidad, filtros, etc. |

<br><br>



<a id="74-models"></a>
### 7.4 Modelos
<a id="741-columnfiltermodel"></a>
#### 7.4.1 ColumnFilterModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa la configuración de un filtro aplicado a una columna de tabla.  
Este modelo define el valor, el modo de emparejamiento, y el operador lógico utilizado para filtrar.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `MatchMode` | `string` | El modo de coincidencia para aplicar al filtrar la columna. Ejemplos: `"equals"`, `"contains"`, `"startsWith"`, `"endsWith"`. |
| `Operator` | `string` | El operador lógico para combinar este filtro con otros. Ejemplos: `"AND"`, `"OR"`. |
| `Value` | `any` | El valor utilizado para filtrar la columna. Puede ser de cualquier tipo dependiendo del tipo de datos de la columna (estring, número, fecha, etc.). |

<br><br>



<a id="742-columnmetadatamodel"></a>
#### 7.4.2 ColumnMetadataModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa los metadatos de una columna de tabla.  
Contiene información sobre el campo, cabecera, tipo, alineación, visibilidad, filtrado, ordenación, redimensionado, punta de herramientas, columnas fijas, comportamiento de desbordamiento y ancho inicial.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `CanBeFiltered` | `bool` | Obtiene o establece un valor indicando si la columna puede ser filtrada. |
| `CanBeGlobalFiltered` | `bool` | Obtiene o establece un valor indicando si la columna puede ser filtrada globalmente. |
| `CanBeHidden` | `bool` | Obtiene o establece un valor indicando si la columna puede ser ocultada. |
| `CanBeReordered` | `bool` | Obtiene o establece un valor indicando si la columna puede ser reordenada. |
| `CanBeResized` | `bool` | Obtiene o establece un valor indicando si la columna puede ser redimensionada. |
| `CanBeSorted` | `bool` | Obtiene o establece un valor indicando si la columna puede ser ordenada. |
| `CellOverflowBehaviour` | [`CellOverflowBehaviour`](#711-celloverflowbehaviour) | Obtiene o establece un valor indicando cómo se comporta el contenido celular cuando se desborda. |
| `CellOverflowBehaviourAllowUserEdit` | `bool` | Obtiene o establece un valor indicando si el usuario puede modificar el comportamiento de desbordamiento. |
| `ColumnDescription` | `string` | Obtiene o establece la descripción de la columna. |
| `DataAlignHorizontal` | [`DataAlignHorizontal`](#713-dataalignhorizontal) | Obtiene o establece la alineación de los datos en la columna ("izquierda", "centro", o "derecho"). |
| `DataAlignHorizontalAllowUserEdit` | `bool` | Obtiene o establece un valor indicando si la alineación horizontal puede ser modificada por el usuario. |
| `DataAlignVertical` | [`DataAlignVertical`](#714-dataalignvertical) | Obtiene o establece la alineación vertical de los datos en la columna. |
| `DataAlignVerticalAllowUserEdit` | `bool` | Obtiene o establece un valor indicando si la alineación vertical puede ser modificada por el usuario. |
| `DataTooltipCustomColumnSource` | `string` | Obtiene o establece el nombre de la columna para buscar contenido de herramientas personalizado. |
| `DataTooltipShow` | `bool` | Obtiene o establece un valor indicando si la columna muestra el contenido de la celda como punta de la herramienta en el audífono. |
| `DataType` | [`DataType`](#715-datatype) | Obtiene o establece el tipo de datos de la columna. |
| `DateCulture` | `string?` | Consigue o establece una cultura de fecha opcional. |
| `DateFormat` | `string?` | Consigue o establece un formato de fecha opcional para esta columna. |
| `DateTimezone` | `string?` | Obtiene o establece una zona horaria opcional. |
| `ExportDateFormat` | `string?` | `null` | Obtiene o establece un formato de fecha opcional para esta columna en las exportaciones. |
| `Field` | `string` | Obtiene o establece el campo asociado con la columna. |
| `FilterPredefinedValuesName` | `string` | Obtiene o establece el nombre utilizado en TipoScript para almacenar valores de filtro predefinidos. |
| `FrozenColumnAlign` | [`FrozenColumnAlign`](#716-frozencolumnalign) | Obtiene o establece la alineación de una columna fija. |
| `Header` | `string` | Obtiene o establece el encabezado que se mostrará para la columna en la tabla. |
| `InitialWidth` | `double` | Obtiene o establece el ancho inicial de la columna. |
| `SendColumnAttributes` | `bool` | Obtiene o establece un valor indicando si los atributos de columna serán enviados automáticamente en consultas dinámicas. |
| `StartHidden` | `bool` | Obtiene o establece un valor indicando si la columna comienza oculta (si se puede ocultar). |

<br><br>



<a id="743-columnmetadataoverridemodel"></a>
#### 7.4.3 ColumnMetadataOverrideModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa un conjunto de anulaciones opcionales para metadatos de columna.  
Cualquier propiedad definida aquí sustituye el valor correspondiente en el [`ColumnMetadataModel`](#742-columnmetadatamodel) subyacente.
Sólo se aplican propiedades no nulas, permitiendo anulaciones parciales y específicas.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `CanBeFiltered` | `bool?` | Anula si la columna puede ser filtrada. |
| `CanBeGlobalFiltered` | `bool?` | Anula si la columna participa en el filtrado global. |
| `CanBeHidden` | `bool?` | Anula si la columna puede ser ocultada. |
| `CanBeReordered` | `bool?` | Anula si la columna puede ser reordenada. |
| `CanBeResized` | `bool?` | Anula si la columna puede ser redimensionada. |
| `CanBeSorted` | `bool?` | Anula si la columna puede ser ordenada. |
| `CellOverflowBehaviour` | `CellOverflowBehaviour?` | Sobrescribe cómo se comporta el contenido celular cuando rebosa la columna. |
| `CellOverflowBehaviourAllowUserEdit` | `bool?` | Sobrescribe si el usuario puede modificar el comportamiento de desbordamiento. |
| `ColumnDescription` | `string?` | Supera la descripción opcional mostrada en el encabezado de la columna. |
| `DataAlignHorizontal` | `DataAlignHorizontal?` | Supera la alineación horizontal de los datos de la columna. |
| `DataAlignHorizontalAllowUserEdit` | `bool?` | Supera si el usuario puede editar la alineación horizontal. |
| `DataAlignVertical` | `DataAlignVertical?` | Supera la alineación vertical de los datos de la columna. |
| `DataAlignVerticalAllowUserEdit` | `bool?` | Supera si el usuario puede editar la alineación vertical. |
| `DataTooltipShow` | `bool?` | Sobrescribe si la columna muestra el contenido de la celda como un elemento de herramientas en el audífono. |
| `DateCulture` | `string?` | Supera la cultura utilizada al formatear los valores de la fecha. |
| `DateFormat` | `string?` | Supera el formato de fecha para esta columna. |
| `DateTimezone` | `string?` | Supera la zona horaria aplicada a los valores de la fecha para esta columna. |
| `ExportDateFormat` | `string?` | `null` | Supera el formato de fecha para esta columna en las exportaciones. |
| `Header` | `string?` | Anula el encabezado mostrado para la columna. |
| `StartHidden` | `bool?` | Anula si la columna comienza oculta. |

<br><br>


<a id="744-columnsortmodel"></a>
#### 7.4.4 ColumnSortModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa la configuración de ordenación de base para una columna de tabla.  
Este modelo define el campo para ordenar y el orden de ordenación (ascendiendo o descendiendo).

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `Field` | `string` | El campo asociado con la columna que se ordenará. |
| `Order` | `int` | La orden de la ordenación. Valores de ejemplo: `1` para ascender, `-1` para descender. |

<br><br>


<a id="745-excelexportrequestmodel"></a>
#### 7.4.5 ExcelExportRequestModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  
**Hereda de:** [`TableQueryRequestModel`](#748-tablequeryrequestmodel)  

Representa una solicitud para exportar datos de tablas a Excel.  
Incluye opciones para especificar si todas las columnas deben exportarse y si deben aplicarse filtros y tipos activos.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `AllColumns` | `bool` | De ser cierto, todas las columnas serán incluidas en la exportación, independientemente de la visibilidad. |
| `ApplyFilters` | `bool` | Si es cierto, aplica los filtros activos actualmente al exportar datos. |
| `ApplySorts` | `bool` | Si es cierto, aplica el tipo actual activo al exportar datos. |
| `Filename` | `string` | El nombre del archivo Excel que se generará. |
| `UseIconInBools` | `bool` | Si en bools necesitamos usar iconos o el valor booleano subyacente. |

<br><br>



<a id="746-tableconfigurationmodel"></a>
#### 7.4.6 TableConfigurationModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa la configuración de una tabla que incluye metadatos de columna, paginación y formato de fecha.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `AllowedItemsPerPage` | `int[]` | Permitido número de artículos por página para paginación. |
| `ColumnsInfo` | [`List<ColumnMetadataModel>`](#742-columnmetadatamodel) | Metadatos para cada columna en la tabla. |
| `DateCulture` | `string` | Cultura utilizada para la localización de fecha en la tabla. |
| `DateFormat` | `string` | Cadena de formato de fecha utilizada para mostrar fechas en la tabla. |
| `DateTimezone` | `string` | Timezone utilizado para el formato de la fecha en la tabla. |
| `ExportDateFormat` | `string` | Cadena de formato de fecha utilizada para mostrar fechas en las exportaciones. |
| `MaxViews` | `byte` | El número máximo de puntos de vista permitidos para una configuración de tabla. |

<br><br>



<a id="747-tablepagedresponsemodel"></a>
#### 7.4.7 TablePagedResponseModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa una respuesta por página para una consulta de tabla, incluyendo información de página, registros totales, y los datos en sí mismos.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `Data` | `dynamic` | Los datos reales devueltos por la consulta para mostrar en la tabla. |
| `Page` | `int` | El número de página actual de la respuesta. |
| `TotalRecords` | `long` | Número total de registros en el conjunto de datos después del filtrado (si existe). |
| `TotalRecordsNotFiltered` | `long` | Número total de registros en el conjunto de datos antes de aplicar cualquier filtro. |

<br><br>



<a id="748-tablequeryrequestmodel"></a>
#### 7.4.8 TableQueryRequestModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa una solicitud de consulta de tablas, incluyendo paginación, ordenación, filtrado y selección opcional de columnas.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `Columns` | `string[]?` | Lista opcional de columnas para recuperar en la consulta. |
| `DateCulture` | `string` | Cadena de cultura utilizada para la localización de la fecha. |
| `DateFormat` | `string` | Cadena de formato de fecha utilizada para los valores de fecha en la consulta. |
| `DateTimezone` | `string` | Cadena de la zona horaria utilizada para el formato de fecha. |
| `ExportDateFormat` | `string` | Cadena de formato de fecha utilizada para los valores de fecha en la exportación. |
| `Filter` | [`Record<string, ColumnFilterModel[]>`](#741-columnfiltermodel) | Diccionario de filtros de columna. La clave es el nombre de campo de columna, y el valor es una lista de filtros aplicados a esa columna. |
| `GlobalFilter` | `string?` | Filtro global opcional aplicado a todas las columnas. |
| `Page` | `int` | El número de página para recuperar (índice basado en 1). |
| `PageSize` | `byte` | Número de artículos por página. |
| `Sort` | [`ColumnSortModel[]?`](#744-columnsortmodel) | Lista de configuraciones de ordenación para aplicar a las columnas de la tabla. |

<br><br>



<a id="749-viewdatamodel"></a>
#### 7.4.9 ViewDataModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa los datos de la vista para una tabla, incluyendo su alias, datos serializados, y si es la última vista activa.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `LastActive` | `bool` | Indica si esta opinión fue la última vista activa. |
| `ViewAlias` | `string` | Alias solía identificar la vista. |
| `ViewData` | `string` | Datos serializados para la vista. |

<br><br>



<a id="7410-viewloadrequestmodel"></a>
#### 7.4.10 ViewLoadRequestModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  

Representa una solicitud para cargar una vista de tabla guardada utilizando su llave.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `TableViewSaveKey` | `string` | Clave identificando la vista de tabla guardada para cargar. |

<br><br>



<a id="7411-viewsaverequestmodel"></a>
#### 7.4.11 ViewSaveRequestModel
**Espacio de nombres:** `ECS.PrimengTable.Models`  
**Hereda de:** [`ViewLoadRequestModel`](#7410-viewloadrequestmodel)  

Representa una solicitud para guardar una o varias vistas de la tabla.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|----------|------|-------------|
| `Views` | [`List<ViewDataModel>`](#749-viewdatamodel) | Lista de puntos de vista para guardar. |

<br><br>



<a id="75-services"></a>
### 7.5 Servicios
<a id="751-validateitemsperpageandcols"></a>
#### 7.5.1 ValidateItemsPerPageAndCols
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static bool`

<br>

**_Resumen_**  
Valida la configuración de paginación y columna proporcionada para una tabla.  
Garantiza que el número especificado de elementos por página y columnas visibles coincidan con la configuración permitida definida en el sistema.
```C#
public static bool ValidateItemsPerPageAndCols(
    byte itemsPerPage,
    List<string>? columns,
    int[]? allowedItemsPerPage = null
)
```

<br>

**_Parámetros_**
| Nombre | Tipo | Descripción |
|-|-|-|
| `itemsPerPage` | `byte` | Número de elementos para mostrar por página. |
| `columns` | `List<string>?` | Lista de nombres de columna seleccionados o mostrados actualmente. Puede ser nulo. |
| `allowedItemsPerPage` | `int[]?` | Conjunto opcional de valores permitidos de elementos por página para validación. |

<br>

**_Valor devuelto_**
| Tipo | Descripción |
|-|-|
| `bool` | `true` si la configuración proporcionada es válida; de lo contrario, `false` |

<br><br>



<a id="752-gettableconfiguration"></a>
#### 7.5.2 GetTableConfiguration
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static TableConfigurationModel`  

<br>

**_Resumen_**  
Genera un `TableConfigurationModel` de los metadatos del tipo especificado `T`.  
Inspecciona todas las propiedades del tipo dado y extrae configuración de columna usando `ColumnAttributes`.

<br>

**_Observaciones_**  
Propiedades de `T` que carecen de `ColumnAttributes` serán saltadas, y un mensaje de advertencia se imprimirá a la consola.  
Las columnas marcadas con `SendColumnAttributes = false` también serán ignoradas.
```C#
public static TableConfigurationModel GetTableConfiguration<T>(
    int[]? allowedItemsPerPage = null,
    string? dateFormat = null,
    string? dateTimezone = null,
    string? dateCulture = null,
    string? exportDateFormat = null,
    byte? maxViews = null,
    Dictionary<string, ColumnMetadataOverrideModel>? dynamicAttributes = null,
    List<string>? excludedColumns = null,
    bool convertFieldToLower = true
)
```

<br>

**_Parámetros de tipo_**
| Nombre | Descripción |
|-|-|
| `T` | El tipo de clase que representa el modelo de datos para el cual generar la configuración de la tabla. |

<br>

**_Parámetros_**
| Nombre | Tipo | Descripción |
|-|-|-|
| `allowedItemsPerPage` | `int[]?` | Lista opcional de tamaños de paginación permitidos. Defaults to `TableConfigurationDefaults.AllowedItemsPerPage`. |
| `dateFormat` | `string?` | Cadena de formato de fecha opcional utilizada para la visualización. Defaults to `TableConfigurationDefaults.DateFormat`. |
| `dateTimezone` | `string?` | Identificador de la zona horaria opcional utilizado para el formato de fecha. Defaults to `TableConfigurationDefaults.DateTimezone`. |
| `dateCulture` | `string?` | Código de cultura opcional para la localización de la fecha. Defaults to `TableConfigurationDefaults.DateCulture`. |
| `exportDateFormat` | `string?` | Cadena de formato de fecha opcional utilizada para mostrar en las exportaciones. Defaults to `TableConfigurationDefaults.ExportDateFormat`. |
| `maxViews` | `byte?` | Número máximo opcional de vistas guardadas permitidas por tabla. Defaults to `TableConfigurationDefaults.MaxViews`. |
| `dynamicAttributes` | `Dictionary<string, ColumnMetadataOverrideModel>?` | El atributo de columna opcional anula. Las claves representan nombres de columna, y los valores son las instancias [ColumnaMetadataOverrideModel](#743-columnmetadataoverridemodel) cuyas propiedades anulan los metadatos de columna por defecto o basados en atributos. Si null, no se aplican anulaciones dinámicas. |
| `excludedColumns` | `List<string>?` | Lista opcional de nombres de columnas para excluir de la configuración generada. Útil para reglas de visibilidad específicas del cliente o contextos de datos restringidos. |
| `convertFieldToLower` | `bool` | Determina si la primera letra de cada nombre de propiedad se debe convertir en minúscula en el modelo de salida. Defaults to `true`. |

<br>

**_Valor devuelto_**
| Tipo | Descripción |
|-|-|
| [`TableConfigurationModel`](#746-tableconfigurationmodel) | Contiene los metadatos de tabla derivados de las propiedades anotadas del tipo especificado. |

<br><br>



<a id="753-performdynamicquery"></a>
#### 7.5.3 PerformDynamicQuery
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static TablePagedResponseModel`

<br>

**_Resumen_**  
Ejecute un oleoducto de consulta dinámico completo en la consulta de base proporcionada, incluyendo filtrado, ordenación, paginación y proyección de columna, devolviendo una respuesta de tabla estructurada.

<br>

**_Observaciones_**  
Este método orquesta el proceso de construcción de consultas delegando a métodos de ayuda como `GetDynamicQueryBase`, `PerformPagination` y `GetDynamicSelect`.
```C#
public static TablePagedResponseModel PerformDynamicQuery<T>(
    TableQueryRequestModel inputData,
    IQueryable<T> baseQuery,
    MethodInfo? stringDateFormatMethod = null,
    List<string>? defaultSortColumnName = null,
    List<ColumnSort>? defaultSortOrder = null,
    Dictionary<string, ColumnMetadataOverrideModel>? dynamicAttributes = null,
    List<string>? excludedColumns = null
)
```

<br>

**_Parámetros de tipo_**
| Nombre | Descripción |
|-|-|
| `T` | El tipo de entidad que se pregunta. |

<br>

**_Parámetros_**
| Nombre | Tipo | Descripción |
|-|-|-|
| `inputData` | [`TableQueryRequestModel`](#748-tablequeryrequestmodel) | El modelo de entrada que contiene filtros, ordenación y parámetros de paginación. |
| `baseQuery` | `IQueryable<T>` | La consulta base para aplicar operaciones dinámicas en. |
| `stringDateFormatMethod` | `MethodInfo?` | Método de reflexión opcional utilizado para aplicar una función de formato de fecha específica a las columnas de fecha de cadena. |
| `defaultSortColumnName` | `List<string>?` | Lista opcional de nombres de columnas para ordenar cuando no se proporciona ningún tipo explícito en `inputData`. |
| `defaultSortOrder` | [`List<ColumnSort>?`](#712-columnsort) | Lista opcional de direcciones de tipo ([`ColumnSort`](#712-columnsort)) que coinciden con las columnas predeterminadas. |
| `dynamicAttributes` | `Dictionary<string, ColumnMetadataOverrideModel>?` | El atributo de columna opcional anula. Las claves representan nombres de columna, y los valores son las instancias [ColumnaMetadataOverrideModel](#743-columnmetadataoverridemodel) cuyas propiedades anulan los metadatos de columna por defecto o basados en atributos. Si null, no se aplican anulaciones dinámicas. |
| `excludedColumns` | `List<string>?` | Lista opcional de nombres de columnas para excluir de la selección, incluso si aparecen en las columnas solicitadas de `inputData`. |

<br>

**_Valor devuelto_**
| Tipo | Descripción |
|-|-|
| [`TablePagedResponseModel`](#747-tablepagedresponsemodel) | Contiene los datos filtrados, ordenados, paginados y proyectados, junto con los recuentos de registro total para conjuntos de datos filtrados y no filtrados y la información actual de la página. |

<br><br>



<a id="754-generateexcelreport"></a>
#### 7.5.4 GenerateExcelReport
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static (bool, byte[]?, string)`

<br>

**_Resumen_**  
Genera un informe de Excel de la configuración de búsqueda y exportación proporcionada.  
El método ejecuta el oleoducto dinámico de consulta (filtros, ordenación, paginación), selecciona las columnas solicitadas, y escribe los resultados en un libro de trabajo de Excel, que se devuelve como un array byte.

<br>

**_Observaciones_**  
Este método actúa como punto de entrada de alto nivel para las operaciones de exportación de Excel.  
Delega la lógica básica a `ExcelExportService.GenerateExcelReport`, que maneja la ejecución de consultas, paginación y generación de archivos Excel.
```C#
public static (bool success, byte[]? reportFile, string statusMessage) GenerateExcelReport<T>(
    ExcelExportRequestModel inputData,
    IQueryable<T> baseQuery,
    MethodInfo? stringDateFormatMethod = null,
    List<string>? defaultSortColumnName = null,
    List<ColumnSort>? defaultSortOrder = null,
    Dictionary<string, ColumnMetadataOverrideModel>? dynamicAttributes = null,
    List<string>? excludedColumns = null,
    string sheetName = "MAIN",
    byte pageStack = 250
)
```

<br>

**_Parámetros de tipo_**  
| Nombre | Descripción |  
|-|-|  
| `T` | El tipo de entidad que se consulta y exporta. |  

<br>

**_Parámetros_**  
| Nombre | Tipo | Descripción |  
|-|-|-|  
| `inputData` | [`ExcelExportRequestModel`](#745-excelexportrequestmodel) | Modelo de solicitud de exportación que contiene opciones de paginación, ordenación, filtrado y selección de columnas. |  
| `baseQuery` | `IQueryable<T>` | La consulta base para aplicar operaciones dinámicas en. |  
| `stringDateFormatMethod` | `MethodInfo?` | Método de reflexión opcional utilizado para aplicar una función de formato de fecha específica a las columnas de fecha de cadena. |  
| `defaultSortColumnName` | `List<string>?` | Lista opcional de nombres de columnas a utilizar para ordenar cuando no se proporciona ningún tipo explícito. |  
| `defaultSortOrder` | [`List<ColumnSort>?`](#712-columnsort) | Lista opcional de direcciones de tipo ([`ColumnSort`](#712-columnsort)) que coinciden con las columnas predeterminadas. |  
| `dynamicAttributes` | `Dictionary<string, ColumnMetadataOverrideModel>?` | El atributo de columna opcional anula. Las claves representan nombres de columna, y los valores son las instancias [ColumnaMetadataOverrideModel](#743-columnmetadataoverridemodel) cuyas propiedades anulan los metadatos de columna por defecto o basados en atributos. Si null, no se aplican anulaciones dinámicas. |
| `excludedColumns` | `List<string>?` | Lista opcional de nombres de columnas para excluir de la selección, incluso si aparecen en las columnas solicitadas de `inputData`. |  
| `sheetName` | `string` | Nombre de la hoja de trabajo para crear en el libro de trabajo. Defaults to `"MAIN"`. |  
| `pageStack` | `byte` | Número de registros para procesar por lote de paginación interna (página de memoria). Defaults to `250`. |  

<br>

**_Valor devuelto_**  
Devuelve un tuple con los siguientes elementos:  
| Nombre | Tipo | Descripción |  
|-|-|-|  
| `success` | `bool` | `true` si la generación de Excel tuvo éxito; `false` de lo contrario. |  
| `reportFile` | `byte[]?` | El archivo de Excel generado como una matriz de byte, o `null` si la generación falló. |  
| `statusMessage` | `string` | Mensaje de estado o descripción de errores relacionados con el proceso de exportación. |

<br><br>



<a id="755-getviewsasync"></a>
#### 7.5.5 GetViewsAsync
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static async Task<List<ViewDataModel>>`

<br>

**_Resumen_**  
Consulta todas las vistas guardadas para el usuario y la tabla especificadas.  
Este método actúa como punto de entrada de alto nivel para obtener configuraciones de tabla personalizadas almacenadas para cada usuario.
```C#
public static async Task<List<ViewDataModel>> GetViewsAsync<TEntity, TUsername>(
    DbContext context,
    TUsername username,
    string tableKey
)
```

<br>

**_Parámetros de tipo_**  
| Nombre | Descripción |  
|-|-|  
| `TEntity` | El tipo de entidad que implementa `ITableViewEntity<TUsername>`. |  
| `TUsername` | El tipo de nombre de usuario utilizado para identificar al usuario. |  

<br>

**_Parámetros_**  
| Nombre | Tipo | Descripción |  
|-|-|-|  
| `context` | `DbContext` | El contexto de la base de datos se utiliza para acceder a las opiniones almacenadas. |  
| `username` | `TUsername` | El nombre de usuario cuyas vistas guardadas serán recuperadas. |  
| `tableKey` | `string` | La clave identificando la configuración de tabla para la que se almacenan las vistas. |  

<br>

**_Valor devuelto_**  
| Tipo | Descripción |  
|-|-|  
| [`Task<List<ViewDataModel>>`](#749-viewdatamodel) | Una lista de puntos de vista definidos por el usuario almacenados para la tabla especificada. |  

<br><br>



<a id="756-saveviewsasync"></a>
#### 7.5.6 SaveViewsAsync
**Espacio de nombres:** `ECS.PrimengTable.Services`  
**Tipo:** `static async Task`

<br>

**_Resumen_**  
Guarda o actualiza la lista de puntos de vista proporcionada para el usuario y la tabla especificados.  
Se actualizan las opiniones existentes, se añaden otras nuevas y se eliminan las opiniones no incluidas en la lista proporcionada.

<br>

**_Observaciones_**  
La operación es transaccional. Si se produce alguna excepción durante el procesamiento, todos los cambios pendientes se reenrollan para preservar la integridad de los datos.  
```C#
public static async Task SaveViewsAsync<TEntity, TUsername>(
    DbContext context,
    TUsername username,
    string tableKey,
    List<ViewDataModel> views
)
```

<br>

**_Parámetros de tipo_**  
| Nombre | Descripción |  
|-|-|  
| `TEntity` | El tipo de entidad que implementa `ITableViewEntity<TUsername>`. |  
| `TUsername` | El tipo de nombre de usuario utilizado para identificar al usuario. |  

<br>

**_Parámetros_**  
| Nombre | Tipo | Descripción |  
|-|-|-|  
| `context` | `DbContext` | El contexto de la base de datos utilizado para realizar operaciones de inserción, actualización y eliminación. |  
| `username` | `TUsername` | El nombre de usuario para el que se guardarán las vistas. |  
| `tableKey` | `string` | La clave identificando la configuración de la tabla relacionada con las opiniones. |  
| `views` | [`List<ViewDataModel>`](#749-viewdatamodel) | La lista de opiniones que deben guardarse o actualizarse. |  

<br><br><br>



---
<a id="8-frontend-component-reference"></a>
## 8 Referencia del componente frontend
Esta sección describe las utilidades de frontend proporcionadas por la biblioteca Angular `@eternalcodestudio/primeng-table`.

Incluye enums, interfaces, utilidades, servicios y componentes utilizados para configurar y renderizar la Tabla ECS PrimeNG en el frontend.

> [!NOTE]  
> Sólo **public exports and APIs intended for external use** are documented here. Los ayudantes internos, los métodos privados y los módulos internos no están cubiertos.

<br><br>



<a id="81-enums"></a>
### 8.1 Enumeraciones
<a id="811-celloverflowbehaviour"></a>
#### 8.1.1 CellOverflowBehaviour
**_Resumen_**  
Define cómo se muestra el contenido que desborda una celda de tabla.  
Especifica el comportamiento visual del contenido celular cuando excede el ancho de la celda.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Hidden` | 0 | El contenido de desbordamiento es recortado y no visible. |
| `Wrap` | 1 | El contenido se envuelve en múltiples líneas para encajar dentro de la celda. |

<br><br>


<a id="812-dataalignhorizontal"></a>
#### 8.1.2 DataAlignHorizontal
**_Resumen_**  
Define la alineación horizontal del contenido dentro de una celda de tabla.  
Especifica cómo el contenido dentro de una celda se coloca horizontalmente en relación con el ancho de la celda.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Left` | 0 | El contenido está alineado con el lado izquierdo de la celda. |
| `Center` | 1 | El contenido está alineado con el centro de la celda. |
| `Right` | 2 | El contenido está alineado con el lado derecho de la celda. |

<br><br>



<a id="813-dataalignvertical"></a>
#### 8.1.3 DataAlignVertical
**_Resumen_**  
Enum representando la alineación vertical del contenido dentro de una celda de tabla.  
Determina cómo el contenido dentro de una celda está posicionado verticalmente en relación con la altura de la celda.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Top` | 0 | Alinear el contenido a la parte superior de la celda. |
| `Middle` | 1 | Alinear el contenido al centro vertical de la celda. |
| `Bottom` | 2 | Alinear el contenido a la parte inferior de la celda. |

<br><br>



<a id="814-datatype"></a>
#### 8.1.4 DataType
**_Resumen_**  
Enum representando los diferentes tipos de datos que puede contener una columna de tabla.  
Se utiliza para determinar cómo los valores deben ser renderizados, formateados y filtrados en el componente de tabla.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Text` | 0 | Valores de cadena de texto simples. |
| `Numeric` | 1 | Valores numéricos, por ejemplo, enteros o decimales. |
| `Boolean` | 2 | Valores booleanos (true/false). |
| `Date` | 3 | Valores de fecha o fecha. |
| `List` | 4 | Lista de valores, almacenados como cadena separada por un delimitador (";"). |

<br><br>



<a id="815-frozencolumnalign"></a>
#### 8.1.5 FrozenColumnAlign
**_Resumen_**  
Enum representa la alineación de columnas fijas en una tabla.  
Se utiliza para determinar si una columna debe congelarse, y si es así, en qué lado de la tabla debe aparecer.

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `Noone` | 0 | La columna no está congelada. |
| `Left` | 1 | La columna está congelada en el lado izquierdo de la tabla. |
| `Right` | 2 | La columna está congelada en el lado derecho de la tabla. |

<br><br>



<a id="816-tableviewsavemode"></a>
#### 8.1.6 TableViewSaveMode
**_Resumen_**  
Representa el modo utilizado para guardar el estado o configuración de una vista de tabla.  
Determina dónde y cómo persisten los ajustes de vista de la tabla (como orden de columna, filtros y ordenación).

<br>

**_Valores_**
| Nombre | Valor | Descripción |
|-|-|-|
| `None` | 0 | Las vistas están desactivadas. |
| `SessionStorage` | 1 | Guardar el estado de la vista de la tabla en la sesión del navegadorStorage (clarado cuando la pestaña está cerrada). |
| `LocalStorage` | 2 | Guardar el estado de vista de la tabla en el almacenamiento local del navegador (persistes a través de sesiones). |
| `DatabaseStorage` | 3 | Guardar el estado de vista de la tabla en una base de datos de backend (requiere soporte del servidor). |

<br><br>


<a id="82-interfaces"></a>
### 8.2 Interfaces
<a id="821-icolumnmetadata"></a>
#### 8.2.1 IColumnMetadata
**_Resumen_**  
Representa los metadatos para una columna de tabla.  
Proporciona opciones de configuración para comportamiento de columna, apariencia e interacción de usuario dentro de la tabla ECS PrimeNG.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `canBeFiltered` | `boolean` | Determina si la columna puede ser filtrada. |
| `canBeGlobalFiltered` | `boolean` | Determina si la columna puede ser incluida en el filtrado global. |
| `canBeHidden` | `boolean` | Determina si la columna puede ser ocultada. |
| `canBeReordered` | `boolean` | Determina si la columna puede ser reordenada por el usuario. |
| `canBeResized` | `boolean` | Determina si la columna puede ser redimensionada por el usuario. |
| `cellOverflowBehaviour` | [`CellOverflowBehaviour`](#811-celloverflowbehaviour) | Especifica cómo se maneja el contenido desbordante dentro de la celda. |
| `cellOverflowBehaviourAllowUserEdit` | `boolean` | Indica si el comportamiento de desbordamiento celular puede ser modificado por el usuario. |
| `columnDescription` | `string` | Descripción o texto de información sobre herramientas para la columna. |
| `dataAlignHorizontal` | [`DataAlignHorizontal`](#812-dataalignhorizontal) | La alineación horizontal del contenido de la columna. |
| `dataAlignHorizontalAllowUserEdit` | `boolean` | Indica si la alineación horizontal puede ser modificada por el usuario. |
| `dataAlignVertical` | [`DataAlignVertical`](#813-dataalignvertical) | La alineación vertical del contenido de la columna. |
| `dataAlignVerticalAllowUserEdit` | `boolean` | Indica si la alineación vertical puede ser modificada por el usuario. |
| `dataTooltipCustomColumnSource` | `string` | Fuente personalizada para el contenido de la herramienta, si es aplicable. |
| `dataTooltipShow` | `boolean` | Determina si se debe mostrar un elemento de herramienta para los datos de la columna. |
| `dateCulture` | `string \| null` | La cultura opcional anula. |
| `dateFormat` | `string \| null` | El formato de fecha opcional anula esta columna. |
| `dateTimezone` | `string \| null` | Opcional de anulación de la zona temporal. |
| `dataType` | [`DataType`](#814-datatype) | El tipo de datos contenidos en la columna. |
| `exportDateFormat` | `string \| null` | Formato de fecha opcional para las exportaciones anular para esta columna. |
| `field` | `string` | La clave o identificador para el campo de datos de la columna. |
| `filterPredefinedValuesName` | `string` | Nombre de los valores de filtro predefinidos, si los hay. |
| `frozenColumnAlign` | [`FrozenColumnAlign`](#815-frozencolumnalign) | Alineación para columnas fijas (izquierda o derecha). |
| `header` | `string` | El nombre de la pantalla del encabezado de la columna. |
| `initialWidth` | `number` | Ancho inicial de la columna en píxeles. |
| `startHidden` | `boolean` | Determina si la columna debe ser ocultada inicialmente. |

<br><br>


<a id="822-ipredefinedfilter"></a>
#### 8.2.2 IPredefinedFilter
**_Resumen_**  
Representa un valor de filtro predefinido para una columna en **ECS PrimeNG table**.  
Permite mostrar un valor como texto, etiqueta, icono o imagen (de URL o Blob) con estilos y colores opcionales.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `action?` | `(rowData: any, option: IPredefinedFilter) => void` | Opcional. La acción para ejecutar cuando se haga clic en el filtro predefinido. `rowData` es el objeto de datos de fila, `option` es el filtro predefinido clicado. |
| `displayName?` | `boolean` | Se establece en `true` para mostrar el `name` como texto en la celda. |
| `displayTag?` | `boolean` | Establece `true` para mostrar `name` como una etiqueta en la celda. |
| `icon?` | `string` | El icono a mostrar para este valor. Puede utilizar iconos de PrimeNG, Font Awesome, Iconos Materiales, etc. |
| `iconColor?` | `string` | Color opcional para aplicar al icono. Ejemplo: `"red"` o `"#00ff00"`. |
| `iconStyle?` | `string` | Opcional cadena de estilo CSS para aplicar al icono. Ejemplo: `"font-size: 1.5rem; margin-right: 0.5rem"`. |
| `imageBlob?` | `Blob` | La imagen a mostrar desde un objeto Blob. |
| `imageBlobFetchError?` | `boolean` | **Internal.** Indica que buscar el Blob de `imageBlobSourceEndpoint` falló. **No modificar manualmente.** |
| `imageBlobSourceEndpoint?` | `string` | Si se utiliza un Blob y no se proporciona directamente, el punto final de backend para buscar el Blob de. |
| `imageHeight?` | `number` | Altura opcional de la imagen (y esqueleto) en píxeles. Si el valor es 0 o no definido, la altura no será aplicada. Si no se especifica ningún valor, se utilizará un valor predeterminado de 22px. |
| `imageURL?` | `string` | La imagen para mostrar directamente desde una URL. |
| `imageWidth?` | `number` | Ancho opcional de la imagen (y esqueleto) en píxeles. Si el valor es 0 o no definido, el ancho no será aplicado. |
| `name?` | `string` | El texto mostrado en el frontend para este valor de filtro. Se utiliza cuando `displayName` es `true` o cuando se muestra una etiqueta. |
| `nameStyle?` | `{ [key: string]: string }` | Opcional objeto de estilo CSS para aplicar al texto cuando `displayName` es `true`. Ejemplo: `{ color: 'blue', fontWeight: 'bold', fontStyle: 'italic' }` |
| `tagStyle?` | `{ [key: string]: string }` | Opcional objeto de estilo CSS para aplicar a la etiqueta. Ejemplo: `{ background: 'rgb(255,0,0)', color: 'white' }`. |
| `value` | `string \| number` | El valor subyacente de la celda. Debe coincidir con los datos de backend para el correcto filtrado. Para texto/tag, recomendado para que coincida con `name`. |

<br><br>



<a id="823-itablebutton"></a>
#### 8.2.3 ITableButton
**_Resumen_**  
Interfaz que representa un botón de acción de tabla, aplicable tanto para los botones de cabecera como de fila.

<br>

**_Propiedades_**
| Propiedad | Tipo | Descripción |
|-|-|-|
| `action?` | `(rowData: any) => void` | Opcional. La acción para ejecutar cuando se hace clic en el botón. `rowData` es los datos de filas pulsados, o null para botones de encabezado. |
| `class?` | `string` | Opcional. Clases adicionales de CSS para aplicar al botón. |
| `conditionFailHide?` | `boolean` | Opcional. Controla el comportamiento cuando `enabledCondition` vuelve falso. Si `true`, el botón será oculto; si `false` o `undefined`, seguirá siendo visible pero deshabilitado. Ignorado si `visibleCondition` vuelve falso. |
| `enabledCondition?` | `(rowData: any) => boolean` | Opcional. Determina si el botón debe ser habilitado para una fila determinada. Ignorado si `visibleCondition` vuelve falso. |
| `icon?` | `string` | Opcional. El icono a mostrar en el botón. Debe ser un nombre de icono válido de PrimeNG, Iconos Materiales, Awesome Font, o bibliotecas similares. |
| `iconPos?` | `string` | Opcional. La posición del icono relativa a la etiqueta de botón. Defaults to `"left"`. Valores posibles: `"left"`, `"right"`, `"top"`, `"bottom"`. |
| `label?` | `string` | Opcional. La etiqueta de texto mostrada en el botón. |
| `raised?` | `boolean` | Opcional. Si es cierto, añade una sombra para indicar la elevación. Defaults to false. |
| `rounded?` | `boolean` | Opcional. Si es verdad, el botón será redondo. Defaults to false. |
| `style?` | `string` | Opcional. Estilos adicionales en línea CSS para el botón. |
| `tooltip?` | `string` | Opcional. Texto de la herramienta para mostrar cuando el usuario salta sobre el botón. |
| `visibleCondition?` | `(rowData: any) => boolean` | Opcional. Determina si el botón debe ser visible para una fila dada. Relleno para botones de cabecera. |

<br><br>



<a id="824-itableoptions"></a>
#### 8.2.4 ITableOptions
**_Resumen_**  
Opciones de configuración para **ECS PrimeNG table**. Incluye configuraciones para activación de tablas, captura de datos, cabecera, columnas y filas.

<br>

**_Propiedades_**  
> [!NOTE]  
> Todas las propiedades tienen valores predeterminados, que se establecen automáticamente al utilizar la utilidad `createTableOptions`. Puede anular cualquiera de estos defectos especificando sus valores de opción de tabla personalizados.  

| Propiedad | Parent | Tipo | Default | Descripción |
|-|-|-|-|-|
| `statePersistence` | | `object` | `{ enabled: false }` | Opcional estado de consulta en memoria dentro de un ámbito de lista/detalle. Ver [4.19](#419-optional-state-when-returning-from-a-detail-page). |
| `enabled` | `statePersistence` | `boolean` | `false` | Guardar sobre la destrucción de tabla y restaurar sobre la inicialización en el mismo ámbito. |
| `key` | `statePersistence` | `string` | `undefined` | Única tabla/contexto clave dentro del ámbito. Se requiere cuando está habilitado, junto con un proveedor de componentes para `ECSPrimengTableStateService`. |
| `copyToClipboardTime` |  | `number` | `0.5` | Define el número de segundos que el usuario debe mantener el botón del ratón en una celda antes de que su contenido sea copiado al portapapeles. Se establece en un valor 0 para apagar completamente esta característica. |
| `columns` |  | `object` | N/A | Configuraciones relacionadas con las columnas de la tabla. |
| `selectorEnabled` | `columns` | `boolean` | `true` | Permite o desactiva la función de selector de columna. Cuando `true`, aparece un botón en la esquina superior izquierda, abriendo un modal que permite a los usuarios mostrar/hierro columnas, ajustar el comportamiento de desbordamiento celular y cambiar la alineación horizontal/vertical por columna. Cuando `false`, el botón selector no está disponible. |
| `selectorIcon` | `columns` | `string` | `"pi pi-pen-to-square"` | Icono utilizado para el botón selector de columna. Puede ser reemplazado por cualquier PrimeNG, Font Awesome o Material Icon. |
| `selectorOrderByColumnName` | `columns` | `boolean` | `true` | Cuando `true`, las columnas del selector se muestran alfabéticamente (A–Z). Cuando `false`, las columnas mantienen el orden proporcionado por el backend. |
| `shown` | `columns` | `IColumnMetadata[]` | `[]` | Matriz de columnas que deben mostrarse en la tabla, incluidas las no seleccionables y las seleccionadas por el usuario. |
| `columnDescriptionIcon` |  | `string` | `"pi pi-info-circle"` | Define el icono mostrado en el encabezado de la columna cuando una descripción está presente. Si no se especifica, se utilizará el icono de información predeterminado. |
| `data` |  | `any[]` | `[]` | El conjunto de datos que se mostrará en la tabla. Cada artículo debe representar una fila y coincidir con la estructura de la columna de la tabla. |
| `description` |  | `object` | N/A | Opciones de configuración para la sección de descripción de la tabla. |
| `icon` | `description` | `string` | `"pi pi-info-circle"` | Icon mostrado junto a la descripción de la tabla. Puede utilizar cualquier clase de PrimeIcons o iconos de bibliotecas de terceros, como Iconos Materiales o Iconos de Fuente. |
| `text` | `description` | `string` | `undefined` | El contenido de descripción a mostrar. Si se deja sin definir o sin cadena, la descripción de la tabla no se mostrará. Soporta HTML básico para formato de texto rico. |
| `tooltip` | `description` | `boolean` | `true` | Determina cómo se muestra el texto de la descripción. `true`, el contenido `text` se muestra como un elemento de herramientas cuando se desplaza sobre el icono de descripción. `false`, el `text` se muestra en línea a la derecha del icono. |
| `excelReport` |  | `object` | N/A | Configuraciones para exportar los datos de la tabla a Excel. |
| `defaultTitle` | `excelReport` | `string` | `"Report"` | Título predeterminado mostrado en el Excel export modal al preparar la exportación. Si está vacío y `titleAllowUserEdit` es `false`, el botón de exportación está deshabilitado. |
| `titleAllowUserEdit` | `excelReport` | `boolean` | `true` | Determina si el usuario puede editar el título del archivo Excel en el modal de exportación. Si `true`, editable; si `false`, el título se fija a `defaultTitle`. |
| `url` | `excelReport` | `string` | `undefined` | URL de Endpoint de la API para realizar la exportación de Excel. Si no está definido, la funcionalidad de exportación de Excel está deshabilitada. |
| `globalFilter` |  | `object` | N/A | Configuraciones relacionadas con la funcionalidad de filtro global de la tabla. |
| `enabled` | `globalFilter` | `boolean` | `true` | Permite o desactiva la entrada de filtro global. Si `true`, los usuarios pueden buscar en todas las columnas; si `false`, la entrada de búsqueda global no se renderiza. |
| `maxLength` | `globalFilter` | `number` | `20` | Número máximo de caracteres permitidos en la entrada de filtro global, para limitar la longitud de búsqueda. |
| `header` |  | `object` | N/A | Configuraciones relacionadas con opciones que están en el encabezado de la tabla. |
| `buttons` | `header` | `ITableButton[]` | `[]` | Una colección de botones que se mostrará en el encabezado de la tabla. |
| `clearFiltersEnabled` | `header` | `boolean` | `true` | Cuando `false`, el botón de filtros despejado será oculto. |
| `clearFiltersIcon` | `header` | `string` | `"pi pi-filter-slash"` | Permite personalizar el icono de botón de filtros claros. |
| `clearSortsEnabled` | `header` | `boolean` | `true` | Cuando `false`, el botón de orden claro estará oculto. |
| `clearSortsIcon` | `header` | `string` | `"pi pi-sort-alt-slash"` | Permite la personalización del icono de botón de tipo claro. |
| `isActive` |  | `boolean` | `true` | Controla si la tabla está activa. Cuando `true`, la configuración de cuadros, columnas y datos sobre el init. Cuando `false`, no busca automáticamente ni actualiza datos, permitiendo manipulaciones manuales sin activar actualizaciones. |
| `legend` |  | `object` | N/A | Opciones de configuración para la leyenda de la tabla. |
| `button` | `legend` | `ITableButton` | `{ icon: "pi pi-bars", label: "Legend" }` | Opciones de configuración para el botón de leyenda. |
| `content` | `legend` | `string` | `undefined` | El contenido que se mostrará en la popover de la leyenda. Puede ser rico en HTML. |
| `predefinedFilters` |  | `{ [key: string]: IPredefinedFilter[] }` | `{}` | Filtros predefinidos para columnas de tabla. Restringe las opciones de filtro a un conjunto conocido de valores por columna, adecuado para columnas con valores diferenciados limitados. Soporta texto plano, etiquetas, iconos e imágenes, y trabaja con tipos de datos `list`. |
| `resetTableView` |  | `object` | N/A | Configuraciones relacionadas con el botón de vista de tabla de reajuste. |
| `enabled` | `resetTableView` | `boolean` | `true` | Si el botón de vista de la tabla de reinicio debe ser habilitado. |
| `icon` | `resetTableView` | `string` | `"pi pi-eraser"` | Se puede utilizar para especificar un icono diferente para ser utilizado por el botón de vista de tabla de reset. Puede reemplazarlo con cualquier icono de PrimeNG u otras bibliotecas como Font Awesome o Material Icons. |
| `rows` |  | `object` | N/A | Configuraciones relacionadas con las filas de la tabla. |
| `action` | `rows` | `object` | N/A | Configuraciones relacionadas con la columna de acción para las filas. |
| `buttons` | `rows` = confianza `action` | `ITableButton[]` | `[]` | Colección de `ITableButton` que se mostrará en la columna de acciones de fila. Al menos un botón debe definirse para habilitar la columna. |
| `frozen` | `rows` = confianza `action` | `boolean` | `true` | Si `true`, la columna permanece visible cuando desplaza horizontalmente la tabla. |
| `header` | `rows` = confianza `action` | `string` | `"Actions"` | La etiqueta de cabecera de la columna de acciones de fila. |
| `horizontalAlignment` | `rows` = confianza `action` | `DataAlignHorizontal` | `DataAlignHorizontal.Center` | Cómo los elementos dentro de la columna de acción están alineados horizontalmente. |
| `positionRight` | `rows` = confianza `action` | `boolean` | `true` | Si `true`, la columna aparecerá en el lado derecho de la tabla; de lo contrario, aparecerá a la izquierda. |
| `resizable` | `rows` = confianza `action` | `boolean` | `false` | Si `true`, los usuarios pueden cambiar el tamaño de la columna. |
| `verticalAlignment` | `rows` = confianza `action` | `DataAlignVertical` | `DataAlignVertical.Middle` | Cómo los elementos dentro de la columna de acción están alineados verticalmente. |
| `width` | `rows` = confianza `action` | `number` | `150` | El ancho de la columna fija en píxeles. |
| `checkboxSelector` | `rows` | `object` | N/A | Configuraciones relacionadas con el selector de la casilla de verificación de filas. |
| `enabled` | `rows` = confianza `checkboxSelector` | `boolean` | `false` | Si `true`, se mostrará una nueva columna con casillas de verificación. Los usuarios pueden seleccionar / seleccionar filas, y se habilitará una opción para filtrar por esta columna. |
| `enabledCondition` | `rows` = confianza `checkboxSelector` | `(rowData: any) => boolean` | `undefined` | Función que determina si la casilla de verificación debe ser habilitada para una fila determinada. |
| `frozen` | `rows` = confianza `checkboxSelector` | `boolean` | `true` | Si `true`, la columna permanece visible cuando desplaza horizontalmente la tabla. |
| `header` | `rows` = confianza `checkboxSelector` | `string` | `"Selected"` | La etiqueta del encabezado para la columna de selección de la casilla de verificación. |
| `horizontalAlignment` | `rows` = confianza `action` | `DataAlignHorizontal` | `DataAlignHorizontal.Center` | Cómo la casilla de verificación dentro de la columna selectora está alineada horizontalmente. |
| `positionRight` | `rows` = confianza `checkboxSelector` | `boolean` | `false` | Si `true`, la columna aparecerá en el lado derecho de la tabla. De lo contrario, aparecerá a la izquierda. |
| `resizable` | `rows` = confianza `checkboxSelector` | `boolean` | `false` | Si `true`, los usuarios pueden cambiar el tamaño de la columna. |
| `verticalAlignment` | `rows` = confianza `action` | `DataAlignVertical` | `DataAlignVertical.Middle` | Cómo la casilla de verificación dentro de la columna selectora está alineada verticalmente. |
| `width` | `rows` = confianza `checkboxSelector` | `number` | `150` | El ancho de la columna fija en píxeles. |
| `class` | `rows` | `(rowData: any) => string \| string[] \| Set<string> \| { [klass: string]: any }` | N/A | Función para asignar dinámicamente clases CSS a una fila basada en sus datos. Devuelve una cadena, array, Set o objeto de nombres de clase que se aplican además de estilos predeterminados. Útil para destacar o estilizar filas condicionalmente. |
| `singleSelector` | `rows` | `object` | N/A | Configuraciones relacionadas con el selector de filas individuales. |
| `enabled` | `rows` = confianza `singleSelector` | `boolean` | `false` | Si se establece en `true`, los usuarios pueden hacer clic en una fila para seleccionarla. Luego puede suscribirse a eventos de selección para ejecutar acciones personalizadas. |
| `metakey` | `rows` = confianza `singleSelector` | `boolean` | `true` | Cuando `true`, los usuarios deben mantener **CTRL** y hacer clic en una fila seleccionada para deseleccionarla. Cuando `false`, los usuarios pueden unseleccionar una fila simplemente haciendo clic en ella de nuevo. En dispositivos móviles, **CTRL** es ignorado, los usuarios pueden desactivar filas simplemente haciendo clic en ellos. |
| `style` | `rows` | `(rowData: any) => { [property: string]: any }` | N/A | Función para asignar dinámicamente estilos de línea a una fila. Recibe el objeto `rowData` y devuelve un objeto con propiedades CSS para aplicar inline. Permite que las filas de estilo se basen dinámicamente en su contenido o valores. Si no se proporciona, no se aplican estilos dinámicos. |
| `urlTableConfiguration` |  | `string` | `undefined` | URL de punto final para buscar la configuración de la tabla. Se captura **once** cuando la tabla inicializa y debe devolver un objeto `ITableConfiguration` que contiene definiciones de columna, zona horaria y otros ajustes. Si se establece en `undefined` o si `isActive` es `false`, la tabla no buscará la configuración automáticamente. |
| `urlTableData` |  | `string` | `undefined` | URL de punto final para buscar los datos de la tabla. Este endpoint se llama **cuando el usuario filtra, paginates, o clasifica** la tabla. Debe devolver un objeto `ITablePagedResponse` que contenga los datos paginados. Si se establece en `undefined` o si `isActive` es `false`, la tabla no buscará ni actualizará los datos automáticamente. |
| `verticalScroll` | | `object` | N/A | Configuraciones relacionadas con el pergamino vertical de la tabla. |
| `cssFormula` | `verticalScroll` | `string` | `undefined` | Una cadena CSS utilizada para definir la altura vertical de la tabla. Puede ser un valor fijo (por ejemplo, `"500px"`) o una fórmula CSS (por ejemplo, `"calc(100vh - 200px)"`). Cuando se proporciona, este valor **overrides** tanto `fitToContainer` como `height`. |
| `fitToContainer` | `verticalScroll` | `boolean` | `true` | Ajuste automáticamente la altura de la tabla para adaptarse a su contenedor. Cuando `true`, la tabla calcula dinámicamente su altura máxima. Ignorado si se proporciona un `cssFormula`. |
| `height` | `verticalScroll` | `number` | `0` | Altura vertical fija para la tabla cuando `fitToContainer` es `false`. Ignorado si se proporciona un `cssFormula` o si `fitToContainer` es `true`. Permite el desplazamiento vertical con una altura fija cuando no se desea un ajuste dinámico. |
| `views` | | `object` | N/A | Configuraciones relacionadas con las vistas de tabla guardadas. |
| `noViewSelectedText` | `views` | `string` | `"--- Select a view ---"` | El texto que se muestra cuando no se selecciona la vista. |
| `reloadViewButtonClass` | `views` | `string` | `undefined` | Clases CSS para aplicar al botón utilizado para volver a aplicar una vista. Se pueden proporcionar múltiples clases como una cadena separada del espacio. |
| `reloadViewButtonIcon` | `views` | `string` | `"pi pi-refresh"` | El icono que tiene el botón de vista de la aplicación. |
| `saveKey` | `views` | `string` | `undefined` | Clave utilizada para identificar la tabla al guardar y recuperar sus puntos de vista. Cada tabla debe tener una clave única para evitar conflictos entre tablas. Si `undefined`, la tabla no guardará ni cargará ninguna vista. |
| `saveMode` | `views` | `TableViewSaveMode` | `TableViewSaveMode.None` | Determina cómo se guardan las vistas de la tabla. Opciones: `None` (sin guardar), `SessionStorage` (aclarado cuando la pestaña cierra), `LocalStorage` (persistente), o `DatabaseStorage` (ahorrado a través de backend utilizando `urlGet` y `urlSave`). |
| `selectViewButtonClass` | `views` | `string` | `undefined` | Una colección de clases personalizadas de CSS para aplicar al botón que abre el menú de vistas. Se pueden proporcionar múltiples clases como una cadena separada del espacio. |
| `urlGet` | `views` | `string` | `undefined` | URL de Endpoint para obtener vistas guardadas de la base de datos. Sólo se utiliza si `saveMode` es `TableViewSaveMode.DatabaseStorage`. El `saveKey` se envía para identificar las opiniones correctas de la tabla. |
| `urlSave` | `views` | `string` | `undefined` | URL de Endpoint para guardar las vistas de la tabla a la base de datos. Sólo se utiliza si `saveMode` es `TableViewSaveMode.DatabaseStorage`. El `saveKey` se envía para identificar las opiniones correctas de la tabla. |

<br><br><br>



---
<a id="9-editing-ecs-primeng-table-and-integrating-locally"></a>
## 9 Edición de ECS PrimeNG Table e integración local
WIP


## 10 Menús adaptables y visibilidad inicial de columnas

Todas las funciones nuevas son opcionales. Sin configurar estas opciones, las aplicaciones conservan sus botones de cabecera, botones de fila y visibilidad de columnas actuales. Las categorías se basan en el **ancho de la ventana del navegador en píxeles CSS**, no en el dispositivo físico.

### Opciones del frontend

```ts
tableOptions = createTableOptions({
  responsive: {
    headerMenu: true,
    rowMenu: true,
    tabletMinWidth: 768,
    desktopMinWidth: 1200,
    headerMenuLabel: 'Acciones de la tabla',
    rowMenuLabel: 'Acciones de la fila'
  }
  // Conserva tus endpoints y las demás opciones existentes.
});
```

| Opción | Valor predeterminado | Función |
|---|---|---|
| `headerMenu` | `false` | En Mobile/Tablet, agrupa las acciones de cabecera en un menú de hamburguesa a la derecha. La búsqueda global permanece visible. |
| `rowMenu` | `false` | En Mobile/Tablet, agrupa las acciones de fila en un menú de tres puntos verticales. La columna de acciones ocupa 56 px y recupera su ancho configurado en Desktop. |
| `tabletMinWidth` | `768` | Ancho mínimo de Tablet, incluido. |
| `desktopMinWidth` | `1200` | Ancho mínimo de Desktop, incluido. |
| `headerMenuLabel` | `'Table actions'` | Nombre accesible del botón de menú de cabecera. |
| `rowMenuLabel` | `'Row actions'` | Nombre accesible de cada botón de menú de fila. |

Con los valores predeterminados, Mobile corresponde a menos de 768 px, Tablet a 768–1199 px y Desktop comienza en 1200 px. Los anchos personalizados deben ser finitos y cumplir `0 < tabletMinWidth < desktopMinWidth`; de lo contrario, se produce un error de configuración. Usa los mismos puntos de corte en todos los grids si quieres que clasifiquen la ventana de igual forma.

Los dos menús se activan por separado. Las acciones incorporadas y personalizadas mantienen sus condiciones de visibilidad, activación y sus funciones. Las opciones personalizadas utilizan `label`, después `tooltip` y, como último recurso, `Action N`. Proporciona una etiqueta o tooltip descriptivo a los botones que solo tienen icono. Las acciones de fila reciben la fila correspondiente y las de cabecera reciben `null`. Los menús se añaden a `body` para evitar recortes y admiten navegación por teclado y cierre con Escape.

### DTO del backend

```csharp
using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;

[ColumnAttributes("Email",
    VisibleOnlyIn = new[] { DeviceType.Desktop, DeviceType.Tablet })]
public string Email { get; set; } = string.Empty;

[ColumnAttributes("Internal notes",
    VisibleOnlyIn = new[] { DeviceType.Desktop })]
public string Notes { get; set; } = string.Empty;
```

`VisibleOnlyIn` es una propiedad opcional con nombre: no cambia la firma del constructor existente. Admite uno, dos o los tres valores. El frontend y el backend exponen `DeviceType` con `Mobile = 0`, `Tablet = 1` y `Desktop = 2`. El campo enviado es `visibleOnlyIn`; System.Text.Json lo omite cuando es nulo con la configuración predeterminada. El frontend actualizado también admite APIs antiguas sin ese campo. La visibilidad de columnas funciona independientemente de los menús.

Prioridad de las reglas:

1. `CanBeHidden = false` mantiene las columnas obligatorias visibles en todos los tamaños.
2. `StartHidden = true` mantiene inicialmente ocultas las columnas seleccionables, respetando el comportamiento existente.
3. Si `VisibleOnlyIn` no se define, es nulo o contiene un array vacío, no añade restricciones.
4. En los demás casos, la columna comienza visible solo en las categorías indicadas.

Las columnas ocultas siguen disponibles en el selector. Es un valor inicial de presentación, no una regla de autorización. Una vista guardada o una elección explícita en el selector tiene prioridad sobre los valores responsive. Sin personalización, al cruzar un punto de corte se recalculan las columnas y se solicitan los campos visibles conservando filtros, ordenación y paginación. Con personalización, el cambio de tamaño solo adapta los menús. Restablecer la tabla recupera los valores iniciales del tamaño actual.

La distribución de columnas sigue gestionándose mediante vistas guardadas; la conservación del estado durante la navegación continúa almacenando solo la consulta. Las sobrescrituras dinámicas admiten `ColumnMetadataOverrideModel.VisibleOnlyIn`; usa un array vacío para quitar la restricción. No hace falta modificar la base de datos.

### Demo y comprobaciones

La demo de `home` activa explícitamente ambos menús; la biblioteca los mantiene desactivados por defecto. Utiliza el ejemplo de DTO anterior para configurar columnas individuales.

Desde `Frontend/ECSPrimengTable`, ejecuta `npm run test:responsive` y `npm run test:state`. Desde la raíz del repositorio, las comprobaciones del backend no requieren SQL:

```sh
dotnet run --project Backend/ECS.PrimengTable.ResponsiveTests -p:GeneratePackageOnBuild=false
```

La prueba opcional `tests/responsive.browser.mjs` usa Playwright y respuestas de prueba interceptadas, sin SQL. Compila la biblioteca y la demo (`ng build ECSPrimengTable --configuration development`) y ejecuta `node tests/responsive.browser.mjs` con Playwright disponible. Puedes indicar instalaciones existentes mediante `PLAYWRIGHT_MODULE` y `BROWSER_EXECUTABLE`.
