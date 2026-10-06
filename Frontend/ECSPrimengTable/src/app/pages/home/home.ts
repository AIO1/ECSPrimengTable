import { Router } from '@angular/router';
import { NavigationDemoSettings } from './navigation-demo';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ITableButton, ECSPrimengTable, IPredefinedFilter, TableViewSaveMode, ITableOptions, createTableOptions } from 'ecs-primeng-table';
import { SharedService } from '../../core/services/shared.service';
import { IEmploymentStatus } from './employment-status.interface';

@Component({
  selector: 'ecs-home',
  imports: [
    ECSPrimengTable
  ],
  standalone: true,
  templateUrl: './home.html'
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationSettings = inject(NavigationDemoSettings);
  constructor(private readonly sharedService: SharedService){}
  @ViewChild('dt') dt!: ECSPrimengTable; // Get the reference to the object table

  headerActionButtons: ITableButton[] = [
    {
      icon: 'pi pi-plus',
      class: 'p-button-success',
      action: () => {
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
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
        this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.rowID}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
      },
      enabledCondition: (rowData) => (rowData.canBeDeleted === true)
    }, {
      icon: 'pi pi-file-edit',
      tooltip: 'Edit record',
      action: (rowData) => {
        void this.router.navigate(['/home', rowData.rowID, 'edit']);
      }
    }
  ];

  employmentStatusPredefinedFilter: IPredefinedFilter[] = []; // Contains the data for the possible employment statuses
  employmentStatusPredefinedFilterList: IPredefinedFilter[] = [];
  predefinedFiltersCollection: { [key: string]: IPredefinedFilter[] } = {
    'employmentStatusPredefinedFilter': this.employmentStatusPredefinedFilter,
    'employmentStatusPredefinedFilterList': this.employmentStatusPredefinedFilterList
  };
  tableOptions: ITableOptions = createTableOptions({
    isActive: false,
    responsive: {
      headerMenu: true,
      rowMenu: true,
      tabletMinWidth: 768,
      desktopMinWidth: 1200
    },
    urlTableConfiguration: "Test/GetTableConfiguration",
    urlTableData: "Test/GetTableData",
    excelReport: {
      url: "Test/GenerateExcel"
    },
    predefinedFilters: this.predefinedFiltersCollection,
    header: {
      buttons: this.headerActionButtons
    },
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
      },
      action: {
        buttons: this.rowActionButtons,
        width: 110
      },
      checkboxSelector: {
        enabled: true,
        width: 125
      },
      singleSelector: {
        enabled: true,
        metakey: false
      }
    },
    views: {
      saveMode: TableViewSaveMode.DatabaseStorage,
      saveKey: "TEST",
      urlGet: "Test/GetViews",
      urlSave: "Test/SaveViews"
    }
  });
  ngOnInit(): void {
    this.tableOptions.statePersistence = this.navigationSettings.persistence;
    this.getEmploymentStatus(); // Retrieve the possible employment status
  }
  private getEmploymentStatus(){
    this.sharedService.handleHttpResponse(this.sharedService.handleHttpGetRequest<IEmploymentStatus[]>(`Test/GetEmploymentStatus`)).subscribe({
      next: (responseData: IEmploymentStatus[]) => {
        responseData.forEach((data) => {
          // Create reusable filter object
          const filterItem: IPredefinedFilter = {
            value: data.statusName,
            name: data.statusName,
            displayTag: true,
            tagStyle: {
              background: `rgb(${data.colorR}, ${data.colorG}, ${data.colorB})`
            }
          };

          // Push the same object to both predefined filters
          this.employmentStatusPredefinedFilter.push({ ...filterItem });
          this.employmentStatusPredefinedFilterList.push({ ...filterItem });
        });
        this.dt.updateData();
      },
      error: err => {
        this.sharedService.dataFecthError("ERROR IN GET EMPLOYMENT STATUS", err);
      }
    });
  }
  onRowSelect(event: any){
    this.sharedService.clearToasts();
    this.sharedService.showToast("info","SELECTED A ROW",`Selected row with ID ${event.rowID}`);
  }
  onRowUnselect(event: any){
    this.sharedService.clearToasts();
    this.sharedService.showToast("info","UNSELECTED A ROW",`Unselected row with ID ${event.rowID}`);
  }
}