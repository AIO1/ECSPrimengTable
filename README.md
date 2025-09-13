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

If you are already working on a **.NET 8 project (or higher)**, you will need to install the backend compiled package from NuGet (we recommend downloading the latest version):  
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

To install the package, open a terminal in the root folder of your project and run the following command (we recommend installing the latest version):

```sh
npm install @eternalcodestudio/primeng-table
```

In addition, make sure the following required dependencies are installed in your project:
- **@angular/common** (>=20.0.0)
- **@angular/core** (>=20.0.0)
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
> It is **not intended** to handle data currently being edited in memory on the front end and not yet saved to the database.

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

> [!TIP]
> You can combine formats in predefined filters. For example, you could display an **image** and **plain text** together.
<p align="center">
  <img width="1052" height="453" alt="Predefined filter example" src="https://github.com/user-attachments/assets/90b15f1a-c1f2-42a9-b853-83583acb26f8" />
</p>

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
- **Header title:** Default is `"Selected"`  
- **Alignment:** Default is left  
- **Width:** Default is `150px`  
- **Frozen column:** Default is `true`  
- **Resizable by user:** Default is `false`  

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
- **Icon:** You can optionally display an icon and customize its **color** and **size**. Icons can come from multiple libraries, such as **PrimeNG icons**, **Font Awesome**, **Material Icons**, etc...
- **Label:** Text to display on the button.
- **Color:** The button color.
- **Tooltip:** The text to be displayed when hovering the button.
- **Condition:** Allows disabling the button if a specific condition is not met.
- **Action:** The function or operation to execute when the button is clicked.

An example of a header action button: 
<p align="center">
  <img width="158" height="66" alt="Header action buttons" src="https://github.com/user-attachments/assets/be7cbd0a-d148-42d7-8200-98669b8c5532" />
</p>

When at least one row action button is defined, a new column automatically appears to display the buttons for each row. This column has the following customizable options:**  
- **Header title:** Default is `"Actions"`  
- **Alignment:** Default is right  
- **Width:** Default is `150px`  
- **Frozen column:** Default is `true`  
- **Resizable by user:** Default is `false`  

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



### 4.11 Excel report
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



