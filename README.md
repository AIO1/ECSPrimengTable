[![NuGet Version](https://img.shields.io/nuget/v/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)

[![npm version](https://img.shields.io/npm/v/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
[![npm downloads](https://img.shields.io/npm/dm/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
# ECS PrimeNG Table
A solution created by Alex Ibrahim Ojea that enhances the PrimeNG table with advanced filters and extended functionality, delegating all query and filtering logic to the database engine. The frontend is built with Angular 20 and PrimeNG 20 components, while the backend is a .NET 8 (ASP.NET) API connected to Microsoft SQL Server, easily adaptable to other databases. This approach prevents server and frontend overload by handling filtering and paging dynamically in the database, and includes features such as column visibility, column filters, custom views, and more.

<br><br><br>



## Introduction
Hello! My name is Alex Ibrahim Ojea.

This project was created to provide an efficient and reusable PrimeNG table solution for Angular applications. Unlike the default PrimeNG approach, which requires loading all data into the frontend, this implementation delegates filtering, sorting, and pagination logic directly to the database engine, making it highly performant on large datasets.

The goal is to make it simple to integrate a powerful, flexible, and good-looking table into your applications without overloading either the frontend or the server.

Some of the key features included are:
- Dynamic pagination with lazy loading
- Multi-column sorting
- Advanced and predefined filters
- Global search
- Column resizing, reordering, toggling, and descriptions
- Customizable cells (alignment, overflow, tooltips, ...)
- Conditional row styling
- Table views for saving configurations
- And much more!

This is an example of the final solution:
<p align="center">
    <img width="1899" height="978" alt="Example table" src="https://github.com/user-attachments/assets/d7bc4183-6895-4166-afa7-a2cd64d2abdd" />
</p>

<br><br><br>



## 1 Required software
To run this project, you will need:
- [Visual Studio Code](https://code.visualstudio.com/Download) – for frontend development.
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) – for backend API development with ASP.NET Core. Make sure to install the **ASP.NET workload** and **.NET 8 framework**.
- [Node.js](https://nodejs.org/en/download/package-manager) – to run the Angular application. Managing Node versions with [NVM](https://github.com/nvm-sh/nvm) is recommended.
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) – the database engine used for queries. Optional, can be replaced with other engines with minor code adjustments.
- (Optional) [DBeaver](https://dbeaver.io/download/) – A GUI for database management that works with multiple engines. You can use other tools, but this is the one I normally use.

<br><br><br>



---
## 2 Setup the environment to try the demo



### 2.1 Database (MSSQL)
This example has been set up using **MSSQL**. Other database engines should work with some modifications, but this guide only covers MSSQL.
First, create a new database named `primengtablereusablecomponent`. The database should have a schema named `dbo`. You can use a different database or schema name, but you will need to adapt the backend and database scripts accordingly.
Once the database and schema are ready, download all the database scripts located under [this path](Database%20scripts). Execute the scripts in order (starting with `00`):
- <ins>**00 Create EmploymentStatusCategories.sql**</ins>: Creates the table `EmploymentStatusCategories`, which contains all possible employment categories used in the predefined filter example.
- <ins>**01 Populate EmploymentStatusCategories.sql**</ins>: Inserts initial records into the `EmploymentStatusCategories` table.
- <ins>**02 Create TestTable.sql**</ins>: Creates the table used for testing, containing the main data displayed in the frontend.
- <ins>**03 Populate TestTable.sql**</ins>: Inserts sample data into `TestTable`. This script can be slightly modified to generate different random data.
- <ins>**04 FormatDateWithCulture.sql**</ins> (optional): Creates a database function used by the backend to allow global search on date columns, formatting them as text with the same mask, timezone, and locale as in the frontend.
- <ins>**05 SaveTableViews.sql**</ins>: Creates an example table to store user-defined table views. This is only needed if you are using the database to save views instead of browser or session storage.

After executing all scripts successfully, you should have:  
- Two populated tables (`EmploymentStatusCategories` and `TestTable`).
- One empty table (`TableViews`).
- One function (`FormatDateWithCulture`).

The following image shows the ER diagram of all the tables:
<p align="center">
    <img width="1132" height="526" alt="ER diagram of example project" src="https://github.com/user-attachments/assets/63762420-6204-4b10-8486-987ec8ca95eb" />
</p>

<br><br>



### 2.2 Backend (API in ASP.NET)
> [!NOTE]  
> You can use other .NET versions with the corresponding packages. The solution should still work without issues.



#### 2.2.1 Open the project
Using **Visual Studio 2022**, open the backend solution located in [this path](Backend). Make sure the **ASP.NET workload** and **.NET 8 framework** are installed. If any component is missing, use the **Visual Studio Installer** to add it.

<br><br>



#### 2.2.2 Update the database connection string
> [!NOTE]  
> If you followed the default MSSQL installation and configured the database as `primengtablereusablecomponent` with a schema named `dbo` and no authentication, you can skip this step. Otherwise, follow these instructions carefully to avoid connection issues.

Next, update the database configuration for your backend API. Open the [appsettings.Development.json](Backend/ECSPrimengTableExample/appsettings.Development.json) file and ensure that the connection string under `"DB_primengtablereusablecomponent"` matches your setup.
If you change the identifier name of the connection string in `appsettings.json`, remember to update it accordingly in [Program.cs](Backend/ECSPrimengTableExample/Program.cs).

<br><br>



#### 2.2.3 Scaffolding the database
> [!NOTE]  
> This step is optional and only needed if you modify the database structure, want to generate the `DbContext` or models in a different location, or plan to use a database engine other than MSSQL.

To perform scaffolding, open the **Package Manager Console** in Visual Studio and navigate (`cd`) to the root folder of the project (where the `.sln` file is located).
Once in the project folder, run the following command (assuming your database is named `primengtablereusablecomponent`, you are using SQL Server, and you want to place the `DbContext` and models in the same locations as in the example code):
```sh
dotnet ef dbcontext scaffold name=DB_primengtablereusablecomponent Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --context-dir DBContext --namespace Models.PrimengTableReusableComponent --context-namespace Data.PrimengTableReusableComponent --context primengTableReusableComponentContext -f --no-onconfiguring
```

These are the common changes you may need to make in the command:
- `name=DB_primengtablereusablecomponent`: Change only if you modified the connection string name in `appsettings.Development.json`.
- `Microsoft.EntityFrameworkCore.SqlServer`: Change this to the appropriate provider package if you are using a different database engine.
- `--output-dir`: Specifies where the models will be generated. In this example, they will be generated in the `Models` folder (created automatically if it does not exist).
- `--context-dir`: Specifies where the `DbContext` will be generated. Here it will be created in a folder named `DBContext` (created automatically if it does not exist).
- `--namespace` and `--context-namespace`: Set the namespaces for the models and the `DbContext`, respectively.
- `--context`: Sets the name of the `DbContext`. In this example, it will be `primengTableReusableComponentContext`.
- `-f`: Forces overwriting existing files.
- `--no-onconfiguring`: Tells the scaffolding process not to configure the connection in the `DbContext`. In this example, the connection is managed through the `appsettings.Development.json` file.

<br><br>



#### 2.2.4 API first run
After completing the previous steps, you should now be able to run the API and verify that everything works before moving to the frontend. In Visual Studio 2022, click the green **Play** button on the top bar. The API will start, and after a few moments, a webpage should appear.
If everything is working correctly, you should see the **Swagger-generated API documentation** with some test endpoints. Below, there is a **Schemas** section showing all schemas detected by Swagger during documentation generation.
To test that the API endpoints and database communication are working, perform a quick test with the `Main/GetEmploymentStatus` GET method (it is easy to test and requires no parameters):
1. Click **Try out** under the method.
2. Click **Execute**.
Upon execution, you should receive a **200 response** with a body similar to the following:
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
If you see these results, it means your API is running correctly and communicating with the database, as these GET endpoints retrieve data directly from it.
Take note of the **port number** in the API URL, as it will be needed later to configure the frontend.

<br><br>



### 2.3 Frontend (Angular project using PrimeNG components)
> [!NOTE]  
> You can use other Angular and PrimeNG versions by updating the corresponding `package.json` dependencies. The solution should still work, but be aware that PrimeNG could introduce breaking style changes that may affect the component's appearance or behavior.

This section assumes you have completed the previous steps to set up the database and API.
Before proceeding, ensure that **Node.js** is installed (via the `.msi` or `.exe` installer, or using **NVM**), as it is required to run the frontend application locally.

To run the frontend demo, open the [frontend folder](Frontend/ECSPrimengTable) in **Visual Studio Code**. Make sure your API is running on the expected port (as noted in the previous steps).

To confirm that the frontend points to the correct API endpoint, open [constants.ts](Frontend/ECSPrimengTable/src/constants.ts) and check the function `getApiBaseUrl`. In development mode, it should return something like:
```ts
"https://localhost:7020/"
```
Ensure that the port matches your API. If it differs, update the value and save the file.

> [!IMPORTANT]  
> Always verify that `getApiBaseUrl` points to the correct API port before continuing with this section.

From within **Visual Studio Code**, open a new terminal (make sure it is using **CMD** and not PowerShell or another shell) and navigate to the [root folder of the frontend project](Frontend/ECSPrimengTable) using the `cd` command. Once in the correct folder, run the following command:
```sh
npm install
```
> [!TIP]  
> You can add the `--verbose` flag at the end (`npm install --verbose`) to get more detailed output during the installation process.

This command will download all required dependencies for the frontend project. Once it has finished executing and if everything went OK, ensure your API is running correctly, then execute the following command in the terminal:
```sh
ng build ecs-primeng-table
```
This command will use **ng-packagr** to build a local package in the `dist` folder, based on the contents of `projects\ecs-primeng-table` (the reusable table component).  

Once the package has been successfully built, you can start the web application by running the following command in the terminal:

```sh
ng serve -o
```
> [!TIP]  
> `ng serve` without the `-o` flag also works, but it won't open a browser tab automatically. You will need to navigate manually to the URL where the webpage is served.

After a few seconds, a new tab in your web browser should open, displaying the table fully functional.

If you have reached this step, congratulations! You have successfully set up and started the demo project! :smile:

<br><br><br>



---
## 3 Integrating into a project
This section provides a step-by-step guide on how to integrate the **ECS PrimeNG Table** into either a new or an existing project.



### 3.1 Backend requirements
> [!NOTE]  
> The **ECS PrimeNG Table** package is built for .NET 8, but it should also work seamlessly with newer .NET versions.

If you are already working on a **.NET 8 project (or higher)**, you will need to install the backend compiled package from NuGet (downloading the latest version is recommended.):  
[ECS.PrimeNGTable on NuGet](https://www.nuget.org/packages/ECS.PrimeNGTable)

In addition, make sure the following required dependencies are installed:
- **ClosedXML** (>= 0.104.0)
- **LinqKit** (>= 1.3.0)
- **Microsoft.EntityFrameworkCore** (>= 8.0.0)
- **System.Linq.Dynamic.Core** (>= 1.6.0)

> [!TIP]
> You can always check the latest dependency versions by visiting:  
`https://www.nuget.org/packages/ECS.PrimeNGTable/<version>#dependencies-body-tab`  
(Replace `<version>` with the specific package version you are downloading, e.g., `8.0.1`).

With these dependencies in place and the package installed, your backend is ready to use the **ECS PrimeNG Table**.

<br><br>



### 3.2 Frontend requirements



#### 3.2.1 Installing the package and peer dependencies
> [!NOTE]  
> The **ECS PrimeNG Table** package is built for Angular 20 with PrimeNG 20 components. While it may work with newer versions, compatibility is not guaranteed, as PrimeNG frequently introduces breaking changes to its components.

If you are already working on an **Angular 20** project, you can check the frontend compiled package on NPM here:  
[@eternalcodestudio/primeng-table on NPM](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)

To install the package, open a terminal in the root folder of your project and run the following command (downloading the latest version is recommended.):

```sh
npm install @eternalcodestudio/primeng-table
```

In addition, make sure the following required dependencies are installed in your project:
- **@angular/common** (>=20.0.0)
- **@angular/core** (>=20.0.0)
- **@angular/animations** (>=20.0.0)
- **primeng** (>=20.0.0)
- **primeicons** (>=7.0.0)

> [!CAUTION]  
> These are **peer dependencies** and are **not installed automatically**. If your project doesn't already include them, you must install them separately using NPM.

<br><br>



#### 3.2.2 Configure Angular locales
The **ECS PrimeNG Table** component relies on Angular's **DatePipe** to render date cells.  
To ensure correct formatting, you must import and register the locale(s) you plan to use in your application.

Example for English locale (`en`):
```ts
import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);
```
Remeber to include also `DatePipe` in your `providers`.

This step is required before using the table. If the locale is not correctly registered, rendering date cells may fail and prevent the table from displaying properly.  

You can include this configuration at the global level (e.g., `app.module.ts` or `app.config.ts`) or at a more local level, depending on your application structure.

<br><br>



#### 3.2.3 Required services for ECS PrimeNG Table
The **ECS PrimeNG Table** package defines two abstract services that you need to implement in your project:
- **ECSPrimengTableHttpService**: handles HTTP requests for the table (GET and POST).
- **ECSPrimengTableNotificationService**: handles notifications (toasts) for the table.

These services are abstract, meaning the package does not know how you want to handle HTTP requests or notifications in your project. You need to create your own implementations.

<br><br>



###### Example: HTTP service
In your project, create a class that extends `ECSPrimengTableHttpService` and implements its abstract methods.  

In this example, the implementation uses the main services provided by `SharedService`.
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



###### Example: Notification service
Similarly, you need to create a class that extends `ECSPrimengTableNotificationService` and implements its abstract methods.

In this example, the implementation relies on the main services provided by `SharedService`.
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



###### Registering the services
Finally, register your implementations in your dependency injection system (for example, in `app.config.ts`):
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
This tells the **ECS PrimeNG table** package to use your custom services for handling HTTP requests and notifications.

<br><br><br>



---
## 4 Functional overview
The goal of this section is to provide a **user-level overview** of all the features included in the **ECS PrimeNG table**. It allows you to quickly understand what the table can offer and how these functionalities can be utilized in your projects. This section provides a clear, at a glance view of everything available without diving into code.

<br><br>



### 4.1 Planning your table
Before diving into advanced features, it’s essential to start with the basics and carefully plan your table design. This will ensure that the table fits your users needs and your application’s requirements. Use the following questions as a guide:

**Columns**
- Which columns do I want to include in the table?
- Should all columns be visible by default, or will some be hidden initially?
- Are there columns that must always remain visible and cannot be hidden?
- What horizontal and vertical alignment should each column have?
- How should content overflow be handled in each column (e.g., wrap, truncate)?
- Which columns should allow sorting: all, some, or none?
- Which columns should allow filtering: all, some, or none?
- Can users change the position of columns via drag-and-drop?
- Are any columns going to be frozen (fixed) on the left or right side?

**Rows**
- Do any rows need conditional formatting based on the values of a specific column?
- What actions should I allow per row? Are action buttons enabled or disabled based on certain conditions?
- Can rows be selected (and an action performed on select)?
- Can users select multiple rows, filter by selected rows, or perform actions on multiple selections (row checkbox selector)?

**Global table features**
- Are there any table-level actions needed, such as creating records?
- How will dates be displayed in the table?
- Will users be able to customize the date format?
- Will a global filter be available for the table?
- Should the table support exporting data to Excel?
- Will users be able to save their table configuration? If so, should it be persistent across sessions or only for the current session?

Don’t worry if some of these concepts are unclear at this point, each feature will be explained individually in detail in the following sections.

> [!NOTE]  
> This solution works only to data that is already persisted in the database.
> It is **not intended** to handle data currently being edited in memory on the frontend and not yet saved to the database.

<br><br>



### 4.2 Date formatting
At first glance, date formatting might seem simple, but it can easily confuse end users if not carefully considered from the start.

The **ECS PrimeNG table** component allows you to control how dates are displayed in each table, letting you customize:
- **Format**: This defines how the date and time will be displayed to the user.  
  For example, `"dd-MMM-yyyy HH:mm:ss zzzz"` means:
  - `dd` → day of the month (01-31).
  - `MMM` → short name of the month (Jan, Feb, etc.).
  - `yyyy` → full year (2025).
  - `HH:mm:ss` → hours, minutes, and seconds in 24-hour format.
  - `zzzz` → time zone name or offset.

  The table below summarizes the symbols you can use when defining the **Format** for dates.

  **Note:** Not all symbols are guaranteed to behave consistently in the front-end, as some may be interpreted differently by Angular or other client-side components. Always test your chosen format in the UI.
  
<div align="center">

| Symbol | Meaning | Example |
|--------|---------|---------|
| `d`    | Day of the month, no leading zero | 1–31 |
| `dd`   | Day of the month, with leading zero | 01–31 |
| `ddd`  | Abbreviated day of the week | Mon, Tue |
| `dddd` | Full day of the week | Monday, Tuesday |
| `M`    | Month, no leading zero | 1–12 |
| `MM`   | Month, with leading zero | 01–12 |
| `MMM`  | Abbreviated month name | Jan, Feb |
| `MMMM` | Full month name | January, February |
| `yy`   | Year, two digits | 25 |
| `yyyy` | Year, four digits | 2025 |
| `h`    | Hour in 12-hour format, no leading zero | 1–12 |
| `hh`   | Hour in 12-hour format, with leading zero | 01–12 |
| `H`    | Hour in 24-hour format, no leading zero | 0–23 |
| `HH`   | Hour in 24-hour format, with leading zero | 00–23 |
| `m`    | Minute, no leading zero | 0–59 |
| `mm`   | Minute, with leading zero | 00–59 |
| `s`    | Second, no leading zero | 0–59 |
| `ss`   | Second, with leading zero | 00–59 |
| `f`–`fffffff` | Fractional seconds (tenths, hundredths, milliseconds…) | 1 → 0.1s, 123 → 0.123s |
| `t`    | First character of AM/PM | A or P |
| `tt`   | Full AM/PM designator | AM, PM |
| `K`    | Time zone offset (`Z` for UTC or +02:00) | +02:00 |
| `zzzz`  | Time zone offset with minutes | +02:00 |
| `zz`   | Time zone offset, hours only | +02 |

</div>

- **Time zone**: This specifies the time zone that will be used to display the date/time.  
  For example, `"+00:00"` is UTC (Coordinated Universal Time). Changing this will adjust the displayed time to the desired zone.
- **Culture**: This determines the language and formatting conventions for the date, such as month names, day names, and the order of day/month/year. Default `"en-US"` uses English (United States) conventions. Using `"es-ES"` would show month and day names in Spanish, for example.

You can configure this customization per table, with several possible approaches:
- **Static**: Use the default values or hardcode alternative values if they suit your needs.
- **Server-based**: Use the configuration of the server environment where your application is deployed.
- **Per-user**: Save each user's preferred configuration, allowing users to choose how dates are displayed in their tables. This requires additional setup but provides maximum flexibility.

> [!NOTE]
> While per-table customization is possible, it is recommended to set a **global configuration** for all tables. Individual table settings are mainly useful for specific scenarios, but managing a global configuration is easier and more consistent.

<br><br>



### 4.3 Column configurations
The **ECS PrimeNG Table** allows you to define a variety of settings that control how each column behaves when displayed to users and what they are allowed to do with them.



#### 4.3.1 Data type
Columns can be configured to define how cell data is displayed and treated. The **ECS PrimeNG Table** supports five main data types, and choosing the appropriate type is important, as it also affects the filtering options available (column filtering is explained in later sections):
- **Text**: For data that should be treated as plain text.
- **Numeric**: For numerical values.
- **Boolean**: For yes/no (true/false) values.
- **Date**: For date values. The display format is controlled via the date formatting configuration described in previous sections.
- **List**: A specialized text variant designed for columns containing data separated by `";"`. This type is mainly intended for predefined filters. If not configured, the raw text will simply be displayed (predefined filters are explained in later sections).

> [!NOTE]  
> All data types support null (empty) values, allowing cells to remain blank if no data is available.

<br><br>



#### 4.3.2 Visibility
By default, all columns are visible. However, showing too many columns at once may overwhelm users, so you may want to hide some of them initially. This can be configured in the table setup.

The table includes a built-in **column properties menu** (enabled by default), which allows users to show or hide columns at any time without needing to reload or reconfigure the table. This menu is accessible directly from the table interface and provides a simple checklist of all available columns. (Explained in more detail in later sections.)

You can also restrict visibility changes for specific columns. For example, some columns can be marked as **always visible**, preventing users from hiding them.

Additionally, developers can define **utility columns** that remain hidden from the user interface. These columns (such as row IDs or internal references) are not only invisible to the end user but also excluded from the column properties menu, ensuring they remain hidden while still being available for internal logic or processes.

<br><br>



#### 4.3.3 Horizontal and vertical alignment
Each column can be configured to control how the data inside its cells is aligned, both horizontally and vertically.

**Horizontal alignment options:**
- **Left**: Aligns the content to the left side of the cell. Commonly used for text values.
- **Center**: Centers the content in the cell. Default option.
- **Right**: Aligns the content to the right side of the cell. Typically used for numeric data.

**Vertical alignment options:**
- **Top**: Aligns the content to the top of the cell.
- **Middle**: Centers the content vertically. Default option.
- **Bottom**: Aligns the content to the bottom of the cell.

By default, columns are set to **center** horizontally and **middle** vertically.

Users can change the alignment of any column using a dedicated column properties menu (explained in later sections). You can restrict this behavior in two ways:
- **Restrict per column**: Prevent users from changing the horizontal and/or vertical alignment for specific columns.
- **Disable globally**: Turn off the entire Column Properties menu so users cannot adjust alignment or any other column settings.

<br><br>



#### 4.3.4 Overflow behaviour
When the content of a cell exceeds the available space, the **overflow behaviour** determines how the data is displayed. The available options are:

- **Hidden**: Extra content is clipped and not displayed. This avoids breaking the table layout but may hide part of the information.
- **Wrap**: The content automatically continues on a new line within the same cell, ensuring all data is visible but potentially increasing the row height.

By default, the overflow behaviour for all columns is set to **Hidden**.

Users can adjust the overflow behaviour of each column through the **column properties menu** (explained in later sections). This feature can be controlled in two ways:
- **Restrict per column**: Prevent users from changing the overflow behaviour for specific columns.
- **Disable globally**: Turn off the entire column properties menu so users cannot modify overflow behaviour or any other column settings.

<br><br>



#### 4.3.5 Column properties menu
By default, the table includes a **column properties button** located at the top-left corner. This button opens a modal that allows users to customize how columns are displayed and formatted.
<p align="center">
    <img width="205" height="132" alt="Modify column properties button" src="https://github.com/user-attachments/assets/dcd3bbf3-585d-4a9a-adb6-490b8b419578"/>
</p>

This menu can be **disabled globally** if you do not want users to make any modifications to column properties or visibility.

When enabled, clicking the button opens a modal window that provides the following features:
- **Column list**: Displays all available columns in the table (excluding **utility columns**).
- **Search bar**: A global search input to filter columns by name. Columns are listed alphabetically (A–Z).
- **Editable properties** (if not locked for the column):
  - Visibility (show/hide columns).
  - Horizontal alignment.
  - Vertical alignment.
  - Cell overflow behaviour.

At the bottom-right of the modal, users can either **Cancel** or **Apply** their changes:
- If visibility changes are applied, the table will **refresh data** and reset filters and sorting.
- If only formatting changes (alignment or overflow) are applied, the table will **preserve filters and sorting** without refreshing data.

<p align="center">
    <img width="1232" height="527" alt="Modify column properties menu" src="https://github.com/user-attachments/assets/b6831580-ea14-4b33-81f9-587a7563fee6" />
</p>

<br><br>



#### 4.3.6 Resize
By default, all columns can be resized by the user. This feature can also be disabled for specific columns if desired.

To resize a column, the user must move the cursor to the left edge of the column header. When the resize icon appears (<img width="18" height="18" alt="resize icon" src="https://github.com/user-attachments/assets/3a685f5d-41e4-4771-9b36-32084b6e8c85"/>), the user can press and hold the mouse button, then drag horizontally to adjust the column’s width.

Some important design aspects to take into account:
- Columns cannot be resized if they are not visible.
- By design, resized columns will always maintain a minimal width (about 18px).
- This ensures that users cannot make a column completely disappear by dragging it below this threshold.
- Frozen columns cannot be resized.

<p align="center">
  <img width="757" height="432" alt="resize example" src="https://github.com/user-attachments/assets/f8cb1b9e-f518-4e65-bc1e-875a6de7afdd"/>
</p>

<br><br>



#### 4.3.7 Reorder
The **ECS PrimeNG Table** also includes the ability for users to reorder the columns displayed in the table. This feature can be enabled or disabled per column.

How it works is as follows:

1. The user clicks and holds the **header** of the column they want to move. Important: The click must be on the main header area (not on icons and not on the edges, otherwise it will be detected as a resize action instead).
2. When the action is done correctly, a **semi-transparent copy** of the column header (a "ghost" header) will appear and follow the mouse pointer.
3. While holding down the mouse button, the user can drag this ghost header horizontally to the desired location.
4. To place the column:
    - The ghost header must be aligned to the **left side** of the column where the user wants to insert it.
    - When the position is valid, **two arrows** (one above and one below) will appear as indicators.
5. Once the arrows are visible, releasing the mouse button will reorder the column to the new position.

> [!TIP]
> As a design suggestion, it is recommended to keep column reordering consistent across the table:
> - Either disable reordering for all columns, or allow it for all.
> - If you need to restrict specific columns, it is best to apply this only to **frozen columns**.

<p align="center">
  <img width="1542" height="649" alt="column reorder example" src="https://github.com/user-attachments/assets/a731ffa5-87e6-414f-b3b3-6cf64d9e9de8"/>
</p>

<br><br>



#### 4.3.8 Frozen
Some columns can be configured as **frozen**, depending on the table design.

Frozen columns are always placed at one of the table edges: either on the **left** side or on the **right** side.

These columns remain **visible at all times**, even when the user scrolls the table horizontally.

<p align="center">
  <img width="661" height="526" alt="frozen columns example" src="https://github.com/user-attachments/assets/1a38a4b3-e3e7-430b-ad90-189654363aa6"/>
</p>

<br><br>



#### 4.3.9 Descriptions
Columns can include a **description** to provide additional context. When a column has a description, an **information icon** (<img width="18" height="18" alt="info icon" src="https://github.com/user-attachments/assets/3c3d602b-c4b9-4c7c-b3e7-d7906767916d"/>) will appear on the right side of the column header.

If the user hovers the mouse over this icon, a **tooltip** will be displayed showing the column’s description.

This feature is especially useful for columns that may require extra details to help users better understand the data being presented.

<p align="center">
  <img width="496" height="143" alt="column description example" src="https://github.com/user-attachments/assets/48b98b97-a922-4fec-895f-07ed6b1232b5"/>
</p>

<br><br>



#### 4.3.10 Cell tooltip
By default, each cell in all columns will display a tooltip when the mouse hovers over it, except for columns configured with a boolean data type. The tooltip content will be the same as the cell’s value.

It is also possible to configure the tooltip to display the value from another column (which also works with columns with boolean data type). This can be useful, for example, when a column only shows an icon to indicate whether an upload was successful or not: if the upload failed, hovering the mouse over the icon can show the corresponding error message in the tooltip.
<p align="center">
  <img width="461" height="195" alt="image" src="https://github.com/user-attachments/assets/56af01b5-49d6-4968-b381-09f8192d5353" />
</p>

> [!CAUTION]
> Keep in mind that when referencing other columns, you can only access data from columns that are currently visible in the table. Therefore, avoid mapping tooltips to columns that users can hide, and instead use utility columns that remain always available.

<br><br>



#### 4.3.11 Sorting
By default, all columns are sortable. You can disable sorting on specific columns if you do not want users to sort them.

**How sorting works:**
- Click a column header once to sort in **ascending order**.
- Click the same header a second time to sort in **descending order**.
- Click a third time to **sort ascending again**.

If a different column is clicked while another column is already sorted, the new column will be sorted in ascending order, and the previous column will have its sorting cleared.

The table supports **multi-column sorting**: users can hold the **Ctrl** key while clicking multiple column headers to sort by several columns simultaneously.

You can also define a **default sorting** for one or more columns when the user has not applied any sorting.

In the **top-left corner of the table**, there is a button to **clear all sorting** applied by the user. This button is enabled only when at least one user-applied sorting is active.
<p align="center">
  <img width="230" height="140" src="https://github.com/user-attachments/assets/9b2cd936-7bd0-4054-9940-fa7dbc53a20f" alt="Clear sorting button">
</p>

> [!NOTE]
> If no columns allow sorting, you may hide this button. However, it is **not recommended** to hide it if some columns are sortable, as this could confuse users by preventing them from resetting the sorting.

<br><br>



#### 4.3.12 Filtering
By default, all columns in the table support **filtering**. This feature can also be disabled for specific columns if required.

**How filtering works:**
- Each column header includes a **filter icon**.
- When the user clicks this icon, a filter menu appears.
- The type of filter shown depends on the column’s **data type** or on a **predefined filter** (**predefined filters** explained in later sections).

At the top of every filter menu (except for boolean types), the user can choose between:
- **Match all** (default): only records that satisfy *all* rules defined for that column are returned.
- **Match any**: records that satisfy *at least one* of the rules are returned.

Users can define **up to two rules per column**, except for boolean columns.

The available rules per data type are as follows:

- **Text**
  - Starts with
  - Contains
  - Does not contain
  - Ends with
  - Equals
  - Does not equal

- **Numeric**
  - Equals
  - Does not equal
  - Less than
  - Less than or equal to
  - Greater than
  - Greater than or equal to

- **Boolean**
  - A simple **true/false selector**

- **Date**
  - Date is
  - Date is not
  - Date is before
  - Date is after
 
- **List**
  - If not setup as a predefined filter, it will work as the text filter.

For the `date` data type, filters consider only the date portion and ignore the time. For example, if the user applies the filter **Date is** with the value `23-Sep-2024`, all records with a date between `23-Sep-2024 00:00:00` and `23-Sep-2024 23:59:59` will be returned.

Timezone conversion is automatically handled by the table. For instance, if the table is configured to use GMT+02:00 and a user applies the filter `23-Sep-2024`, the query will correctly filter records between `23-Sep-2024 02:00:00 UTC` and `24-Sep-2024 01:59:59 UTC`.

In the **top-left corner of the table**, there is a button to **clear all active filters**. This button is enabled only when at least one filter has been applied by the user.

<p align="center">
  <img width="224" height="92" alt="Button delete filters" src="https://github.com/user-attachments/assets/757cda01-d30d-40b4-a1c4-0d2d4b2919a7"/>
</p>

> [!NOTE]
> If no columns allow filtering, you may hide the "Clear filters" button.  However, if some columns are filterable, it is **recommended to keep this button visible** to avoid confusing users and to provide a quick way to reset filters.

An example for a filter menu for text data type:
<p align="center">
  <img width="588" height="296" alt="Filter menu example for text" src="https://github.com/user-attachments/assets/8453051f-80f8-44ca-8e0c-83ddf4bb8353" />
</p>

<br><br>



#### 4.3.13 Predefined filters
> [!CAUTION]
> Avoid using this feature on columns that can have a large number of different values, as it may cause performance issues.
> Predefined filters are intended for columns with a limited set of known values.

Predefined filters are a special type of filter where, instead of letting the user input any value, you limit the selection to a **dropdown with known values** for that column.

Additionally, predefined filters allow you to **customize how values are displayed** in a cell. Supported display formats include:

- **Plain text**
- **Tags**, where you can personalize the tag color.
- **Icons**, where you can customize the icon color and size. Icons can come from multiple libraries, such as PrimeNG icons, Font Awesome, Material Icons, etc...
- **Images**, which will be displayed directly in the cell. The table manages image loading and displays a skeleton while downloading. Images can be hosted locally on your server or come from external URLs.

The same formatting applied to the cell will also appear in the dropdown for filtering.

The dropdown includes a **global search bar** and allows the user to select **one or more items** simultaneously (the filter applied is of type "OR").

Predefined filters also have a special use case for columns of type `list`. In this case, all elements in the column are separated by `;`, allowing multiple items of your list to be displayed simultaneously applying the defined format.

Additionally, predefined filters can be configured to be clickable. When clicked, you can access both the row data and all the information of the predefined filter item that was selected.

> [!TIP]
> You can combine formats in predefined filters. For example, you could display an **image** and **plain text** together.
<p align="center">
  <img width="1052" height="453" alt="Predefined filter example" src="https://github.com/user-attachments/assets/90b15f1a-c1f2-42a9-b853-83583acb26f8" />
</p>

<br><br>



#### 4.3.14 Initial width
You can define an initial width for table columns in pixels. Setting explicit widths is particularly important for **frozen columns**, as it ensures proper alignment and prevents layout shifts when the table is rendered.

Keep in mind that the initial width **overrides any width saved in views**, so use it carefully with columns that users can resize.

<br><br>



### 4.4 Row configurations
The **ECS PrimeNG Table** allows you to configure various settings that control how each row behaves when displayed to users, as well as the actions associated with them.



#### 4.4.1 Single select
The ECS PrimeNG Table allows enabling **single row selection** for rows. When enabled, this feature lets the user select a single row.

You can associate actions when a user selects or unselects a row. Additionally, you can access the currently selected row at any time and perform actions.

Users can also **unselect a previously selected row**. There are two ways to configure this behavior:
- **CTRL + Click (default):** Hold down the `CTRL` key and click the already selected row to unselect it.
- **Click only:** Simply click the already selected row to unselect it, without needing to press `CTRL`.

<p align="center">
  <img width="1899" height="243" alt="Single row select example" src="https://github.com/user-attachments/assets/644c4bd3-512d-4768-9e56-d283e6d05827"/>
</p>

> [!NOTE]
> On mobile devices (phones or tablets), the `CTRL` key configuration is ignored. Users can unselect a previously selected row by simply clicking it, as mobile devices do not have a `CTRL` key.

> [!CAUTION]
> If the default behavior (holding down `CTRL` to unselect) is enabled, repeatedly clicking the same row **without holding `CTRL`** will count as multiple selections.  
> This can cause unintended behavior if actions are triggered on each selection, so plan your row actions accordingly.

<br><br>



#### 4.4.2 Checkbox select
If you need users to **select multiple rows simultaneously**, you can enable the **checkbox select** feature.  

When enabled:  
- A new column appears in the table for checkboxes.  
- This column **cannot be hidden** or have its alignment changed via the `column properties menu`.  
- The column also includes a **filter**, allowing users to filter between **selected** and **unselected** rows.  

You can associate actions when a user selects or unselects a row using the checkbox. Additionally, you can access the currently selected rows at any time and perform actions based on them.  


The **checkbox select column** has this additional customizable options:
- **Header title:** Default is `"Selected"`.
- **Alignment:** Default is left.
- **Width:** Default is `150px`.
- **Frozen column:** Default is `true`.
- **Resizable by user:** Default is `false`.
- **Enabled condition:** A condition that can be given to determine if the checkbox is enabled or not.

<p align="center">
  <img width="311" height="362" alt="Checkbox row select example" src="https://github.com/user-attachments/assets/0e387896-6569-46f0-96cb-9f9f68536932" />
</p>

<br><br>



#### 4.4.3 Dynamic styling
The ECS PrimeNG Table allows you to **apply dynamic styling to specific rows**, making them visually distinct from other rows or even changing their appearance at runtime.

The most common use case is to **change the text format or background** of a row based on a specific column value.

In the example below:
- If the column `Employment status list` contains the value `Full-time`, the row will display its text in **bold** and **italic**.
- If the value `Unemployed` exists in the column `Employment status list`, the row’s **background color** will change to **light red**, the **text color** to **dark red**, and the **font weight** will be **bold**.

<p align="center">
  <img width="1901" height="558" alt="Dynamic row styling" src="https://github.com/user-attachments/assets/2ef09870-110b-45d6-b4e8-14aef7baad51" />
</p>

> [!TIP]
> A row can combine multiple styles simultaneously, applied from different rules.

<br><br>



### 4.5 Action buttons
The **ECS PrimeNG table** allows you to define **action buttons** both in the table header and within each row.

The key difference between both of them:
- **Header action buttons** do not have access to row data.
- **Row action buttons** can access the data of the row in which they are clicked, allowing you to perform actions on a specific record.

The customizable properties for action buttons are:
- **Icon**: You can optionally display an icon and customize its **color** and **size**. Icons can come from multiple libraries, such as **PrimeNG icons**, **Font Awesome**, **Material Icons**, etc...
- **Icon position**: By default `left`, but the icon can be displayed to the `right`, `bottom` or `top` of the label.
- **Label**: Text to display on the button.
- **Rounded**: If the button should have round corners or not.
- **Raised**: If active, adds a shadow to indicate elevation in the button.
- **Variant**: The default is a normal button, but you can also have buttons that are text or outlined.
- **Color**: The button color.
- **Style**: Additional styles to add to the button.
- **Visible condition**: Allows completely hiding the button if a specific condition is not met. Other conditions (`Enabled condition` and `Hide if condition not met`) are ignored when the button is not visible.
- **Enabled condition**: Allows disabling the button if a specific condition is not met. Evaluated only when the button is visible.
- **Hide if condition not met**: By default, if the specified `enabled condition` is not met, the button will be disabled, but you can choose to hide it completely instead. Ignored when the button is not visible.
- **Action**: The function or operation to execute when the button is clicked.
- **Tooltip**: The text to be displayed when hovering the button.

An example of a header action button: 
<p align="center">
  <img width="158" height="66" alt="Header action buttons" src="https://github.com/user-attachments/assets/be7cbd0a-d148-42d7-8200-98669b8c5532" />
</p>

When at least one row action button is defined, a new column automatically appears to display the buttons for each row. This column has the following customizable options:**  
- **Header title**: Default is `"Actions"`  
- **Alignment**: Default is right  
- **Width**: Default is `150px`  
- **Frozen column**: Default is `true`  
- **Resizable by user**: Default is `false`  

An example of the actions columns with row action buttons:  
<p align="center">
  <img width="124" height="124" alt="Row action buttons" src="https://github.com/user-attachments/assets/af65a3f1-2cc7-455e-bf85-059f9e372d24" />
</p>

<br><br>



### 4.6 Global filter
The **global filter** is enabled by default for all columns and appears in the **top-right corner** of the table. It allows users to **search for a keyword across all visible columns** of the table simultaneously.

This feature can be disabled:
- **Globally**, by hiding the global filter input box.
- **Per column**, excluding specific columns from global search.

The global filter does **not apply** to columns with a **boolean data type**, since there is no keyword to match.

**How it works:**
- When a user types a value in the global filter input box, the table:
  - Returns all rows that contain the keyword in any of the displayed columns.
  - Highlights the matched text in **yellow**.
- The keyword can match **any part of the text**.
- If the global filter input box contains a value, an **"X" icon** appears on the right, allowing the user to clear the filter with a single click.

An example of the global filter:
<p align="center">
  <img width="1899" height="560" alt="Global filter example" src="https://github.com/user-attachments/assets/fb6308aa-7d6d-48ab-be4e-31580e595aa9"/>
</p>

> [!CAUTION]
> Using the global filter may significantly affect performance, especially in large datasets.  
> Consider the following best practices to keep it efficient:
> - **Limit the maximum number of columns that can be visible at the same time**, since the global filter runs across all displayed columns.
> - **Be cautious with date columns**, as the global filter converters dates to strings and it is more expensive.
> - **Optimize your backend** for keyword searches (e.g., using proper indexes).
> - **Limit the total number of records** retrieved at once if performance is a concern.

<br><br>



### 4.7 Pagination and record count
The **ECS PrimeNG table** automatically manages both pagination and record counting for you. This means only the data required for the current page is loaded on the front-end, optimizing performance and minimizing the amount of information transferred.

At the bottom of the table you will find two main areas:
- **Left side:** shows a message like *"Showing X records of X available"*.
  - If filters are applied, the *"Showing X"* part reflects only the filtered results.
  - The *"of X available"* part always displays the total number of records in the dataset, regardless of filters.

- **Right side:** contains the pagination controls.
  - Users can navigate pages by clicking a page number or using the arrows.
  - A single arrow moves one page forward or backward.
  - A double arrow jumps directly to the first or last page.

Additionally, to the right of the pagination, there is a dropdown menu that lets users change how many items are displayed per page. The available options are fully customizable.

An example of the **pagination and record count**:
<p align="center">
  <img width="1889" height="225" alt="Pagination and record count example" src="https://github.com/user-attachments/assets/7003a255-2516-4c2a-97c9-6084b4abb861" />
</p>

> [!CAUTION]
> Avoid allowing very high numbers of items per page, as this may reduce performance.

> [!CAUTION]
> Max allowed items per page is 255.

<br><br>



### 4.8 Copy cell content
This feature is enabled by default and can be configured per table.

It allows users to **press and hold on a cell** to copy its raw content directly to the clipboard.

You can also customize:
- The duration of the press before the copy action is triggered.  
- Or disable the feature entirely if it is not needed.

<br><br>



### 4.9 Dynamic height
Enabled by default, this feature automatically adjusts the **maximum height** of the table to fit its container.

The vertical scroll bar will appear **inside the table** to navigate records on the current page, while the **header and paginator remain visible** at all times.

<br><br>



### 4.10 Deferred startup
By default, when you access a page containing an **ECS PrimeNG table**, the table automatically loads its configuration and data.

This behavior can be deferred if needed. For example, in any of these scenarios:
- The user must perform an action before retrieving data.
- Some data needs to be fetched first to populate predefined filters.
- Any other scenario you might have.

Once ready, the table can be manually updated through external calls.

<br><br>



### 4.11 Changing the data endpoint dinamically
It is possible to change the **data source** of a table while it is in use, without needing to reload or download the entire table configuration again.

This feature is especially useful in scenarios where:
- The **columns** (and even the **views**) remain the same.
- You only need to adjust where the table fetches its data from.

A common example is when you apply a **higher-level filter**.

For instance, switching between different clients: the table keeps the same structure, but the data source changes so you can view information for the selected client across the whole application.  

<br><br>



### 4.12 Excel report
With minimal setup, you can allow users to **export table data** through an interactive menu with multiple export options.

If enabled, an **Excel icon** will appear at the top right of the table. Clicking it opens a modal window like this:
<p align="center">
  <img width="1359" height="507" alt="Excel report example" src="https://github.com/user-attachments/assets/021010b2-815d-43b7-b09b-5b930af4feb6"/>
</p>

Users can customize the export with the following options:
- **Report filename**: Can be prefilled with a name (default: "Report"). You can also prevent users from changing it.
- **Include timestamp**: By default enabled. Adds the current time in the format `_{year}{month}{day}_{hours}{minutes}{seconds}_UTC` to the filename. Users can disabled it if they want to.
- **Export columns**: Choose whether to export only visible columns or all columns (default: visible only).
- **Filters to apply**: Decide whether table filters should apply to the export (default: not applied). If the **Selected rows** option is enabled and not set to "All rows," this option becomes mandatory applying the current filters.
- **Sorts to apply**: Include table sorting in the export (default: not applied).
- **Selected rows**: Appears only if the table has the **row checkbox selector** enabled. Users can export selected rows, unselected rows, or all rows regardless of selection.

Once satisfied with the configuration, users can click **Export** to generate the Excel file, which will be automatically downloaded to their device.

<br><br>



### 4.13 Views
As seen in previous sections, users have many options to customize how data is displayed in the table.

Sometimes users want to **save all these customizations** so they don’t have to remember or reapply them each time.

The **ECS PrimeNG Table** provides this feature through **"Views"**.

Views are saved **per table key and user**. To enable this, you just need to:
- Assign a **unique key** to each table that should support views.
- Choose how views are stored. Available options:
  - **Session storage**: Views are kept only during the session. Closing the browser tab or browser will remove the views.
  - **Local storage**: Views are stored locally in the browser. They persist longer but can be lost if the user clears browser data or switches devices.
  - **Database storage**: The most versatile option. Views are stored in a database, allowing users to keep them permanently and access them across different browsers or devices. Requires additional setup.  

> [!CAUTION]  
> Table keys must be unique when using views. Otherwise, views from one table could appear in another, causing errors in your application.

If views are enabled, users will see the following menu in the middle of the table header:
<p align="center">
  <img width="308" height="51" alt="Views top menu" src="https://github.com/user-attachments/assets/60b0f80e-ccd9-4077-aa1b-574a64e083da" />
</p>

This menu shows the currently applied view:
- A text showing "---Select a view---" displays the name of the currently applied view (if a view is being applied).
- The **replay button** reapplies the last configuration of the selected view.
- The **eraser button** resets the table to its original state, as if no views were applied.

When the text of the menu is pressed, the following modal is shown:
<p align="center">
  <img width="1359" height="455" alt="Views menu" src="https://github.com/user-attachments/assets/d8bf9234-02f3-4c6d-95a8-1558d1df2b69"/>
</p>

In the modal, users can manage table views and create new ones. For each view, the available options are:
- **Load on startup**
- **Apply the view**
- **Update the view**
- **Change the view alias**
- **Delete the view**

Rules and limitations of views:  
- There can't be two views in the same table with the same alias.  
- By default, a table can have up to 10 views (configurable if needed).  
- **Load on startup**: If checked for a view, it will automatically apply the next time the table loads. Only one view can have this enabled at a time.

<br><br><br>



---
## 5 Feature-to-Code mapping
The purpose of this section is to provide a table that maps the features described earlier to their corresponding technical implementation. Use the table below as a reference to perform this mapping.

**Note**: It is also recommended to read the first subsections of Section 6, since they are not directly numbered to match the functional features but still provide useful guidance.

<div align="center">

| Scope | Functional feature | Technical implementation |
|-|-|-|
| Table | [4.1 Planning your table](#41-planning-your-table) | [6.1 Understanding the basics](#61-understanding-the-basics) |
| Table | [4.2 Date formatting](#42-date-formatting) | [6.2 Configuring date formats](#62-configuring-date-formats) |
| Columns | [4.3.1 Data type](#431-data-type) | [6.3.1 Choosing the appropriate data type](#631-choosing-the-appropriate-data-type) |
| Columns | [4.3.2 Visibility](#432-visibility) | [6.3.2 Configuring visibility and order](#632-configuring-visibility-and-order) |
| Columns | [4.3.3 Horizontal and vertical alignment](#433-horizontal-and-vertical-alignment) | [6.3.3 Horizontal and vertical alignment](#633-horizontal-and-vertical-alignment) |
| Columns | [4.3.4 Overflow behaviour](#434-overflow-behaviour) | [6.3.4 Overflow behaviour](#634-overflow-behaviour) |
| Columns | [4.3.5 Column properties menu](#435-column-properties-menu) | [6.3.5 Column properties menu](#635-column-properties-menu) |
| Columns | [4.3.6 Resize](#436-resize) | [6.3.6 Resize](#636-resize) |
| Columns | [4.3.7 Reorder](#437-reorder) | [6.3.7 Reorder](#637-reorder) |
| Columns | [4.3.8 Frozen](#438-frozen) | [6.3.8 Frozen](#638-frozen) |
| Columns | [4.3.9 Descriptions](#439-descriptions) | [6.3.9 Descriptions](#639-descriptions) |
| Columns | [4.3.10 Cell tooltip](#4310-cell-tooltip) | [6.3.10 Cell tooltip](#6310-cell-tooltip) |
| Columns | [4.3.11 Sorting](#4311-sorting) | [6.3.11 Sorting](#6311-sorting) |
| Columns | [4.3.12 Filtering](#4312-filtering) | [6.3.12 Filtering](#6312-filtering) |
| Columns | [4.3.13 Predefined filters](#4313-predefined-filters) | [6.3.13 Predefined filters](#6313-predefined-filters) |
| Columns | [4.3.14 Initial width](#4314-initial-width) | [6.3.14 Initial width](#6314-initial-width) |
| Rows | [4.4.1 Single select](#441-single-select) | [6.4.1 Single select](#641-single-select) |
| Rows | [4.4.2 Checkbox select](#442-checkbox-select) | [6.4.2 Checkbox select](#642-checkbox-select) |
| Rows | [4.4.3 Dynamic styling](#443-dynamic-styling) | [6.4.3 Dynamic styling](#643-dynamic-styling) |
| Table | [4.5 Action buttons](#45-action-buttons) | [6.5 Setting up row and header action buttons](#65-setting-up-row-and-header-action-buttons) |
| Table | [4.6 Global filter](#46-global-filter) | [6.6 Configuring the global filter](#66-configuring-the-global-filter) |
| Table | [4.7 Pagination and record count](#47-pagination-and-record-count) | [6.7 Pagination properties](#67-pagination-properties) |
| Table | [4.8 Copy cell content](#48-copy-cell-content) | [6.8 Copy cell content](#68-copy-cell-content) |
| Table | [4.9 Dynamic height](#49-dynamic-height) | [6.9 Dynamic height](#69-dynamic-height) |
| Table | [4.10 Deferred startup](#410-deferred-startup) | [6.10 Deferred startup](#610-deferred-startup) |
| Table | [4.11 Changing the data endpoint dinamically](#411-changing-the-data-endpoint-dinamically) | [6.11 Changing the data endpoint dinamically](#611-changing-the-data-endpoint-dinamically) |
| Excel report | [4.12 Excel report](#412-excel-report) | [6.12 Configuring Excel reports](#612-configuring-excel-reports) |
| Views | [4.13 Views](#413-views) | [6.13 Setting up views](#613-setting-up-views) |

</div>

<br><br><br>



---
## 6 Technical overview
The goal of this section is to provide a technical overview of the **ECS PrimeNG table**. It dives into the configuration options and implementation details, giving developers a clear understanding of how the table works under the hood. This section helps you grasp the mechanics, and integrate the table efficiently into your projects.

<br><br>

### Table startup flow and rendering limitations
The **ECS PrimeNG Table**, when loaded in a component, follows the sequence below (unless you defer the startup process):
```
Component is loaded.
└─> Fetch table configuration.
    └─> Load views (if enabled) and preload a view if previously selected by the user.
        └─> First data retrieval.
```

> [!CAUTION]
> If you are using Angular SSR, note that this component currently only supports **client-side rendering (CSR)**. Attempting to use Server-Side Rendering (SSR) or static rendering will result in errors.

<br><br>



### Recommended architecture
When building endpoints that involve business logic, data access, or complex operations, it is recommended to follow a layered architecture to promote **separation of concerns**, **testability**, and **maintainability**.  

A typical structure (and the one used in the example project) could look like this:
```
Controller
└─> IService (Interface)
    └─> Service (Implementation)
        └─> IRepository (Interface)
            └─> Repository (Implementation, Data Access)
```

**Explanation of each layer:**
- **Controller**:  
  - Handles HTTP requests from the front-end.
  - Validates input parameters.
  - Calls the corresponding service interface method.

- **IService (Interface)**:  
  - Defines the contract for your service.
  - Ensures consistency and makes it easier to mock or replace the service in unit tests.

- **Service (Implementation)**:  
  - Implements the business logic.
  - Receives requests from the controller and transforms them into repository queries.
  - Handles additional logic such as mapping DTOs, filtering, sorting, and pagination.

- **IRepository (Interface)**:  
  - Defines the contract for data access operations.  
  - Provides abstraction over the underlying data source (e.g., EF Core, external APIs).  
  - Makes it easier to mock or swap implementations in unit tests.  
  
- **Repository**:  
  - Directly interacts with the database or other data sources.
  - Executes queries and returns raw data.
  - Keeps data access logic separated from business logic for maintainability.

> [!TIP]  
> This layered approach ensures **separation of concerns**, **testability**, and **scalability**.  
> The `Controller` only orchestrates requests, the `Service` handles business rules, and the `Repository` deals with raw data.
> Separating layers into different projects is optional but recommended for larger applications.  
> This structure promotes **clean architecture** and makes it easier to scale or replace parts independently.

<br><br>



### 6.1 Understanding the basics
For every **ECS PrimeNG table** you want to use, even when displaying simple data without additional features like custom buttons or specific data types (e.g., date, list), the following minimum setup is required:

- **Backend:**
  - **DTO:** A Data Transfer Object decorated with a special attribute that specifies the parameters used to configure the table columns.
  - **Endpoints:** Two endpoints are required. One provides the table configuration, and the other retrieves paginated data while applying all sorting and filtering rules.

- **Frontend:**
  - **Component:** Import the `ECSPrimengTable` in the component that will display the table.
  - **Template:** Use the `<ecs-primeng-table>` element in the component's HTML and configure the minimal required properties.

This section focuses on creating a table that displays simple data without row actions or other advanced features.

<br><br>


#### 6.1.1 Backend
##### 6.1.1.1 Setting up the DTO
First, you always need a DTO that represents the full table, including all possible columns, both internal-use columns and the columns displayed to the user (columns that are always visible or optionally hideable).  

Your DTO must include a `RowID` of type `Guid` with this exact name, as many of the table's advanced features rely on it (e.g., the row selector). The values in this column should be unique.

Here is an example DTO with a `RowID` and three basic data types: text, numeric, and boolean:
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
From the above DTO, the basics for a table are defined with three visible columns and a fourth column (`RowID`) that is hidden from end-users but available in the front-end.

Some important points about this example DTO:
- Every property intended as a column has a `ColumnAttributes` decorator. This signals to **ECS PrimeNG table** that it should include this property as a column. Properties without this decorator are ignored and will not appear in the table.
- The `RowID` column has `sendColumnAttributes` set to `false`, ensuring its data is always available in the front-end while remaining hidden in the table. Users cannot toggle its visibility. This option can be applied to any column you want to keep hidden from users but accessible in the front-end.
- The first parameter of `ColumnAttributes` specifies the column name displayed in the front-end. In this example, the visible columns will be `"Username"`, `"Money"`, and `"Has a house"`.
- It is important to correctly handle nullable and non-nullable properties to ensure proper mapping. For instance, if `"Username"` cannot be null in your dataset, declare it as `string` and initialize it with `string.Empty`. If it can be null, use `string?` without assigning a default value.
- By default, columns are treated as `Text`. To use other data types, specify the `dataType` parameter in `ColumnAttributes`.
- The order of the properties in the class determines their left-to-right order in the final table on the front-end. Exceptions are frozen columns: those set to the left appear before all other columns, and those set to the right appear at the end of the table.

> [!NOTE]
> The possible data types are:
> - **Text**: For string values.
> - **Numeric**: For numbers like `int`, `long`, `decimal`, etc.
> - **Boolean**: For `bool` values.
> - **Date**: For `DateTime` values. Additional customization options are explained in later chapters.
> - **List**: A specialized `Text` type used with `predefined filters` to represent data separated by `;`, including tags, icons, images, or text.

> [!IMPORTANT]
> Always include a `RowID` property in your class with a `ColumnAttributes` decorator and `sendColumnAttributes` set to `false`. This column is required by the table for rendering performance and for advanced features. Ensure that the values in this column are **unique**.

> [!TIP]
> All properties intended to be table columns should have a `ColumnAttributes` decorator. This tells **ECS PrimeNG table** to include them as columns. Properties without this decorator are ignored and will not appear in the table.

> [!CAUTION]
> Avoid adding a property named `Selector` in your class, especially if you plan to use the row selection feature. This name is reserved as a virtual column used internally by the table, and using it can cause conflicts.

<br><br>



##### 6.1.1.2 Setting up the endpoints
###### Creating the table configuration endpoint
The first required endpoint is the **table configuration endpoint**, which provides the **minimum configuration** needed for the table to work. This endpoint should be a `GET` method.

Together with the data endpoint, it forms the **core setup** required to get the table running. Additional endpoints and logic can be added later as needed.

This endpoint should return a `TableConfigurationModel`, which can be obtained by calling in your service:
```c#
EcsPrimengTableService.GetTableConfiguration<T>();
```

Where `T` is your DTO class.

The `GetTableConfiguration` method automatically inspects the `ColumnAttributes` defined in the DTO (`T`) and builds a `TableConfigurationModel` containing:

- **Column definitions**: Metadata about each column (name, type, visibility, order, frozen state, etc.).
- **Allowed items per page**: The pagination options available for the table.
- **Date format**: The default format for displaying date values.
- **Timezone**: The timezone used for date/time rendering.
- **Culture**: The culture used for numeric and date formatting.
- **Max allowed views**: The maximum number of views a user can save.

By default, the following values are applied if no overrides are provided:
```c#
internal class TableConfigurationDefaults {
    public static readonly int[] AllowedItemsPerPage = [10, 25, 50];
    public static readonly string DateFormat = "dd-MMM-yyyy HH:mm:ss zzzz";
    public static readonly string DateTimezone = "+00:00";
    public static readonly string DateCulture = "en-US";
    public static readonly byte MaxViews = 10;
}
```

**_Example_**

Below is a minimal working example showing how to implement the **table configuration endpoint** and its corresponding service assuming that you use the `TableConfigurationDefaults`. There is no need for the repository since there is no data access needed in this endpoint.

The **table configuration** endpoint in your controller might look like this:
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

The `GetTableConfiguration` from your `service` might look like this (minimal service definition):
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
> Replace `TestDto` with the DTO used for your table. The service will automatically read its column definitions and build the configuration accordingly.

<br><br>



###### Creating the table data endpoint
The second required endpoint is the **table data endpoint**, which provides the **minimum data needed** to populate the table. This endpoint should be a `POST` method.

This endpoint, together with the table configuration endpoint, forms the **core setup** required for the table to function. It handles data retrieval, filtering, sorting, and pagination, ensuring that the table displays the correct rows based on user interaction and query parameters. Additional endpoints or business logic can be added later as needed.

This endpoint should return a `TablePagedResponseModel`, which can be obtained by calling in your service:
```c#
EcsPrimengTableService.PerformDynamicQuery(inputData, baseQuery);
```

Where:
- `inputData` is a `TableQueryRequestModel` sent by the **ECS PrimeNG table** in the request body.
- `baseQuery` is an `IQueryable` built on a DTO class decorated with `ColumnAttributes`.  
  This must be the **same DTO** used in the table configuration endpoint (example from previous section).

The `PerformDynamicQuery` method executes a sequence of operations (detailed below) and returns a `TablePagedResponseModel` containing:
- **Current page**: The page number where the user is currently located.
- **Total records**: The total number of records *after* filters are applied.
- **Unfiltered total records**: The total number of records *before* any filters are applied. 
- **Data**: The actual page content, represented as dynamic data.

The `EcsPrimengTableService.PerformDynamicQuery()` method performs the following steps in order:
1. **Sorting**: Applies the sorting rules defined in the `TableQueryRequestModel`:  
   - If rules are provided, they are applied.
   - If no rules are provided and a `defaultSortColumnName` is specified, that default sort will be applied.
   - If neither is provided, no sorting is performed.
2. **Count before filtering**: Delegates a `COUNT` operation to the database engine to determine the total number of records *before* filters are applied.
3. **Global filter**: If specified in the `TableQueryRequestModel`, applies the global filter to all eligible columns.
4. **Column filters**: Applies all per-column filter rules from the `TableQueryRequestModel`, by adding them to the `IQueryable`.
5. **Count after filtering**: Delegates a `COUNT` operation to the database engine to determine the total number of records *after* filters are applied.
6. **Pagination check**: Calculates the total number of pages based on items per page and filters. If the current page exceeds the available page count (e.g., user was on page 100 but filters reduce the dataset to 7 pages), the current page is adjusted to the last available page and the frontend then handles moving the user accordingly.
7. **Dynamic select**: Projects only the required columns by adding a `SELECT` to the `IQueryable`.
   - The query is then materialized using `ToDynamicList()`, delegating execution to the database.
   - The result is a list containing only the requested columns, including apart from the requested, those that have the `sendColumnAttributes` set to `false`.
8. **Return result**: Finally, returns a `TablePagedResponseModel` with the processed data to the frontend.

> [!IMPORTANT]
> Some important aspects to allways consider are as follows:
> - **Validation**: Always validate the page size and requested columns before calling `PerformDynamicQuery`, using `ValidateItemsPerPageAndCols`.
> - **Performance**: Ensure that the `IQueryable` uses `AsNoTracking()` since no entity tracking is needed. This also improves performance.
> - **Reusability**: Define a private method in the service that builds the base `IQueryable`. This allows reusing the same query for both the **table data endpoint** and features like **Excel export**, ensuring data consistency.

**_Example_**

Below is a simplified setup showing how to implement the **table data endpoint**, its service, and repository.

The **table data** endpoint in your controller might look like this:
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

The `GetTableData` method in your service can be implemented like this (minimal example). It includes a private `GetBaseQuery` method that centralizes the base query logic, allowing you to **reuse it** for features such as **Excel export**, ensuring consistency across endpoints. This service implementation also makes use of a repository to access the underlying data:
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
            return (true,EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery());
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

The repository that your service accesses could look like this:
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

With this setup, your table data endpoint is fully functional and ready to integrate with the ECS PrimeNG table frontend.

<br><br>



#### 6.1.2 Frontend
Assuming you have completed all the steps in the setup section and you are using standalone components in your frontend, this section will guide you on how to implement a basic **ECS PrimeNG table** that simply displays data.

In your desired component TypeScript file, a minimal definition should look like this (assuming the component is named `Home`):
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
> It is important that the variable you use as `tableOptions` is initialized using `createTableOptions`. This ensures that the table is created with the necessary base configuration, preventing errors or unexpected behaviour.

In this component, only the paths to the API endpoints are defined. It is assumed that the ECS PrimeNG table component has already been provided with the base URL of the API in the HTTP service injection.

In your component's HTML, the table can be displayed as follows:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

You only need to pass the `tableOptions` property.

Once you start up your API and serve the frontend, you should be able to see the table rendered on the page if everything is set up correctly.

Additionally, you can subscribe to table lifecycle events to detect when a **data fetch** has been completed. This is useful, for example, when the user changes the page, applies a filter, or triggers any action that requires reloading the table data if you need to listen to it.
- **`onDataEndUpdate`**: Emitted after the table has finished fetching and updating its data. This event does not provide any payload (type: `void`).

An example of this subscription could be:

In your desired component TypeScript file:
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

In your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions" (onDataEndUpdate)="onDataUpdated()"/>
```

<br><br>



### 6.2 Configuring date formats
In your service where `EcsPrimengTableService.GetTableConfiguration` is called, you can pass additional parameters to customize how dates are displayed.

The **ECS PrimeNG table** will automatically handle the date conversion, and the configurations you define in the backend will be reflected in the frontend when rendering table cells.

For maximum flexibility, it is recommended to store the user’s preferences for:
- **Date format**: A string, e.g. `"dd-MMM-yyyy HH:mm:ss zzzz"`
- **Date timezone**: A string, e.g. `"+00:00"`
- **Date culture**: A string, e.g. `"en-US"`

Let’s assume that these values are stored in a variable named `userPreferences` and that you are working with a `TestDto`.

An example service implementation could look like this:
```c#
using ECSPrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {

        public TableConfigurationModel GetTableConfiguration() {
            var userPreferences = getUserDataFromDatabase(); // Get the user preferences from the database
            return EcsPrimengTableService.GetTableConfiguration<TestDto>(null, userPreferences.dateFormat,
                userPreferences.dateTimezone, userPreferences.dateCulture);
        }
    }
}
```

> [!NOTE]
> If no arguments are specified, the defaults format for dates are:
> - **Date format**: `"dd-MMM-yyyy HH:mm:ss zzzz"`
> - **Date timezone**: `"+00:00"`
> - **Date culture**: `"en-US"`

<br><br>



### 6.3 Columns
#### 6.3.1 Choosing the appropriate data type
By default, all columns in your table are treated as **text**. However, as described in the related functional documentation, there are **five main data types** available.

Choosing the correct data type is important because:
- It influences how cells are rendered in the table.
- It affects how certain **ECS PrimeNG table** features behave (e.g., filtering, sorting, formatting).

Additionally, it is crucial to **declare whether a column is nullable**. If this is not correctly defined, dynamic queries may fail, causing your table data endpoint to break in certain scenarios.

An enum named `DataType` is available, which defines the five possible data types you can associate with a column.

To set the data type, simply define it in the `dataType` property of the `ColumnAttributes` applied to your DTO properties.

**_Example_**

Consider a DTO with:  
- A row identifier (GUID)  
- Two strings (one nullable, one not)  
- A numeric value  
- A nullable date  
- A boolean  

The DTO declaration would look like this:
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
> Always select the appropriate `DataType` for your columns to ensure correct rendering and reliable query handling. 

> [!CAUTION]
> If a column can contain null values, you must explicitly mark the property as nullable in C# by appending `?` after the type.
 
<br><br>



#### 6.3.2 Configuring visibility and order
##### Visibility
By default, all columns are **visible**. You can control column visibility using the `ColumnAttributes` of your DTO by configuring the following options:

- **`sendColumnAttributes`**
  - Use this when you need a column for **frontend functionality** but don’t want it visible to the user.
  - If set to `false`, the column will always remain hidden, and all other visibility options (`canBeHidden`, `startHidden`) will be ignored.
  - Example use case: internal IDs, keys, or technical references required by the application logic.

- **`canBeHidden`**
  - Determines whether the user can toggle the visibility of the column in the column editor menu.
  - Default: `true` (users can toggle the visibility).
  - If set to `false`, the column will always remain visible, and the user cannot hide it.

- **`startHidden`**
  - Defines whether the column is visible when the table first loads.
  - Default: `false` (the column is visible initially).
  - If set to `true`, the column will start as hidden, but the user can make it visible through the column editor menu.
  - **Important**: if `canBeHidden` is `false`, the `startHidden` option is ignored, and the column will always be visible.

<br><br>



##### Order
By default, columns are displayed in the frontend **following the order of their declaration in your DTO class**:
- The first property in the class corresponds to the **leftmost column**.
- The last property corresponds to the **rightmost column**.

There are two exceptions to this rule:
1. **Frozen columns**: These can be pinned to the left or right side of the table, and they will always remain fixed in that position regardless of DTO order.
2. **Selector and row action columns** (explained in later sections):
   - If frozen, they remain at the extreme sides of the table.
   - If not frozen, they are positioned at the sides, directly before any frozen columns.

<br><br>



#### 6.3.3 Horizontal and vertical alignment
By default, all columns are aligned **horizontally at `Center`** and **vertically at `Middle`**, which means that the content of each cell is displayed at its center.

Users are allowed to change both the horizontal and vertical alignment through the **column editor menu** by default.

If different initial alignments are required, or if user customization must be restricted, the `ColumnAttributes` of the DTO provides the following configuration options:

- **Initial alignment**
  - **`dataAlignHorizontal`**: Uses the `DataAlignHorizontal` enum. Default value is `Center`. Possible values are `Left`, `Center` and `Right`.
  - **`dataAlignVertical`**: Uses the `DataAlignVertical` enum. Default value is `Middle`. Possible values are `Top`, `Middle` and `Bottom`.

- **Restricting alignment changes**
  - **`dataAlignHorizontalAllowUserEdit`**: By default set to `true`. If set to `false`, the user cannot change the horizontal alignment of the column in the editor menu.
  - **`dataAlignVerticalAllowUserEdit`**: By default set to `true`. If set to `false`, the user cannot change the vertical alignment of the column in the editor menu.

<br><br>



#### 6.3.4 Overflow behaviour
All columns come with a default **cell overflow behaviour** of `Hidden`.

By default, users are allowed to change the overflow behaviour of a column through the **column properties menu**.

If you need a different default behaviour, or if you want to prevent users from modifying it, the `ColumnAttributes` of your DTO provides the following options:

- **`cellOverflowBehaviour`**: Defines how the content of the cell is handled when it exceeds the column width. It uses the `CellOverflowBehaviour` enum, which has two possible values:
  - `Hidden` (default): exceeding the width of the column will be truncated and not displayed.
  - `Wrap`: Excess content is wrapped onto new lines, allowing the row to expand vertically as needed to fit all content.

- **`cellOverflowBehaviourAllowUserEdit`**: Controls whether users can change the column’s overflow behaviour through the column editor menu. Default is `true`. Set it to `false` to prevent users from modifying this setting.

> [!NOTE]
> When the column's data type is `boolean`, the `cellOverflowBehaviour` setting will be automatically overridden to `Hidden`.

<br><br>



#### 6.3.5 Column properties menu
As described in the functional documentation for this section, the table includes a button in the top-left corner by default. When clicked, this button opens the **Column properties menu**.

You can customize the column properties menu behavior through the following table options:

- **`selectorEnabled`**: *(default: `true`)*
  Controls the visibility of the top-left button.
  - `true`: Button is visible and users can open the column properties menu.
  - `false`: Button is hidden.

- **`selectorIcon`**: *(default: PrimeNG icon `pi pi-pen-to-square`)*
  Specifies the icon displayed on the button. You can replace it with any icon from PrimeNG or other libraries such as Font Awesome or Material Icons.

<br><br>



#### 6.3.6 Resize
By default, all columns are resizable. The only exception is frozen columns, which cannot be resized.

To prevent users from resizing a specific non-frozen column, you can use the following option in the column's `ColumnAttributes` within the DTO:
- **`canBeResized`**: Defaults to `true`. If set to `true`, the column can be resized by the user. Set to `false` to disable resizing for that column.

Additionally, there is a property called `initialWidth` that can be used to set a column's initial width in pixels.

<br><br>



#### 6.3.7 Reorder
By default, all columns are reorderable, except for frozen columns which cannot be moved.

To prevent users from reordering a specific non-frozen column, use the following option in the column's `ColumnAttributes` within the DTO:
- **`canBeReordered`**: Defaults to `true`. When `true`, the user can drag and drop the column to change its position. Set to `false` to disable this functionality for that column.

<br><br>



#### 6.3.8 Frozen
Enabling a frozen column in your table that follows horizontal scrolling is straightforward.

In your column's `ColumnAttributes` within the DTO, the following properties determine the behavior of the frozen column:
- **`frozenColumnAlign`**: An enum of type `FrozenColumnAlign`, defaulting to `None`. The available values are:
  - `None`: The column will not be frozen and will not follow horizontal scrolling.
  - `Left`: The column is frozen to the left, remaining visible on the left side while the table scrolls horizontally.
  - `Right`: The column is frozen to the right, remaining visible on the right side while the table scrolls horizontally.

When a column has a `frozenColumnAlign` value other than `None`, the following rules apply:
- **`canBeResized`** is automatically overridden to `false`. Frozen columns cannot be resized.
- **`canBeReordered`** is automatically overridden to `false`. Frozen columns cannot be reordered.
- **`initialWidth`** is set to `100px` by default when freezing the column. You can adjust this value if needed by specifying an `initialWidth` greater than 0 to override this default value.

<br><br>



#### 6.3.9 Descriptions
If you want a column to include a description, it must be defined in the backend within your DTO class by modifying the column's `ColumnAttributes`. The relevant property is:
- **`columnDescription`**: Defaults to an empty string. If a value is provided, an info icon will appear in the column header. When the user hovers over this icon, a tooltip will be displayed showing the specified description in the frontend.

<br><br>



#### 6.3.10 Cell tooltip
By default, all cells (except those with a `boolean` data type) display a tooltip with their value when the user hovers over the cell.

If you want to disable this behavior, or display a tooltip based on a different column, you can configure the following properties in the `ColumnAttributes` of your DTO class:
- **`dataTooltipShow`**: Defaults to `true`. When set to `false`, no tooltip will be displayed when the user hovers over a cell in that column.
- **`dataTooltipCustomColumnSource`**: Defaults to an empty string. Allows you to map the tooltip content to another column.

Using `dataTooltipCustomColumnSource` to reference a column with `sendColumnAttributes` set to `false` can be particularly useful, since this ensures data is always available in the frontend for tooltips, even if it is not directly displayed in the table.

> [!IMPORTANT]
> The column referenced in `dataTooltipCustomColumnSource` must have the same name as the property in the class.
> The first character may be uppercase or lowercase, since it will automatically be converted to lowercase for the frontend.

<br><br>



#### 6.3.11 Sorting
All columns in the table (except for the actions column and the row selector column) can be sorted by the user.

To disable sorting for a specific column, configure it in the backend by modifying the column's `ColumnAttributes` in your DTO class:
- **`canBeSorted`**: Defaults to `true`. When set to `false`, the column cannot be sorted by the user.

You can also define a default sorting order that will be applied when the user has not set any sort.

To do so, you must create **two lists of the same length**:
- A list of column names (as strings), where each name matches the property name of your DTO class.
- A list of sort orders (using the `ColumnSort` enum provided by the **ECS PrimeNG table**) corresponding to each column.

Both lists must then be passed as arguments to `EcsPrimengTableService.PerformDynamicQuery` in your service and the sorting will be applied in the order of your lists.

An example of a service applying default sorting to `Age` and `EmploymentStatusName`, one in descending order and the other one in ascending order would look like this:  
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
            return (true,EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), null, columnsToOrderByDefault, columnsToOrderByOrderDefault);
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
> Both default sort lists must have the same length.

In the frontend, you have two configuration options related to sorting. Inside the `header` entry of your component’s variable that holds the `ITableOptions`, the following properties are available:
- **`clearSortsEnabled`**: Defaults to `true`. When set to `false`, the **clear sorts** button will be hidden.
- **`clearSortsIcon`**: Allows customization of the **clear sorts** button icon. By default, it uses `pi pi-sort-alt-slash` from the PrimeNG icon library. You may use any other icons from PrimeNG or third-party providers such as Material Icons or Font Awesome.

<br><br>



#### 6.3.12 Filtering
All columns in the table (except for the actions column) can be filtered by the user.

To disable filtering for a specific column, configure it in the backend using the column's `ColumnAttributes`:
- **`canBeFiltered`**: Defaults to `true`. When set to `false`, the filter option will not be available for that column.

In the frontend, two configuration options related to filtering are available under the `header` entry of your component’s variable that holds the `ITableOptions`:
- **`clearFiltersEnabled`**: Defaults to `true`. When set to `false`, the **clear filters** button will be hidden.
- **`clearFiltersIcon`**: Allows customization of the **clear filters** button icon. By default, it uses `pi pi-filter-slash` from the PrimeNG icon library. Other icons from PrimeNG or third-party libraries (e.g., Material Icons, Font Awesome) may also be used.

> [!TIP]  
> The filter menu displayed depends on the data type configured for the property in your DTO class on the backend.

<br><br>



#### 6.3.13 Predefined filters
> [!CAUTION]  
> Do not use this feature on columns that may contain a large number of distinct values, as it could lead to performance issues. This feature is intended for columns with a small, limited set of values.

In some scenarios, you may want to restrict the available filter options for a column to a predefined list of possible values.

There are two strategies for defining predefined filters:
- **Hardcoding the list in the frontend**: Suitable when you have a small, fixed list of values (e.g., `"Open"`, `"Closed"`).
- **Fetching the list from the backend**: The frontend can call an endpoint before loading the table. The table supports a **deferred startup process**, ensuring it doesn’t attempt to load data until these values are ready (see the *Deferred startup* section).

Regardless of the strategy, predefined filters must first be defined in the TypeScript of your component. To do this, create a dictionary and provide the required number of predefined lists to be used.

> [!NOTE]
> If a column can contain `null` values, you do **not** need to add `null` to the `IPredefinedFilter` array. The table will simply render no option for null values.

> [!NOTE]  
> The tooltip for a predefined value will display the content of its `value` property.

> [!NOTE]  
> If you are using the data type `List`, it will render each possible value separated with ";".

> [!TIP]
> A single element of the `IPredefinedFilter` array can use multiple representations at the same time (for example, combining an icon with text). You can also mix different representations within the same array: one value could be displayed with an icon, while another could be shown as a tag. 

**_Example_**

Managing two predefined filter lists in the same table (assuming the component is named `Home` and is a standalone component):
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

At this point, the table has two predefined filter lists available: `nameOfList1` and `nameOfList2`.

To associate columns with the predefined lists, configure them in the DTO using `ColumnAttributes`:
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

The value of `filterPredefinedValuesName` must match the dictionary key created in the frontend component.

Once this is done, predefined filters will work as soon as you populate them with data.

For the table to match cell values with predefined filter options, the value returned by the backend for a cell must match the `value` property of one of the items in the `IPredefinedFilter` array.

The next sections describe the different representations of a predefined filter, which must be configured when populating the `IPredefinedFilter` list.

If filtering is enabled in a column where a predefined filter has been configured, when the user presses the filter button a modal will appear showing the available options. The user can select one or more values, and a search bar will also be available for convenience.

<br><br>



##### Plain text
To display an element as plain text in a predefined filter, you need to define in each `IPredefinedFilter` entry at least these properties:
- **`value`**: Must match the underlying value of the cell, so that the table can map it properly.
- **`name`**: The text shown in the cell.
- **`displayName`**: Set to `true` so the value in `name` is actually displayed.

**_Example_**

Suppose you have the following possible values in a column that you wish to represent as plain text:
- Ok
- Warning
- Critical

Your `IPredefinedFilter` list in TypeScript could look like this:
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
        displayName: true
    }
];
```

> [!IMPORTANT]
> It is recommended in this scenario that in the `IPredefinedFilter` array, the properties **`value`** and **`name`** contain the same text.
> This ensures that the **global filter** works as expected, since the UI displays the `name` but the global filter internally uses the `value`.

<br><br>



##### Tag
To display an element as a tag in a predefined filter, you need to define in each `IPredefinedFilter` entry at least these properties:
- **`value`**: Must match the underlying value of the cell, so that the table can map it properly.
- **`name`**: The text shown in the tag.
- **`displayTag`**: Set to `true` so the a tag is displayed containing as text `name`.
- **`tagStyle`** *(optional)*: If you want to apply a style to the tag, like for example, changing its color.

**_Example_**

Suppose you have the following possible values in a column that you wish to represent in a tag with the following colors:
- Ok → green
- Warning → orange
- Critical → red

Your `IPredefinedFilter` list in TypeScript could look like this:
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
            background: 'rgb(255, 0, 0)'
        }
    }
];
```

> [!IMPORTANT]
> It is recommended in this scenario that in the `IPredefinedFilter` array, the properties **`value`** and **`name`** contain the same text.
> This ensures that the **global filter** works as expected, since the UI displays the `name` but the global filter internally uses the `value`.

<br><br>


##### Icon
To display an element as an icon in a predefined filter, you need to define in each `IPredefinedFilter` entry at least these properties:
- **`value`**: Must match the underlying value of the cell, so that the table can map it properly.
- **`icon`**: Specifies the icon to display. You can use icons from PrimeNG or other libraries, such as Font Awesome or Material Icons.
- **`iconColor`** *(optional)*: Defines the color of the icon.
- **`iconStyle`** *(optional)*: Allows you to specify additional CSS styles for the icon, such as font size.

**_Example_**

Suppose you have the following possible values in a column that you wish to represent with an icon with the following options:
- Ok → Uses `pi-check` with color green.
- Warning → Uses `pi-exclamation-triangle` with color orange.
- Critical → Uses `pi-times` with color red and a font size of size 1.5 rem.

Your `IPredefinedFilter` list in TypeScript could look like this:
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
> If you are using a PrimeNG icon, you can add `pi-spin` to make it spin (e.g., `pi pi-spin pi-spinner`).
> Note that in newer versions of PrimeNG, the spinning effect may not appear if animations are disabled in the OS or browser.

> [!IMPORTANT]  
> If a predefined filter displays only icons, it is recommended to disable the global filter for that column in your DTO class in your backend.
> This prevents the global filter from attempting to filter by a column without text, which could be confusing for users.

<br><br>


##### Image
There are three ways to display an image in a predefined filter:
- Provide the image directly through a URL.
- Pass the image as a `Blob`.
- Pass an endpoint from which the image `Blob` can be fetched.

We will now cover the three different methods.

> [!IMPORTANT]
> If a predefined filter displays only images, it is recommended to disable the global filter for that column in your DTO class in your backend.
> This prevents the global filter from attempting to filter by a column without text, which could be confusing for users.

<br>

###### Using a URL
To fetch an image from a URL, you need to define in each `IPredefinedFilter` entry at least these properties:
- **`value`**: Must match the underlying value of the cell, so that the table can map it properly.
- **`imageURL`**: The URL from which the image will be retrieved.

**_Example_**

Suppose a column can have the following states, each represented by an image:
- Ok → `https://somesite.com/imageOk.png`  
- Warning → `https://somesite.com/imageWarning.png`  
- Critical → `https://somesite.com/imageCritical.png` 

Your `IPredefinedFilter` list in TypeScript could look like this:
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

###### Using a Blob
To display an image from a Blob provided directly to the frontend, you need to define in each `IPredefinedFilter` entry at least these properties:
- **`value`**: Must match the underlying value of the cell, so that the table can map it properly.
- **`imageBlob`**: A valid image Blob (e.g., PNG, JPEG) to be displayed.

**_Example_**

Suppose a column can have the following states, each represented by a Blob variable:
- Ok → `blobOk`  
- Warning → `blobWarning`  
- Critical → `blobCritical` 

Your `IPredefinedFilter` list in TypeScript could look like this:
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

###### Fetching a Blob from an Endpoint
The **ECS PrimeNG table** supports fetching images automatically from an endpoint that returns a valid image `Blob`. Once configured, the component will request the blob, handle the response, and display the image without additional setup.

To achieve this, define the following properties in each `IPredefinedFilter` entry:  
- **`value`**: Must match the underlying value of the cell so the table can map it correctly.
- **`imageBlobSourceEndpoint`**: The backend endpoint from which the image blob will be fetched.

When the fetch process starts, a skeleton placeholder will be shown until the blob is retrieved. If the request succeeds, the table will automatically populate the `imageBlob` property of the corresponding `IPredefinedFilter` entry with the retrieved `Blob`.

If the request fails, the property **`imageBlobFetchError`** will be set to `true` for that entry, allowing you to detect and handle errors gracefully.

**_Example_**

Suppose a column can take the following states, each associated with the following endpoints to fetch an image blob:
- Ok → `https://somesite.com/api/getBlob/ok`  
- Warning → `https://somesite.com/api/getBlob/warning`  
- Critical → `https://somesite.com/api/getBlob/critical` 

Your `IPredefinedFilter` list in TypeScript could look like this:
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



##### Associating actions
A predefined filter can have an associated action so that when the user clicks on it, an action is performed.

This action will contain the row data and the information of the predefined item that has been clicked.

To associate an action to a predefined filter, you need to define in the `IPredefinedFilter` entry the following property:
- **`action`**: The action to execute when the predefined filter is clicked.

The `action` property is a function with the following signature:
```ts
action?: (rowData: any, option: IPredefinedFilter) => void;
```

This means that when the user clicks on the filter, the function will receive:
- **rowData**: The data of the row where the filter is applied.
- **option**: The complete predefined filter item that was clicked, giving you access to its name, value, style, and any other properties defined in `IPredefinedFilter`.

**_Example_**

Suppose you have the following possible values in a column that you wish to represent as plain text:
- Ok
- Warning
- Critical

And the value `Critical` has an associated action.

Your `IPredefinedFilter` list in TypeScript could look like this:
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
> Not all `IPredefinedFilter` items of the array, need to have an associated action.

<br><br>


#### 6.3.14 Initial width
You can specify an initial width for a column by configuring the following property in the `ColumnAttributes` of your DTO class:
- **`initialWidth`**: The initial width of the column in pixels.

This is **strongly recommended for frozen columns** to ensure proper alignment and prevent layout shifts.

For non-frozen columns, use it with caution: if the user can resize the column, the width saved in the view will be overridden by the `initialWidth`, which may lead to confusion.

<br><br>



### 6.4 Rows
#### 6.4.1 Single select
The **single row selection** feature uses the `RowID` column, which must be defined in the DTO class used with your table.

By default, this feature is **disabled**. To enable it, configure it from the frontend. In your component's `ITableOptions` configuration, inside the `rows` property, you can use the `singleSelector` object with the following properties:
- **`enabled`** *(Default: `false`)*: If set to `true`, users can click a row to select it. You can then subscribe to selection events to execute custom actions.
- **`metakey`** *(Default: `true`)*: When `true`, users must hold **CTRL** and click on a selected row to unselect it. When `false`, users can unselect a row simply by clicking it again.

You can subscribe to changes in row selection using the following event emitters:
- **`onRowSelect`**: Triggered when a row is selected.
- **`onRowUnselect`**: Triggered when a row is unselected.

Both emitters provide an object with the following structure:
- **`rowID`**: The unique row identifier, provided by the backend through the `RowID` property in the DTO class.
- **`rowData`**: The raw row data, containing all the columns currently available on the frontend.

> [!NOTE]
> On mobile devices (phones or tablets), the `CTRL` key configuration is ignored. Users can unselect a previously selected row by simply clicking it, as mobile devices do not have a `CTRL` key.

> [!CAUTION]
> If the default behavior (holding down `CTRL` to unselect) is enabled, repeatedly clicking the same row **without holding `CTRL`** will count as multiple selections.  
> This can cause unintended behavior if actions are triggered on each selection, so plan your row actions accordingly.

**_Example_**

For enabling the single row selector and subscribing to changes, in your desired component TypeScript file, a minimal definition should look like this (assuming the component is named `Home`):
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

And in your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions" (onRowSelect)="onRowSelect($event)" (onRowUnselect)="onRowUnselect($event)"/>
```

<br><br>



#### 6.4.2 Checkbox select
The **checkbox row selection** feature relies on the `RowID` column, which must be defined in the DTO class used with your table.

By default, this feature is **disabled**. To enable it, configure it from the frontend.

In your component's `ITableOptions` configuration, inside the `rows` property, use the `checkboxSelector` object with the following options:
- **`enabled`** *(Default: `false`)*: If `true`, a new column with checkboxes will be displayed. Users can select or unselect rows using these checkboxes. Additionally an option to filter by this column will be enabled.
- **`header`** *(Default: `"Selected"`)*: The header label for the checkbox selection column.
- **`alignmentRight`** *(Default: `false`)*: If `true`, the column will appear on the right side of the table. Otherwise, it will appear on the left.
- **`width`** *(Default: `150`)*: The fixed column width in pixels.
- **`frozen`** *(Default: `true`)*: If `true`, the column remains visible when horizontally scrolling the table.
- **`resizable`** *(Default: `false`)*: If `true`, users can resize the column.
- **`enabledCondition`**: Optional. A function that determines whether the checkbox should be enabled for a given row.
  - **`rowData`** parameter: The row data object.
  - Returns `true` if the button checkbox be enabled; `false` otherwise.

You can subscribe to changes in row checkbox selection using:
- **`onRowCheckboxChange`**: Triggered whenever a row checkbox is selected or unselected. The emitted object has the following structure:
  - **`rowID`**: The unique row identifier, provided by the backend via the `RowID` property in the DTO class.
  - **`selected`**: `true` if the row is selected, `false` if unselected.

At any time, you can access the component’s `selectedRowsCheckbox` property, which contains an array of currently selected rows (`rowID`).

> [!NOTE]
> When the checkbox selection column is aligned to the left, it will always appear **after** the action column (if the action column is also aligned left).
>
> When aligned to the right, it will always appear **before** the action column (if the action column is visible and aligned right).
>
> This behavior is consistent only if both action and checkbox row selector columns are frozen at the same time(or if they are unfrozen at the same time).

**_Example_**

To enable the checkbox row selector, subscribe to selection changes, and access the table's `selectedRowsCheckbox` property, your component TypeScript file can have a minimal setup like this (assuming the component is named `Home`):
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
        // alignmentRight: false, // Uncomment to change the location of the column
        // width: 150, // Uncomment to change column width in px
        // frozen: true, // Uncomment to change frozen status
        // resizable: false, // Uncomment to change column resize behaviour
        // enabledCondition: (rowData) => (rowData.canBeDeleted === true) // Uncomment to evaluate if the checkbox should be enabled in a row
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

And in your HTML (note the `#dt` template reference to access the table instance from TypeScript):
```html
<ecs-primeng-table #dt [tableOptions]="tableOptions" (onRowCheckboxChange)="onRowCheckboxChange($event)"/>
```

With this setup:
- The `#dt` template reference allows you to access the table component instance directly in TypeScript. You can use it to read the `selectedRowsCheckbox` array at any time. 
- The `(onRowCheckboxChange)` event binding ensures that your `onRowCheckboxChange` method is called whenever a row checkbox is selected or unselected, giving you access to the `rowID` and `selected` of the affected row.

<br><br>



#### 6.4.3 Dynamic styling
The **dynamic styling** feature allows you to customize the appearance of rows either by applying **inline styles** or by adding **CSS classes**.

Both approaches receive the `rowData` object as input, giving you access to all the values currently held in the row. This enables you to define rules based on column values and dynamically adjust the styling.

In your component's `ITableOptions` configuration, inside the `rows` property, you can define:
- **`style`**: A function that returns an object containing inline CSS styles to apply when a condition is met.
- **`class`**: A function that returns one or more CSS class names to be injected when a condition is met.

Both `style` and `class` functions are evaluated dynamically and can be updated at runtime, allowing styling rules to react to data changes.

> [!NOTE]
> The `rowData` passed to the `style` and `class` functions contains the data currently available in the frontend for the specific row being processed.

**_Example_**

Assume you have a column of type `List`, where values are stored as a semicolon-separated string (e.g., `"Full-time; Remote; Contract"`).
You want to apply:
- A specific **inline style** if the list contains the value `"Full-time"`.
- A specific **CSS class** if the list contains the value `"Unemployed"`.

Your component TypeScript file could be defined as follows (assuming the component is named `Home`):
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

And in your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

Because the class is pushing the `exampleClass`, you have to declare the CSS class at a component or global level so it can be rendered properly. Assuming you define it at a global level, your `styles.scss` could look like this:
```scss
.exampleClass {
  background-color: #ffcccc !important;
  color: #990000 !important;
  font-weight: bold !important;
}
```

<br><br>



### 6.5 Setting up row and header action buttons
#### Button definitions
Action buttons can be used either in the table header or as row action buttons. Both types of buttons share the same set of properties.

The main difference is that **row action buttons** receive the `rowData` object, which contains the data currently held in the frontend for that specific row.

The available properties are:
- **icon**: Optional. The icon to display on the button. Should be a valid icon name from PrimeNG, Material Icons, Font Awesome, or similar libraries.
- **iconPos**: Optional. The position of the icon relative to the button label. Defaults to `"left"`. Possible values: `"left"`, `"right"`, `"top"`, `"bottom"`.
- **label**: Optional. The text label displayed on the button.
- **rounded**: Optional. If `true`, the button will be round. Defaults to `false`.
- **raised**: Optional. If `true`, adds a shadow to indicate elevation. Defaults to `false`.
- **variant**: Optional. Specifies the variant of the button. Can be `null` (default), `"text"`, or `"outlined"`.
- **color**: Optional. The CSS class to apply for button styling. Example: `"p-button-success"` or `"custom-class"`.
- **style**: Optional. Additional inline CSS styles for the button.
- **visibleCondition**: Optional. A function that determines whether the button should be visible for a given row.  
  - **rowData** parameter: The row data object (null for header buttons).  
  - Returns `true` if the button should be visible; `false` otherwise.  
  - When this returns `false`, the button will not be rendered and all other conditions (`enabledCondition`, `conditionFailHide`) are ignored.
- **enabledCondition**: Optional. A function that determines whether the button should be enabled for a given row.  
  - **rowData** parameter: The row data object (null for header buttons).  
  - Returns `true` if the button should be enabled; `false` otherwise.  
  - Ignored if `visibleCondition` returns `false`.
- **conditionFailHide**: Optional. Controls behavior when `enabledCondition` returns `false`.  
  - If `true`, the button will be hidden when the condition is not met.  
  - If `false` or `undefined`, the button will remain visible but disabled.  
  - Ignored if `visibleCondition` returns `false`.
- **action**: Optional. The action to execute when the button is clicked.
  - **rowData** parameter: The row data object of the clicked row (null for header buttons).
- **tooltip**: Optional. Tooltip text to display when the user hovers over the button.

The recommended approach is to define **two separate arrays** of `ITableButton`: one for **header action buttons** and one for **row action buttons**.

- **Header action buttons**:  
  The array of `ITableButton` should be assigned to the `buttons` property inside the `header` object of your `ITableOptions` configuration.  
  These buttons are displayed in the table header and typically trigger actions that are not specific to a single row (e.g., creating a new record).

- **Row action buttons**:  
  The array of `ITableButton` should be assigned to the `buttons` property inside the `actions` object of the `rows` object in your `ITableOptions` configuration.
  These buttons are displayed for each row and can access the `rowData` of the corresponding row. They usually trigger actions that operate on that specific row (e.g., edit, delete).
  It is recommended to use the `rowID` when performing any backend actions on that record.

> [!TIP]
> Buttons added to the `ITableButton` array and passed to the table are always rendered from left to right. The first button in the array appears at the far left, while the last button appears at the far right.

> [!IMPORTANT]
> For row action buttons, if you depend on any element of the row data, remember that only data from hidden columns and columns that cannot be hidden by the user is guaranteed to be available. Do not rely on data from user-hideable columns, as it may not always be accessible in the frontend.

> [!CAUTION]
> Never assume that a button visible to the user can be safely executed based on frontend conditions alone. Always perform a final validation on the backend, because any data or state exposed in the frontend can be easily tampered with.

**_Example_**

Assume you want to have both header and row action buttons:
- **Header action buttons**:
  - A button to add a new record.
- **Row action buttons**:
  - A button to delete a record (only available to authorized users).
  - A button to edit a record.

Your component TypeScript file could be defined as follows (assuming the component is named `Home`):
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
      color: 'p-button-success',
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
      color: 'p-button-danger',
      action: (rowData) => {
        // Action to execute when clicked, only if condition evaluates to true.
        // Example: Open a confirmation modal before deleting the record.
        // Use rowData.rowID to identify the record in the backend.
      },
      enabledCondition: (rowData) => (rowData.canBeDeleted === true)
    }, {
      icon: 'pi pi-file-edit',
      tooltip: 'Edit record',
      color: 'p-button-primary',
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

And in your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



#### Row actions column
If at least one row action button is provided, an additional column will be added to the table to display these buttons. 

Some properties of this column can be customized via the `actions` object inside the `rows` object of your `ITableOptions` configuration. The available options are:
- **`header`** *(Default: `"Actions"`)*: The header label for the row actions column.
- **`alignmentRight`** *(Default: `true`)*: If `true`, the column will appear on the right side of the table. Otherwise, it will appear on the left.
- **`width`** *(Default: `150`)*: The fixed column width in pixels.
- **`frozen`** *(Default: `true`)*: If `true`, the column remains visible when horizontally scrolling the table.
- **`resizable`** *(Default: `false`)*: If `true`, users can resize the column.

> [!NOTE]
> When the row actions column is aligned to the left, it will always appear **at the beginning** of the table.
>
> When aligned to the right, it will always appear **at the end** of the table.

<br><br>



### 6.6 Configuring the global filter
#### Overview of the global filter
The **global filter** allows users to perform a `LIKE` query on every column that has this feature enabled (by default, all columns).

It automatically converts all data types into text (for example, numbers) to make them searchable. For **date** columns, an additional setup is required, although this is optional.

Columns with a boolean data type are ignored by the global filter.

Additionally, when a match is found, the global filter highlights it in yellow within the corresponding column, making it easier for the user to identify where the match occurred.

The global filter can be cleared if it contains any data, either by clicking the "X" icon on the right side of the input or by pressing the **clear filters** button (if it is enabled).

> [!NOTE]
> The global filter search is **case-insensitive**.

> [!IMPORTANT]
> While the global filter is very useful, it also has a downside.
>
> Since it performs a `LIKE` query per column (with `%` at both the start and end of the search term), this is one of the most expensive operations in SQL.
>
> The more columns that are visible (and enabled for global filtering), the longer it will take to update the displayed data when the global filter changes.

<br><br>



#### Column-level configuration
To disable the global filter per column this can be done by setting to `false` the property `canBeGlobalFiltered` in the `ColumnAttributes` of your backend DTO class

**_Example_**

Assuming your DTO class is named `TestDTO` and you want to disable global filtering for the `Username` column:
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



#### Global settings
If you wish to disable the global filter completely so it doesn't appear in the frontend, or if you want to modify the maximum length that a user can enter in the input box, it can be customized via the `globalFilter` object inside your `ITableOptions` configuration. The available options are:
- **`enabled`** *(Default: `true`)*: Enables or disables the global filter input. When set to `true`, users can search across all table columns using the global search bar. When `false`, the global search input will not be rendered.
- **`maxLength`** *(Default: `20`)*: Maximum number of characters allowed in the global filter input.

**_Example_**

Assuming you want to limit the length of your global filter to 15 characters, you can do so in your component's TypeScript file (assuming the component is named `Home`):
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

And in your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>


#### Configuring global filter for date columns
By default, date columns will not work with global filter, since they require a database function that converts dates into text using exactly the same format in which they are rendered in the frontend.

Ensuring consistency between the database transformation and the frontend rendering is critical, otherwise, users may be confused when applying the global filter to date columns.

The example project includes a SQL Server function you can use: [04 FormatDateWithCulture.sql](Database%20scripts/04%20FormatDateWithCulture.sql).

If you are working with a database engine other than SQL Server, you will need to adapt the script accordingly.

Assuming that you are using SQL Server as database engine and that you have already setup the database function described previously, you should now go to the backend and register the database function so it can be used.

We will create next to the context a new cs file that will act as an extension of the base context. We will be doing it like this to avoid EF from overwriting our changes when scaffolding, and since the context is created as partial, it can be extended with no issues.

The way to extend is as follows:
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
Here the database function is being registered inside the Entity Framework model. The method `HasDbFunction` links the SQL function `FormatDateWithCulture` to the static C# method. This way EF knows how to call the SQL Server function from LINQ. The static class `MyDBFunctions` with the `[DbFunction]` annotation works as a bridge between the C# code and the database function. The function is not executed in C#, EF translates its usage into SQL.

Once done, in your service you can pass the database function like this:  
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
            return (true,EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault);
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
In this block the `MethodInfo` of the `FormatDateWithCulture` function is obtained so it can be injected into the dynamic queries. This is necessary because the query generator (`EcsPrimengTableService.PerformDynamicQuery`) needs to know how to apply the function to date columns when using the global filter. The `MethodInfo` works as a reference to the database function that will be executed.

With this done, you will now be able to use the global filter in date data type columns.

> [!CAUTION]  
> If you are not going to use this feature, remember to disable the `canBeGlobalFiltered` in the `ColumnAttributes` of your backend DTO class for columns of type date, otherwise, even though it will not be filtered, the frontend will underline the match in the date, making it confusing for users.

<br><br>



### 6.7 Pagination properties
The **ECS PrimeNG table** manages pagination automatically. There is no need for additional frontend configuration.

The only customization available is defined in the **backend**, where you specify which page sizes are allowed for the user.

This is done in the method `EcsPrimengTableService.GetTableConfiguration`.

**_Example_**

The following minimal service configuration allows **10, 20, 30, 40 and 50 items per page**:
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
> Because the items per page internally uses byte, the max allowed items per page is 255.

<br><br>



### 6.8 Copy cell content
By default, the **copy cell content** feature is enabled.

When a user holds down the mouse on a cell for a certain duration, the cell’s content is automatically copied to the clipboard.

You can adjust this behavior or disable it completely via the `ITableOptions` configuration in your frontend component.
- **`copyToClipboardTime`**: Defines the number of seconds the user must hold the mouse button on a cell before its content is copied to the clipboard. Set to `<= 0` to turn off this feature entirely.

**_Example_**

For setting the **copy cell content** to copy after holding the mouse down for 0.8 seconds, in your desired component TypeScript file, a minimal definition should look like this (assuming the component is named `Home`):
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



### 6.9 Dynamic height
To keep the **header** and **pagination controls** fixed while enabling vertical scrolling for the table body, you can configure the scroll height through the **`verticalScroll`** object inside the `ITableOptions`.
- **`fitToContainer`** *(Default: `true`)*: When set to `true`, the height is computed dynamically based on the available container size. This is recommended when the table should automatically adjust on window resize.
- **`height`** *(Default: `0`)*: Defines a static height in pixels (`px`). This value is only used if neither `fitToContainer` nor `cssFormula` are active.
- **`cssFormula`** *(Default: `undefined`)*: Provides maximum flexibility by delegating the calculation to the browser. Accepts any valid CSS value for height, such as:  
  - A fixed value → `"500px"`
  - A CSS calculation → `"calc(100vh - 200px)"`

The precedence rules that should be taken into account:
1. If **`cssFormula`** is defined, it always takes priority.
2. If **`cssFormula`** is not defined and **`fitToContainer`** is `true`, the height is computed dynamically in TypeScript.
3. If neither of the above apply, the numeric value of **`height`** is used.

**_Example_**

To configure the table so that its height is determined by a CSS formula (e.g., `"calc(100vh - 200px)"`), you can define it in your component’s TypeScript file.

Below is a minimal example assuming the component is named `Home`:
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



### 6.10 Deferred startup
You can defer the initialization of the table by setting the **`isActive`** property to `false` in your `ITableOptions` configuration.

The **`isActive`** flag controls whether the table should fetch its column configuration and data:
- **`true`** (default): the table automatically fetches configuration and data when the component starts.
- **`false`**: the table will not perform any requests until you explicitly activate it again using the function `updateData()` of the table.

This is particularly useful if you want to delay table loading until specific conditions are met, such as retrieving some initial data that's required before the table can be shown.

**_Example_**

Assume that you want to prevent your table from fetching its configuration and data on component startup. Your component TypeScript file could be defined as follows (assuming the component is named `Home`):
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

And in your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



### 6.11 Changing the data endpoint dinamically
You can dynamically change the data source endpoint of your table by temporarily disabling it with **`isActive`** and then updating the **`urlTableData`** property in your `ITableOptions` configuration. To do so:
1. Set **`isActive`** to `false` to prevent the table from updating.
2. Update the **`urlTableData`** property with the new endpoint.
3. Wait at least one Angular cycle before reactivating the table (to allow change detection to propagate).
4. Finally, call **`updateData()`** on the table instance to fetch data from the new endpoint.

> [!IMPORTANT]  
> - If the table has already been initialized, changing **`urlTableConfiguration`** will have no effect. The **ECS PrimeNG table** only fetches configuration once during its first load.
> - This feature is intended for scenarios where the **column configuration stays the same** and only the **data source** changes.

**_Example_**

Assume that you want to update the data endpoint from your component.

If your `ITableOptions` variable is named `tableOptions` and you are using `#dt` as the template reference for the table, you could do the following: 
```ts
updateTableEndpoint(newEndpoint: string){
    this.tableOptions.isActive = false;
    this.tableOptions.urlTableData = newEndpoint;
    setTimeout(() => {
        this.dt.updateData();
    }, 1);
}
```

You can also reset filters and sorts while updating the endpoint if desired: 
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



### 6.12 Configuring Excel reports
This feature relies on [ClosedXML](https://github.com/ClosedXML/ClosedXML), so make sure you have the NuGet package installed in your backend before proceeding.

Dynamic Excel report generation allows you to export the same data displayed in your table into an `.xlsx` file, with support for user customization when generating the report.

To configure Excel reports, you need to define a new service and controller endpoint in your backend.

If you already created an `IQueryable` for obtaining the table data (used by the dynamic query), you can reuse the same query to generate the Excel file.

A typical service might look like this:
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
Just like with dynamic queries, the method `EcsPrimengTableService.GenerateExcelReport` accepts three optional arguments:
- A **database function** to format dates as strings (to ensure consistency between backend and frontend).
- A **list of default ordering columns**.
- Their **initial ordering direction** (ascending or descending).

You now need an endpoint in your controller that calls the service and returns the Excel file to the client. A minimal implementation could look like this:
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
**Technical note:**  
- The service returns the generated Excel file as a `byte[]`.
- In the controller, the `File()` method is used to return the file with the correct MIME type for Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
- Exception handling ensures that unexpected errors return a clear message with HTTP status `500`.

Once the backend endpoint is in place, the next step is configuring the frontend. At a minimum, you must provide the backend endpoint URL for Excel report generation.

Excel report behavior can be customized via the `excelReport` object inside your `ITableOptions` configuration. The available options are:
- **`url`** *(Default: `undefined`)*: Enables Excel reports by specifying the endpoint created earlier (e.g., `"Test/GenerateExcel"`).
- **`defaultTitle`** *(Default: `"Report"`)*: Defines the default report title.
- **`titleAllowUserEdit`** *(Default: `true`)*: Determines whether the user can override the title when exporting, or if the `defaultTitle` is always enforced.

Your component TypeScript might look like this: 
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

And your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

With these steps in place:
1. Backend service generates the Excel file using `ClosedXML` with the desired configurations from the user.
2. Controller endpoint exposes the file as an HTTP response.
3. Frontend is configured to use the endpoint and customize the behavior via `ITableOptions`.

This integration provides users with a seamless way to export their table data into Excel while maintaining full control over some customization options.

<br><br>



### 6.13 Setting up views
#### Generic configuration
Views allow users to persist their table configurations across sessions. This feature is disabled by default but can be enabled when needed.

There are three possible storage strategies:  
1. **Session storage** – minimal setup required.
2. **Local storage** – minimal setup required.
3. **Database storage** – requires additional backend and database configuration.

Regardless of the storage type, configuration is done via the `views` object inside your `ITableOptions`. The available options are:
- **`saveMode`** *(Default: `TableViewSaveMode.None`)*: Determines where views are stored. Possible values are:
  - **`TableViewSaveMode.None`**: Views are disabled. The view menu will not be displayed.
  - **`TableViewSaveMode.SessionStorage`**: Saves the view state in the browser’s `sessionStorage`. Data is cleared when the tab is closed. Not accessible from other devices.
  - **`TableViewSaveMode.LocalStorage`**: Saves the view state in the browser’s `localStorage`. Persists across browser sessions, but will be lost if the user clears local data. Not accessible from other devices.
  - **`TableViewSaveMode.DatabaseStorage`**: Saves the view state in a backend database. Requires extra backend/database setup but allows views to be shared across devices.
- **`saveKey`** *(Default: `undefined`)*: A unique identifier for the table. Required if views are enabled.
- **`urlGet`** *(Default: `undefined`)*: Backend endpoint for retrieving saved views (only used with `DatabaseStorage`).
- **`urlSave`** *(Default: `undefined`)*: Backend endpoint for saving views (only used with `DatabaseStorage`).

**Note:** `urlGet` and `urlSave` are ignored unless the `DatabaseStorage` mode is selected.

The **view menu will only be displayed** if:
- `saveMode` is not `None`.
- `saveKey` is defined.

An example of your component TypeScript might look like this, assuming that you want to use a `TableViewSaveMode.LocalStorage` save mode: 
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

And your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br>



#### Database persistent views
##### Database setup
To configure the database persisten views, start off by creating a table in your database to store the views. It is strongly recommended to use the demo script as a starting point: [05 SaveTableViews.sql](Database%20scripts/05%20SaveTableViews.sql).

You can adapt the SQL (for example, change the length of the `username` column or use a different data type such as a GUID). The important column semantics you need to keep are:
- **`username`**: Identifies the user who owns the view. It can be implemented using `varchar`/`nvarchar` (for textual user identifiers) or `uniqueidentifier` (if you prefer to store user IDs as GUIDs). Choose the type that matches the type used by your backend user identity.
- **`tableKey`**: Identifies the table the view belongs to. Typically a short string key that uniquely denotes the table.
- **`viewAlias`**: A name for the saved view (this is introduced by the user).
- **`viewData`**: A JSON payload containing the serialized view state (columns, filters, sorts, pagination, etc.).
- **`lastActive`**: A boolean to know if the user marked this view for being loaded in the next table init.

It is important that the combination of `username`, `tableKey` and `viewAlias` must be unique (create a unique constraint or composite unique index) so a user cannot create duplicate view names for the same table. Also consider adding appropriate indexes (for example on `username` and `tableKey`) to keep retrieval performant.

<br><br>



##### Backend setup
In the backend you need to create a model that maps to the database table used to store the views. It is recommended, especially if you are using scaffolding, to define the model class as `partial`. This way you can extend it later without modifying the generated code.

The created model class must implement `ITableViewEntity<TUsername>`, where `TUsername` represents the type you want to use for the `username` column (for example, `string` or `GUID`, depending on your database schema).

The interface has the following minimal definition that your model (and database table) must provide:
```c#
public interface ITableViewEntity<TUsername> {
    TUsername Username { get; set; }
    string TableKey { get; set; }
    string ViewAlias { get; set; }
    string ViewData { get; set; }
    public bool LastActive { get; set; }
}
```

An example of how this can be implemented, assuming that your column `username` has been defined as `nvarchar` in your database (and as `string` in your model):
```c#
public partial class TableView : ITableViewEntity<string> {
    // Inherit ITableViewEntity
}
```

Once the model is defined, you will need to start off by implementing a repository for your service. The repository that your service accesses could look like this:
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

Once the repository is done, you must implement the service to handle the logic for retrieving and storing the views. An example of your service to load and save views could be like this:
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

Finally, you must add the two endpoints to your controller that consume the previously created service:
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
> You can configure the **maximum number of views allowed per table** directly from the backend.
> 
> This is done in your **table configuration service**, when calling `EcsPrimengTableService.GetTableConfiguration`.
>
> One of its arguments defines the maximum number of views allowed.
> - If set to `null`, it will fall back to the initialization default value (**10 views**).
> - If set to a specific number, that value will override the default for that table.

<br><br>



##### Frontend setup
To configure the frontend, you need to update the `views` object inside your `ITableOptions`.  
At minimum, you must set the following options:
- **`saveMode`**: Set this to **`TableViewSaveMode.DatabaseStorage`**.
- **`saveKey`**: Define a unique key to identify the table. *(Must be unique across your application)*.
- **`urlGet`**: The endpoint URL to retrieve the list of saved views.
- **`urlSave`**: The endpoint URL to persist the views.

An example of a component TypeScript configuration might look like this:
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

And your HTML:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

<br><br><br>



---
## 7 Backend component reference
This section describes the backend utilities provided by the `ECS.PrimengTable` library.

It includes service methods, data models (DTOs), enums, interfaces and attributes used to support the ECS PrimeNG table frontend.

<br><br>



### 7.1 Services
#### 7.1.1 EcsPrimengTableService
**Namespace:** `ECS.PrimengTable.Services`  
**Accessibility:** `public`  
**Type:** `static class`

Main public entry point of the `ECS.PrimengTable` library. This class exposes all methods intended for external consumption, including table configuration, dynamic queries, user views, and Excel export.

<br><br><br>



---
## 8 Frontend component reference

<br><br><br>



---
## 9 Editing ECS PrimeNG table and integrating locally
WIP