### 4.12 Views
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
The purpose of this section is to provide a table that maps the features described earlier to their corresponding technical implementation. Use the table below as a reference to perform this mapping:

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
| Rows | [4.4.1 Single select](#441-single-select) | [6.4.1 Single select](#641-single-select) |
| Rows | [4.4.2 Checkbox select](#442-checkbox-select) | [6.4.2 Checkbox select](#642-checkbox-select) |
| Rows | [4.4.3 Dynamic styling](#443-dynamic-styling) | [6.4.3 Dynamic styling](#643-dynamic-styling) |
| Table | [4.5 Action buttons](#45-action-buttons) | [6.5 Setting up row an header action buttons](#65-setting-up-row-an-header-action-buttons) |
| Table | [4.6 Global filter](#46-global-filter) | [6.6 Configuring the global filter](#66-configuring-the-global-filter) |
| Table | [4.7 Pagination and record count](#47-pagination-and-record-count) | [6.7 Pagination properties](#67-pagination-properties) |
| Table | [4.8 Copy cell content](#48-copy-cell-content) | [6.8 Copy cell content](#68-copy-cell-content) |
| Table | [4.9 Dynamic height](#49-dynamic-height) | [6.9 Dynamic height](#69-dynamic-height) |
| Table | [4.10 Deferred startup](#410-deferred-startup) | [6.10 Deferred startup](#610-deferred-startup) |
| Excel report | [4.11 Excel report](#411-excel-report) | [6.11 Configuring Excel reports](#611-configuring-excel-reports) |
| Views | [4.12 Views](#412-views) | [6.12 Setting up views](#612-setting-up-views) |

</div>

<br><br><br>



---
## 6 Technical overview
The goal of this section is to provide a technical overview of the **ECS PrimeNG table**. It dives into the configuration options and implementation details, giving developers a clear understanding of how the table works under the hood. This section helps you grasp the mechanics, and integrate the table efficiently into your projects.

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

In this section, we will focus on creating a table that displays simple data without row actions or other advanced features.

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
From the above DTO, we have the basics for a table with three visible columns and a fourth column (`RowID`) that is hidden from end-users but available in the front-end fo us.

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

In this component, we only define the paths to your API endpoints. It is assumed that the ECS PrimeNG table component has already been provided with the base URL of your API in the http service injection.

In your component's HTML, the table can be displayed as follows:
```html
<ecs-primeng-table [tableOptions]="tableOptions"/>
```

You only need to pass the `tableOptions` property.

Once you start up your API and serve the frontend, you should be able to see the table rendered on the page if everything is set up correctly.

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

<br><br>



#### 6.3.10 Cell tooltip

<br><br>



#### 6.3.11 Sorting
> [!NOTE]
> The arguments in "PerformDynamicQuery" of "defaultSortColumnName" and "defaultSortOrder" should both have the same list length.

<br><br>



#### 6.3.12 Filtering
Take into account that the global filter is one of the most costly operations launched to the database engine, since basically it performs a LIKE = '%VALUE_PROVIDED_BY_USER%' to each column.

<br><br>



#### 6.3.13 Predefined filters

<br><br>



### 6.4 Rows
#### 6.4.1 Single select

<br><br>



#### 6.4.2 Checkbox select

<br><br>



#### 6.4.3 Dynamic styling

<br><br>



### 6.5 Setting up row an header action buttons

<br><br>



### 6.6 Configuring the global filter

<br><br>



### 6.7 Pagination properties

<br><br>



### 6.8 Copy cell content

<br><br>



### 6.9 Dynamic height

<br><br>



### 6.10 Deferred startup

<br><br>



### 6.11 Configuring Excel reports

<br><br>



### 6.12 Setting up views

<br><br><br>



---
## 7 Component reference

<br><br><br>



---
## 8 Editing ECS PrimeNG table and integrating locally









### 4.2 Date formating
From the setup steps for implementing this reusable component, you might remember that there you had to created the database function [04 FormatDateWithCulture.txt](Database%20scripts/04%20FormatDateWithCulture.txt). This is actually not needed, since its only use is for being able to use the golbal filter functionality on columns that have the date type. The global filter tries to search things as a string, so this function makes a conversion of your date to a format that matches the date as you are showing it to the user in the frontend, taking into account the date format, timezone offset and culture that you wish to use. The database function needs to be exposed in the backend (as explained in previous sections) so that when the global filter is used, this function can be called with no issues. If for any reasons you were unable to use this function, the global filtered can be disabled in the date type columns to avoid errors when filtering.


### 4.3 Declaring header and row action buttons
This component allows you to easily define buttons which can be placed on the top right header of the table or in each row of data. In your component, you should define all the buttons that you want to have as an array of IprimengActionButtons (you need different arrays for the header buttons and another one for the row buttons). The IprimengActionButtons values that can be passed are:
- **icon:** If specified, it will show a PrimeNG icon. It has the capacity to show icons from PrimeNG or from other sources like Font Awesome. If you wish to show the "pi-address-book" from PrimeNG for example, you should put: "pi pi-address-book".
- **label:** If specified, it will show a label inside the button.
- **color:** The color property to be applied. The "color" references to the "severity" property of PrimeNG for the [button](https://primeng.org/button#severity).
- **condition:** A condition that must be met in order to show the button. It can be passed a function and the expected return is a boolean. If no condition is specified, the button will always show. If the button is in a row, the data of the row can be accessed (like for example the "ID").
> [!CAUTION]
> Do NOT ever trust that if a user can press a button that should only be shown under some condition, the action should be done. Always perform an additional final validation in the backend, since the exposed data in the frontend can be easily tampered with.
- **action:** The action that the button will perform when pressed. It can be passed a function and no return value is expected. If no action is specified, the button won't do anything when pressed.
- **tooltip:** If given, it will show a tooltip when the user hovers the mouse over the button.

> [!TIP]
> Buttons that are added into the IprimengActionButtons array that are then passed to the table, will be always drawn from left to right, meaning that the first button provided in the array will be in the most left part, while the last button will be the last button in the right.

> [!IMPORTANT]  
> If the button is in a row, the data of the row can be accessed, like for example the "rowID" which is useful to perform actions or check specific conditions. There is an example on how to do it in this section later on. Remember NOT to rely on data from columns that can be hidden from the user, since if the column is hidden, you won't have the data available in the front-end (this does not apply to columns with the "sendColumnAttributes" to false, since these columns are always sent and are safe to rely on for these operations).

From the example project here is an example on how you can specify buttons that are shown in the table. From the Typescript file [home.component.ts](Frontend/primengtablereusablecomponent/src/app/components/home/home.component.ts) we can see the following code fragment:
```ts
headerActionButtons: IprimengActionButtons[] = [
    {
        icon: 'pi pi-file',
        color: 'p-button-success',
        action: () => {
            this.sharedService.clearToasts();
            this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
        },
        label: "CREATE",
        tooltip: "Create new record"
    }
];
rowActionButtons: IprimengActionButtons[] = [
    {
        icon: 'pi pi-trash',
        tooltip: 'Delete record',
        color: 'p-button-danger',
        action: (rowData) => {
            this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.rowID}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
        },
        condition: (rowData) => (rowData.canBeDeleted === true)
    }, {
        icon: 'pi pi-file-edit',
        tooltip: 'Edit record',
        color: 'p-button-primary',
        action: (rowData) => {
            this.sharedService.showToast("success","Clicked on edit row",`The record ID is\n\n${rowData.rowID}\n\nHere you could open a modal for the user to edit this record (you can retrieve data through the ID) and then call 'this.dt.updateDataExternal()' to refresh the table data.`);
        }
    }
];
```

From the above code, it can be seen that two different arrays have been created, one being "headerActionButtons" and the other one "rowActionButtons". In the header buttons we have one button that is always shown and it will execute the action of showing a toast message. In the row action buttons we have two buttons, were both will show a toast message including the "rowData.rowID" value. The delete button will be only shown under a specific condition, being "rowData.canBeDeleted === true".

Once the buttons have been defined in your component, you must pass them to the table in the HTML like so:
```html
<ecs-primeng-table #dt
    ...
    [headerActionButtons]="headerActionButtons"
    [rowActionButtons]="rowActionButtons"
    ...>
</ecs-primeng-table>
```

If at least a row action button has been provided, an additional column will be added to your table to show the row action buttons. There are some properties of this column that can be altered from their defaults through the HTML of your component, which are the following:
- **actionColumnName** (string): The title that will appear in the column header, by default is "Actions".
- **actionsColumnWidth** (number): A fixed width for this columns in pixels. By default is 150.
- **actionsColumnAligmentRight** (boolean): By default true. If true, this column will be placed at the right most part of your table. If false, it will be placed to the left of the table.
- **actionsColumnFrozen** (boolean): By default true. If true, this column will be frozen and follow the horizontal scroll if the table has a width longer than the component were it is drawn. If false, the column won't be frozen and act as a normal column.
- **actionsColumnResizable** (boolean): By default false. If false, the user can't resize the column. If true, the user will be able to resize this column.

#### 4.4.2 Subscription to changes
The table component has an output which you can subscribe to for listening to changes when a user selects or unselects a row. To do so, in your component that is using the table, you first need to create a function in yor TypeScript that will be called when a user checks a row, for example:
```ts
rowSelect($event: any){
    if($event.selected){ // If the row has been selected
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","ROW SELECT", `The row with ID ${$event.rowID} has been selected.`);
    } else { // If the row has been unselected
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","ROW UNSELECT", `The row with ID ${$event.rowID} has been unselected.`);
    }
}
```

And now in the HTML of your component, you can call it like so:
```html
<ecs-primeng-table #dt
    ...
    (selectedRowsChange)="rowSelect($event)"
    ...>
</ecs-primeng-table>
```

With this subscription to "selectedRowsChange", each time a user changes the selection of a row, the even will be emitted and the "rowSelect" function will be triggered. The event variable contains the following:
- **selected** (boolean): True if the user has selected this row or false if it has been unselected.
- **rowID** (any): The ID of the affected row.


#### 4.4.3 Accesing the table component selected rows variable
Apart from subscribing to changes, something else that you can do is accesing a variable managed by the table component that contains all the row IDs of the currently selected rows. To achieve this, assuming that you have specified an alias for the table in your component's HTML as shown in previous example (it should be "dt"), you should go to the TypeScript of your component and do the following:
```ts
import { ViewChild, ... } from '@angular/core';
import { PrimengTableComponent, ... } from '../primeng-table/primeng-table.component';

export class YourClass {
    ...
    @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table
    ...
}
```

By importing from "@angular/core" the "ViewChild", from "primeng-table.component" the "PrimengTableComponent" and calling the "ViewChild" as shown in the example, you should now be able to access the table exposed variables.

The variable that we are interested in is "selectedRows". This variable is an array that contains all the row IDs of the rows that are currently selected by the user. You could combine this with the subscription to changes shown before to, for example, log to console all the selected row IDs:
```ts
rowSelect($event: any){
    console.log(this.dt.selectedRows);
}
```

With this change in the "rowSelect" function from the "Subscription to changes" example, you can now log to console each time a user changes the selection value of a row.


### 4.5 Delay the table init or change the data endpoint dinamically
When you enter a component in your front-end that uses the table, by default, the table will fetch the columns from the configured endpoint and, if the column fetching was succesful, it will try and fetch the data afterwards. There might be scenarios were this behaviour is not ideal, since you might want to retrieve some data before the table loads. There is a way to disable the table from fetching the columns and afterwards the data upon entering a component and it can be changed in the HTML of your component that is using the table by setting the "canPerformActions" to "false" as shown below:
```html
<ecs-primeng-table #dt
    ...
    [canPerformActions]="false"
    ...>
</ecs-primeng-table>
```

With this value set to false, the table won't load anything until you explictly tell it to do so.

This will be useful for example for the predifined filters (what are predifined filters is explained in further chapters) if you want to set them up with values from your database instead of hardcoded values, or if you want to change were the data is fetched from.

In this section we will look at and example on how to change the data endpoint dinamically. To do so, we need to have a reference to the table element in the TypeScript part of your component (assuming its "dt"):
```ts
import { ViewChild, ... } from '@angular/core';
import { PrimengTableComponent, ... } from '../primeng-table/primeng-table.component';

export class YourClass {
    ...
    @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table
    ...
}
```

Imagine that at any point you wish to change the endpoint, to do so, first we need to disable the table from performing actions (so it doesn't try and download the new data), we then need to update the endpoint variable and finally we can activate the table again (after waiting at least one step). An example function to do all this could be the following:
```ts
private _updateTableEndpoint(newEndpoint: string){
    this.dt.canPerformActions = false;
    this.dt.dataSoureURL = newEndpoint;
    setTimeout(() => {
        this.dt.canPerformActions = true;
        this.dt.updateDataExternal();
    }, 1);
}
```

With this function, you will now be able to update the endpoint of the table. You could also clear all filters and sorting applied before bringing the new data making these changes to the function:
```ts
private _updateTableEndpoint(newEndpoint: string){
    this.dt.canPerformActions = false;
    this.dt.dataSoureURL = newEndpoint;
    this.dt.clearFilters(this.dt, true); // Clear all active filters
    this.dt.clearSorts(this.dt, true); // Clear all active sorts
    setTimeout(() => {
        this.dt.canPerformActions = true;
        this.dt.updateDataExternal();
    }, 1);
}
```


### 4.6 Column sorting
By default, all columns that are shown in the front-end (with the exception of the actions and row selector column) can be sorted. When a column can be sorted, a user can perform in the header a first click to sort in ascending order, and a second click in the same column to sort in descensing order.

If a different column is clicked and the first one was in ascending order, the new clicked column will be sorted in ascending order and the first one will have it sorting cleared.

The table allows a multi-sorting feature to the user were he can hold the "Ctrl" key and then click multiple column headers to perform multi-sorting.

The table includes in the top left a button for clearing all sorting that has been done to the table. This button will be only be enabled when at least one sorting made by the user is active. The following image shows were this button is located at:
<p align="center">
  <img src="https://github.com/user-attachments/assets/9b2cd936-7bd0-4054-9940-fa7dbc53a20f" alt="Clear sorting button">
</p>

If for any reason, you want to hide this button, you can do so by in in your component HTML that is using the table, setting the variable "showClearSorts" to false.
```html
<ecs-primeng-table #dt
    ...
    [showClearSorts]="false"
    ...>
</ecs-primeng-table>
```

If you wish to disable the possibility of a user sorting an specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable the sorting, in the "PrimeNGAttribute" you just have to give a value of false to "canBeSorted" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeSorted: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, when the user clicks the header of the column "Example column", the column won't be sorted. Also, the sorting icon in the column header will no longer be shown.


### 4.7 Column filter
By default all columns in the table can be filtered (except the row actions column). This feature allows the user to select in the column header the filter icon to open up a small modal were he can put what filters shall apply to the column as shown in the image below: 
<p align="center">
  <img src="https://github.com/user-attachments/assets/ef575f1b-3f0d-4bda-9825-b49c1d8ae90c" alt="Filter menu not boolean">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/99aa70bb-1988-49d8-a547-efc0334daa49" alt="Filter menu boolean">
</p>

Depending on the data type that you have configured in the backend for each column in the DTO, the filter menu will show different options.

All the filter menus, except for bool data type, show in the upper part the options "Match all" or "Match any", being the default selected "Match all". "Match all" means that only the records that match all rules specified in the column shall be reurned (the equivalent to an AND operator in SQL), where as "Match any" will lookup for any records that match any of the defined filtering rules in that column (the equivalent to an OR operator in SQL).

The user can define up to two different rules per column, except for the bool data type were he can only filter by "true", "false" or "both". Inside those rules, the user can select a different ruleset to lookup by, being the different options depending on the column data type as follows:
- **EnumDataType.Text**:
    - Starts with
    - Contains
    - Not contains
    - Ends with
    - Equals
    - Not equals
- **EnumDataType.Numeric**:
    - Equals
    - Not equals
    - Less than
    - Less than or equal to
    - Greater than
    - Greater than or equal to
- **EnumDataType.Date**:
    - Date is
    - Date is not
    - Date is before
    - Date is after
	
The date filters don't take into account the time, just the date. So for example, if the user selects to filter by "Date is" with the value "23-Sep-2024", it will return all records that have in that column a date between "23-Sep-2024 00:00:00" and "23-Sep-2024 23:59:59". The timezone conversion is already managed by the table so you don't have to worry about it, so for example, if a user is viewing the date in the timezone GMT+02:00, in UTC it will filter by "23-Sep-2024 02:00:00" and "24-Sep-2024 01:59:59".

The table includes in the top left a button for clearing all filters that has been done to the table (including the predifined filters and global filters that are explained later on). This button will be only be enabled when at least one column filter, predifined filter or global filter made by the user is active. The following image shows were this button is located at:
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6a3b33c-c03c-4ccf-8ca6-d475c74676d4" alt="Clear filters button">
</p>

If for any reason, you want to hide this button, you can do so by in in your component HTML that is using the table, setting the variable "showClearFilters" to false.
```html
<ecs-primeng-table #dt
    ...
    [showClearFilters]="false"
    ...>
</ecs-primeng-table>
```

If you wish to disable the possibility of a user filtering an specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable the filtering feature, in the "PrimeNGAttribute" you just have to give a value of false to "canBeFiltered" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeFiltered: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, the column won't no longer have in the header the filter icon.


### 4.8 Column predfined filter
You might have some scenarios were you would like to limit the filter options that the user has available to a list of the only possible values that the column could have. This reusable component offers you a way to do so. 

> [!CAUTION]
> Do not use this feature on columns were there could be lots of different values, since this could lead to performance issues. This feature is designed for columns with a small variety of values.

There are two strategies when defining the predifined filter which are:
- Hardcoding the list of possible values in the front-end. An example of this could be if you have a small list of know values like for example "Open" and "Closed".
- Fetching the list of possible values in the front-end from an endpoint of the back-end before loading the table.

No matter what of the two strategies you follow, first of all, if you want to define the predifined filters in the TypeScript of your component you must create a dictionary and provide the N amount of predifined lists that you are going to use. An example of this could be done to manage two predifined filter list in the same table is as follows:
```ts
import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';

export class YourClass {
    ...
    listOfPredifinedValues1: IPrimengPredifinedFilter[] = [];
	listOfPredifinedValues2: IPrimengPredifinedFilter[] = [];
    myPredifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {
        'nameOfList1': this.listOfPredifinedValues1,
		'nameOfList2': this.listOfPredifinedValues2
    };
    ...
}
```

And in the HTML of your component:
```html
<ecs-primeng-table #dt
    ...
    [predifinedFiltersCollection]="myPredifinedFiltersCollection"
    ...>
</ecs-primeng-table>
```

Now the table has available two lists of predifined filters that we can use which are "nameOfList1" and "nameOfList2" (although they actually don't hold any data). To map the columns to the different predfined lists that we have just setup, we need to do it in the DTO in the back-end as shown in the following code fragment:
```c#
[PrimeNGAttribute("Example column 1", filterPredifinedValuesName: "nameOfList1", ...)]
public string? Column1 { get; set; }

[PrimeNGAttribute("Example column 2", filterPredifinedValuesName: "nameOfList2", ...)]
public string? Column2 { get; set; }
```

As you can see, the "filterPredifinedValuesName" must match the name entry of the dictionary that has been created in the front-end of our component that will be using the table. With all this, technically our predfined filters should already work, but there is not much that we can do with them right now since they are both empty. You should now populate them with the corresponding value of what you want to use. The next subsections describe how you can populate a "IPrimengPredifinedFilter" array to represent your data in different ways when drawn in the table. Take into account that you can modify different ways of representing your data, for example, you can combine images with text.

For the table component being able to match the options with the cell data, the value sent by the backend for a cell, must match the "value" property of one of the items of the "IPrimengPredifinedFilter" array.

In the front-end, when the user presses the filter button in a column with predifined values, a small modal will be shown with the option to select one or more values to filter by. Additionally, the modal will include a search bar.

> [!NOTE]
> If a list of values in a column could be null, this possibility does not need to be added to the "IPrimengPredifinedFilter" array. The table won't draw any value in null values.


### 4.8.1 Column predfined filter - Simple text
Imagine that you have the following possible values in a column:
- Ok
- Warning
- Critical

If you wish to just represent them as text, your "IPrimengPredifinedFilter" list should be populated similar to the following example in your TypeScript code:
```ts
examplePredfinedFilter: IPrimengPredifinedFilter[] = [
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
> It is recommended that from the "IPrimengPredifinedFilter" array, the property of "value" and "name" match, so that the user can use the global filter, since what is displayed in the front-end is the "name", and what is used by the global filter is "value".

If from the demo project we modify the script that retrieves the values of the different employment status to be displayed as a simple text, how the table will shown them to the user is as follows:
<p align="center">
  <img src="https://github.com/user-attachments/assets/dfaf6c9b-c860-44d7-a135-e3293986bdb1" alt="Predifined filter - simple text">
</p>


### 4.8.2 Column predfined filter - Tags
Imagine that you have the following possible values in a column, that you wish to represent in a tag with the following colors:
- Ok (With a green tag)
- Warning (With an orange tag)
- Critical (With an red tag)

To achieve this your "IPrimengPredifinedFilter" list should be populated similar to the following example in your TypeScript code:
```ts
examplePredfinedFilter: IPrimengPredifinedFilter[] = [
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
            background: 'rgb(255 , 0, 0)'
        }
    }
];
```
> [!IMPORTANT]  
> It is recommended that from the "IPrimengPredifinedFilter" array, the property of "value" and "name" match, so that the user can use the global filter, since what is displayed in the front-end is the "name", and what is used by the global filter is "value".

If we launch the demo project, it already shows the column of "Employment status" as tas with different colors. Here is an example of how it looks:
<p align="center">
  <img src="https://github.com/user-attachments/assets/49d197e0-1081-455e-bb78-1172cc65e3ab" alt="Predifined filter - tags">
</p>


### 4.8.3 Column predfined filter - Icons
WIP
> [!IMPORTANT]  
> If you are just going to show icons in a predifined filter, it is strongly recommended that in the DTO in the backend you set in the column "PrimeNGAttribute" the "canBeGlobalFiltered" to "false", so that the global filter doesn't try to filter by this column that is not showing any text.


### 4.8.4 Column predfined filter - Images
WIP
> [!IMPORTANT]  
> If you are just going to show images in a predifined filter, it is strongly recommended that in the DTO in the backend you set in the column "PrimeNGAttribute" the "canBeGlobalFiltered" to "false", so that the global filter doesn't try to filter by this column that is not showing any text.


### 4.9 Global filter
The global filter is enabled by default in all columns of your table, except for bool data types and the actions column were this filter will be never applied. The global filter is located on the top right of your table headers as shown in the image below:
<p align="center">
  <img src="https://github.com/user-attachments/assets/117d4917-45fc-4330-97fd-739322a5ebf4" alt="Global filter">
</p>

When the user writes a value in the global filter text box, after a brief delay of the user not changing the value, a filter rule will be launched to the table were basically, the global filter will try to filter each individual column perfoming a LIKE '%VALUE_INTRODUCED_BY_USER%', which basically means that any match of that value introduced by the user (doesn't matter in which position of the cell) will be returned. When a value is written to the global filter, at the left of the text box an "X" icon will appear, that when pressed by the user, it will clear the global filter.

Additionally, as seen in the previous image, the global filter will underline with yellow each part of the cell were the value that is introduced by the user matches.

As in the column filter feature, the user has also the option to clear all filters by pressing the clear filters button when it is enabled (it is enabled if at least a column filter, a predifined filter or a global filter is active).

If for any reason, you want to hide the global filter search bar, you can do so by in in your component HTML that is using the table, setting the variable "globalSearchEnabled" to false.
```html
<ecs-primeng-table #dt
    ...
    [globalSearchEnabled]="false"
    ...>
</ecs-primeng-table>
```

The properties that you can modify in the HTML related to the global filter are the following:
- **globalSearchEnabled** (boolean): By default true. If true, the global search text box will be shown in the top right of your table. If false, it won't be shown.
- **globalSearchMaxLength** (number): By default 50. The maximun number of characters that the user can introduce in the global search text box.
- **globalSearchPlaceholder** (string): by default "Search keyword". This is a placeholder text shown when the user hasn't introduced any value to the global filter yet.

If you wish for a column to ignore the global filter, you can do so by modifying your DTO in the back-end. For the specific column that you wish to ignore the global filter, in the "PrimeNGAttribute" you just have to give a value of false to "canBeGlobalFiltered" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeGlobalFiltered: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, the column won't take into account any global filters that should be applied to it. For the bool data type or columns that are hidden (or that have the "sendColumnAttributes" to false), this property is always false and they will never be affected by the global filter.

> [!NOTE]  
> The global filter search is case insensitive.

> [!IMPORTANT]  
> The global filter is very useful for users, but if has a downside. Since it performs a LIKE query per column (with the % at the start and at the end) which is one of the heaviest filters to perform in SQL, the more columns that there are shown at a given time (and that can be global filtered), the more time it will require to update the data shown when the global filter is updated.

> [!CAUTION]
> For date data types to work properly using the global filter, you need to have properly setup the database function **04 FormatDateWithCulture.sql** explained in previous sections and you also need to have permission of function execution in your database for the user that is going to execute the query. This is needed because said function, transforms the date to a string that can be filtered by. If for any reason you don't want dates to be global filtered, for each individual column that is of type date, you must set in the DTO the "canBeGlobalFiltered" to "false".


### 4.10 Pagination and number of results
At the footer of the table it is included a summary of the total results, results that are currently available (taking into account the filters) and the pagination.

In the pagination, the user can change the number of rows to display per page. The list of possible values is hardcoded in the table source code in the back-end in the **PrimeNGHelper.cs**. At the start of the file there is an array of integers named "allowedItemsPerPage" that contains the different values that are shown to the user in the front-end. This values could be updated if you need to, but because of how the code of this reusable component has been created, this change will affect all your tables.

in the paginator, the user can click the arrows or select a page number to navigate between pages.

This reusable table will automatically handle all the pagination and number of results aspects for you. This includes the following scenarios:
- When loading the table, the total number of pages will be computed based on the number of records that can be shown per page. Also, the total records will be computed and shown to the user in the table footer.
- If the user applies a filter, the total number of pages could be updated. The number of total records and how many records are available taking into account the filters will be also updated. This reusable component will also take into account that if the user was for example in a page 12, and now taking into account filters there are only 5 pages available, he will be moved to page 5.
- If the user changes a page, data displayed in the table is updated.


### 4.16 Column descriptions
This feature is configurable by column. In the back-end, in your DTO, to the column that you want to add a description to, in the "PrimeNGAttribute" you just have to give a value to "columnDescription", and this value will be shown in the frontend. Thats it :D

The table will manage the rest for you. An example would be as follows:
```c#
[PrimeNGAttribute("Employment status", columnDescription: "A predifined filter that shows the employment status of the user", ...)]
public string? EmploymentStatusName { get; set; }
```

It will be shown in the frontend like this:
![image](https://github.com/user-attachments/assets/488e8fe5-2fcb-42e3-80df-73717bf11cf5)


### 4.17 Cell tooltip
By default all cells (except the bool data type) will show a tolltip with their value when the user hovers the mouse over the cell for at least 0.7 seconds. If you wish to disable this feature, in the "PrimeNGAttribute" you just have to give a value of "false" to "dataTooltipShow" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", dataTooltipShow: false, ...)]
public string? ExampleColumn { get; set; }
```

You can also customize the tooltip value that will be shown, so it matches the value of another clumn. This is usefull if you are sending a column with "sendColumnAttributes" to "false" and you wish to just display their value in the tooltip of another column. To do so, in the "PrimeNGAttribute" you need to give the name of the column (matching your DTO entry starting with a lowercase) to "dataTooltipCustomColumnSource" as shown in the next example:
```c#
[PrimeNGAttribute(sendColumnAttributes: false, ...)]
public string? TooltipSource { get; set; }

[PrimeNGAttribute("Example column", dataTooltipCustomColumnSource: "tooltipSource", ...)]
public string? ExampleColumn { get; set; }
```

In this example, when the user hovers over the cells of "ExampleColumn", the tooltip will show the data of the column "TooltipSource".

> [!CAUTION]
> The "dataTooltipCustomColumnSource" that is referenced must match the name of a column defined in the DTO starting with lowercase, since this is how it is then treated in the front-end.


### 4.18 Copy cell content
This is a feature that is enabled by default in the table. If a user has the mouse above a cell and holds the right click, after a brief delay, an informational toast message will be displayed in the top right of the screen indicating that the contents of the cell has been copied to the clipboard.

You can modify the amount of delay (which is given in seconds) or disbale this feature completely. To do so, in the HTML of your component, in the part were you are calling the table you should add the following:
```html
<ecs-primeng-table #dt
    ...
    [copyCellDataToClipboardTimeSecs]="1.5"
    ...>
</ecs-primeng-table>
```

This will modify the default value that the user need to hold down the mouse for the value of a cell to be cpied to the clipboard from 0.5 seconds to 1.5 seconds. If you put a value equal or less than 0, this feature will be disabled.