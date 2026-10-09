import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { Table, TableLazyLoadEvent, TableModule, TablePageEvent, TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { FilterMetadata } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign, TableViewSaveMode } from '../../enums';
import { IColumnMetadata, IPredefinedFilter, ITableConfiguration, ITablePagedResponse, ITableQueryRequest, IExcelExportRequest, ITableView, ITableViewData, ITableOptions, DEFAULT_TABLE_OPTIONS } from '../../interfaces';
import { dataAlignHorizontalAsText, dataAlignVerticalAsText, dataTypeAsText, frozenColumnAlignAsText } from '../../utils';
import { ECSPrimengTableNotificationService } from '../../services';
import { TableCell } from '../table-cell/table-cell';
import { TablePredefinedFilters } from '../table-predefined-filters/table-predefined-filters';
import { TableButton } from '../table-button/table-button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ColumnSelector } from "../column-selector/column-selector";
import { ExportExcel } from '../export-excel/export-excel';
import { finalize, Observable } from 'rxjs';
import { ViewsManagement } from "../views-management/views-management";

@Component({
  selector: 'ecs-primeng-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    CheckboxModule,
    PaginatorModule,
    TableCell,
    TablePredefinedFilters,
    TableButton,
    ColumnSelector,
    ExportExcel,
    ViewsManagement,
    PopoverModule,
    ButtonGroupModule
  ],
  standalone: true,
  templateUrl: './ecs-primeng-table.html',
  styleUrl: './ecs-primeng-table.scss',
  encapsulation: ViewEncapsulation.None
})
export class ECSPrimengTable implements OnInit, AfterViewInit {
  constructor(
    private tableService: ECSPrimengTableService,
    private notification: ECSPrimengTableNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() tableOptions: ITableOptions = DEFAULT_TABLE_OPTIONS;
  @Output() onRowCheckboxChange = new EventEmitter<{
    rowID: any,
    selected: boolean
  }>();
  @Output() onRowSelect = new EventEmitter<{
    rowID: any,
    rowData: any
  }>();
  @Output() onRowUnselect = new EventEmitter<{
    rowID: any,
    rowData: any
  }>();
  @Output() onDataEndUpdate = new EventEmitter<void>();

  viewsModalShow = signal<boolean>(false);
  tableViewCurrentSelectedAlias = signal<string | null>(null);
  tableViewsFirstFetchDone = signal<boolean>(false);
  excelReportTitle = signal<string>("");
  showExportModal = signal<boolean>(false);
  showColumnSelector = signal<boolean>(false);
  selectedRowsCheckbox = signal<any[]>([]);
  
  @ViewChild('dt') dt!: Table;
  
  globalSearchText = signal<string | null>(null);
  tableViewsList = signal<ITableView[]>([]);
  tableViews_menuItems = signal<any[]>([]);

  DataType = DataType;
  CellOverflowBehaviour = CellOverflowBehaviour;
  DataAlignHorizontal = DataAlignHorizontal;
  DataAlignVertical = DataAlignVertical;
  FrozenColumnAlign = FrozenColumnAlign;
  TableViewSaveMode = TableViewSaveMode;

  rowSelection: any;
  currentPage = signal<number>(0);
  currentRowsPerPage = signal<number>(0);
  allowedRowsPerPage = signal<number[]>([]);
  totalRecords = signal<number>(0);
  totalRecordsNotFiltered = signal<number>(0);

  dateFormat = signal<string>("dd-MMM-yyyy HH:mm:ss zzzz");
  dateTimezone = signal<string>("+00:00");
  dateCulture = signal<string>("en-US");
  exportDateFormat = signal<string>("dd-MMM-yyyy HH:mm:ss");

  columns = signal<IColumnMetadata[]>([]);
  columnsCantBeHidden = signal<IColumnMetadata[]>([]);
  columnsSelected = signal<IColumnMetadata[]>([]);
  columnModalData = signal<any[]>([]);
  filteredColumnData = signal<any[]>([]);

  private initialColumnWidths: any;
  private initialTableWidth: any;
  predefinedFiltersSelectedValuesCollection = signal<{ [key: string]: any[] }>({});
  private copyCellDataTimer: any;
  tableLazyLoadEventInformation: TableLazyLoadEvent = {};
  private initialConfigurationFetched: boolean = false;
  private maxViews = 0;

  ngOnInit(): void {
    this.fetchTableConfiguration();
  }

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('headerContainer', { static: false }) headerContainer!: ElementRef;
  @ViewChild('paginatorContainer', { static: false }) paginatorContainer!: ElementRef;

  ngAfterViewInit() {
    this.calculateScrollHeight();
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateScrollHeight();
  }
  
  private calculateScrollHeight(){
    if (this.tableOptions.verticalScroll?.cssFormula) {
      return;
    }
    if (this.tableOptions.verticalScroll?.fitToContainer && this.tableContainer && this.paginatorContainer && this.headerContainer) {
      const containerRect = this.tableContainer.nativeElement.getBoundingClientRect();
      const paginatorHeight = this.paginatorContainer.nativeElement.offsetHeight;
      const headerHeight = this.headerContainer.nativeElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const topOffset = containerRect.top + window.scrollY;
      this.tableOptions.verticalScroll.height = (viewportHeight - topOffset - paginatorHeight - headerHeight)-60;
      this.cdr.markForCheck();
    }
  }

  get scrollHeightValue(): string {
    if (this.tableOptions.verticalScroll?.cssFormula) {
      return this.tableOptions.verticalScroll.cssFormula;
    }
    const height = this.tableOptions.verticalScroll?.height;
    return height && height > 0 ? `${height}px` : '';
  }

  updateData(resetTableView: boolean = false): void {
    this.tableOptions.isActive = true;
    if (!this.initialConfigurationFetched || resetTableView) {
      if(this.initialConfigurationFetched && resetTableView) {
        this.resetTableView();
      } else {
        this.fetchTableConfiguration();
      }
    } else {
      this.fetchTableData(this.tableLazyLoadEventInformation);
    }
  }

  private canFetchData(): boolean {
    return !!this.tableOptions.isActive
      && !!this.tableOptions.urlTableConfiguration?.trim()
      && !!this.tableOptions.urlTableData?.trim();
  }

  private fetchTableConfiguration(resetTableView: boolean = false): void {
    if(!this.canFetchData()){
      return;
    }
    this.tableService.fetchTableConfiguration(this.tableOptions.urlTableConfiguration!).subscribe({
      next: (response: HttpResponse<ITableConfiguration>) => {
        this.handleTableConfigurationResponse(response.body!, resetTableView);
      },
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  private handleTableConfigurationResponse(body: ITableConfiguration, resetTableView: boolean = false): void {
    this.allowedRowsPerPage.set(body.allowedItemsPerPage);
    this.currentRowsPerPage.set(Math.min(...this.allowedRowsPerPage()));
    this.columns.set(body.columnsInfo);
    this.columnsCantBeHidden.set(this.columns().filter((col: any) => !col.canBeHidden));
    this.columnsSelected.set(this.columns().filter((col: any) => !col.startHidden && col.canBeHidden));
    this.tableOptions.columns!.shown = this.tableService.orderColumnsWithFrozens(this.columnsCantBeHidden().concat(this.columnsSelected()));
    this.dateFormat.set(body.dateFormat);
    this.dateTimezone.set(body.dateTimezone);
    this.dateCulture.set(body.dateCulture);
    this.exportDateFormat.set(body.exportDateFormat);
    this.currentPage.set(0);
    this.initialConfigurationFetched = true;
    this.maxViews = body.maxViews;

    if(resetTableView){
      this.tableOptions.isActive = false;
      this.clearFilters(this.dt, true);
      this.clearSorts(this.dt, true);
      this.dt.tableWidthState = this.initialTableWidth;
      this.dt.columnWidthsState = this.initialColumnWidths;
      this.dt.restoreColumnWidths();
      this.tableLazyLoadEventInformation.multiSortMeta = [];
      this.tableOptions.isActive = true;
    } else {
      setTimeout(() => {
        this.initialColumnWidths = this.tableService.computeColumnWidths(this.dt);
        this.initialTableWidth = this.tableService.computeTableWidth(this.dt);
      }, 0);
      this.fetchTableViews();
    }
    this.cdr.markForCheck();
  }

  refreshData(event: any){
    this.fetchTableData(this.tableLazyLoadEventInformation);
  }

  tableViewsEnabled(): boolean {
    const views = this.tableOptions.views;
    if (views?.saveMode === TableViewSaveMode.None) {
      return false;
    }
    if (!views?.saveKey?.trim()) {
      return false;
    }
    if (this.maxViews <= 0) {
      return false;
    }
    if (views?.saveMode === TableViewSaveMode.DatabaseStorage) {
      if (!views?.urlGet?.trim() || !views?.urlSave?.trim()) {
        return false;
      }
    }
    return true;
  }

  private fetchTableViews(): void {
    if(!this.tableViewsEnabled()){
      this.fetchTableData(this.tableLazyLoadEventInformation);
      return;
    }
    const tableViews = this.tableService.fetchTableViews(this.tableOptions.views!.saveMode!, this.tableOptions.views!.urlGet!, this.tableOptions.views!.saveKey!);
    if (tableViews instanceof Observable) {
      tableViews.subscribe({
        next: (response: HttpResponse<ITableView[]>) => {
           let parsedResult = response.body!.map((item: any) => ({
            viewAlias: item.viewAlias,
            viewData: JSON.parse(item.viewData),
            lastActive: item.lastActive
          }));
          this.tableViewListProcess(parsedResult);
        },
        error: (err) => this.tableService.handleTableError(err, 'Views get error')
      });
    } else {
        this.tableViewListProcess(tableViews);
    }
  }

  private tableViewListProcess(tableViews: ITableView[]){
    this.tableViewsList.set([...tableViews]);
    if(this.tableViewsList().length > 0){
      this.tableService.sortViews(this.tableViewsList());
    }
    this.tableViews_menuItems.set([...this.tableService.updateViewsMenuItems(this.tableViewsList())]);
    const viewToStartup: ITableView | undefined = this.tableViewsList().find(v => v.lastActive);
    if (viewToStartup) {
      this.viewLoad(viewToStartup.viewAlias);
    } else {
      this.fetchTableData(this.tableLazyLoadEventInformation);
    }
  }

  viewLoad(tableViewAlias: string): void {
    const viewToLoad: ITableView | undefined = this.tableViewsList().find(v => v.viewAlias === tableViewAlias);
    if(!viewToLoad){
      this.notification.showToast("error","VIEW TO LOAD DOESN'T EXIST","The view to load doesn't exist");
      return;
    }
    let viewData: ITableViewData = viewToLoad.viewData;
    this.columnsSelected.set(viewData.columnsShown
        .map(data => this.columns().find((col: any) => col.field === data.field))
        .filter((col): col is IColumnMetadata => col !== undefined)
        .filter(col => !this.columnsCantBeHidden().includes(col)));
    this.tableOptions.columns!.shown = this.tableService.orderColumnsWithFrozens(this.columnsCantBeHidden().concat(this.columnsSelected()));
    this.currentPage.set(viewData.currentPage);
    this.currentRowsPerPage.set(viewData.currentRowsPerPage);
    this.globalSearchText.set(viewData.globalSearchText);
    this.tableLazyLoadEventInformation.multiSortMeta = [...(viewData.multiSortMeta ?? [])];
    this.dt.multiSortMeta = [...(viewData.multiSortMeta ?? [])];
    this.tableOptions.isActive = false;
    this.dt.sortMultiple();
    this.tableOptions.isActive = true;
    this.tableLazyLoadEventInformation.filters = structuredClone(viewData.filters);
    this.dt.filters = structuredClone(viewData.filters);
    
    const newPredefinedColMap: { [key: string]: any[] } = {};
    for (const [filterKey, filterDataArrayRaw] of Object.entries(viewData.filters)) {
      const filterDataArray = filterDataArrayRaw as Array<{ value: any; matchMode?: string; operator?: string }>;
      const filterData = filterDataArray?.[0];
      if (!filterData || !filterData.value) { 
        continue;
      }
      const column = this.columns()?.find((c: any) => c.field === filterKey);
      if (!column || !column.filterPredefinedValuesName){
        continue;
      }
      const predefinedKey = column.filterPredefinedValuesName;
      const predefinedOptions = this.tableOptions.predefinedFilters?.[predefinedKey] ?? [];
      const selectedItems = predefinedOptions.filter(opt =>
        Array.isArray(filterData.value)
          ? filterData.value.includes(opt.value)
          : filterData.value === opt.value
      );
      newPredefinedColMap[predefinedKey] = selectedItems;
    }
    this.predefinedFiltersSelectedValuesCollection.set(newPredefinedColMap);

    this.dt.tableWidthState = viewData.tableWidth;
    this.dt.columnWidthsState = viewData.columnsWidth;
    this.tableViewCurrentSelectedAlias.set(tableViewAlias);
    this.notification.showToast("info","TABLE VIEW RESTORED",`The table view '${this.tableViewCurrentSelectedAlias()}' has been restored.`);
    this.viewsModalShow.set(false);
    this.cdr.markForCheck();
    this.fetchTableData(this.tableLazyLoadEventInformation);
  }

  viewCreate(viewAlias: string){
    if(this.tableViewsList().length >= this.maxViews){
      this.notification.showToast("error","NO MORE VIEWS ALLOWED","You have created the maximum number of allowed views for this table");
      return;
    }
    let viewData: ITableViewData = this.tableService.viewGenerateData(this.dt, this.globalSearchText(), this.currentPage(), this.currentRowsPerPage(), this.modifyFiltersWithoutGlobalAndSelectedRows.bind(this));
    let newView: ITableView = {
      lastActive: false,
      viewAlias: viewAlias,
      viewData: viewData
    };
    this.tableViewsList.update(list => [...list, newView]);
    this.tableService.sortViews(this.tableViewsList());
    this.tableViews_menuItems.set([...this.tableService.updateViewsMenuItems(this.tableViewsList())]);
    this.tableViewCurrentSelectedAlias.set(viewAlias);
    this.viewsSave(0);
  }

  viewDelete(viewAlias: string){
    const index = this.tableViewsList().findIndex(v => v.viewAlias === viewAlias);
    if (index === -1) {
      this.notification.showToast("error","Table view delete failed", `The table view could not be deleted since it was not found.`);
      return;
    }
    this.tableViewsList.update(list => list.filter((_, i) => i !== index));
    this.tableViews_menuItems.set([...this.tableService.updateViewsMenuItems(this.tableViewsList())]);
    if(this.tableViewCurrentSelectedAlias() === viewAlias){
      this.tableViewCurrentSelectedAlias.set(null);
    }
    this.viewsSave(3);
  }

  viewEditAlias(event: { viewAliasOld: string; viewAliasNew: string }){
    const index = this.tableViewsList().findIndex(v => v.viewAlias === event.viewAliasOld);
    if (index === -1) {
      this.notification.showToast("error","Table view alias change failed", `The table view alias could not be changed since it was not found.`);
      return;
    }
    this.tableViewsList.update(list => {
      list[index].viewAlias = event.viewAliasNew;
      return [...list];
    });
    this.tableService.sortViews(this.tableViewsList());
    this.tableViews_menuItems.set([...this.tableService.updateViewsMenuItems(this.tableViewsList())]);
    if(this.tableViewCurrentSelectedAlias() === event.viewAliasOld){
      this.tableViewCurrentSelectedAlias.set(event.viewAliasNew);
    }
    this.viewsSave(2);
  }

  viewUpdateData(viewAlias: string){
    const index = this.tableViewsList().findIndex(v => v.viewAlias === viewAlias);
    if (index === -1) {
      this.notification.showToast("error","Table view not found", `The table view to update data from was not found.`);
      return;
    }
    let viewData: ITableViewData = this.tableService.viewGenerateData(this.dt, this.globalSearchText(), this.currentPage(), this.currentRowsPerPage(), this.modifyFiltersWithoutGlobalAndSelectedRows.bind(this));
    this.tableViewsList.update(list => {
      list[index].viewData = viewData;
      return [...list];
    });
    this.viewsSave(1);
  }

  viewUpdateActiveStartup(viewAlias: string){
    const index = this.tableViewsList().findIndex(v => v.viewAlias === viewAlias);
    if (index === -1) {
      this.notification.showToast("error","Table view not found", `The table view to update data from was not found.`);
      return;
    }
    let newStatus: boolean = !this.tableViewsList()[index].lastActive;
    this.tableViewsList.update(list => {
      list.forEach(v => v.lastActive = false);
      list[index].lastActive = newStatus;
      return [...list];
    });
    this.tableViews_menuItems.set([...this.tableService.updateViewsMenuItems(this.tableViewsList())]);
    this.viewsSave(4);
  }

  viewsSave(endMessage: number): void{
    let tableView: string = JSON.stringify(this.tableViewsList());
    switch(this.tableOptions.views!.saveMode){
      case TableViewSaveMode.SessionStorage:
        sessionStorage.setItem(this.tableOptions.views!.saveKey!, tableView);
      break;
      case TableViewSaveMode.LocalStorage:
        localStorage.setItem(this.tableOptions.views!.saveKey!, tableView);
      break;
      case TableViewSaveMode.DatabaseStorage:
        const saveObsv = this.tableService.viewsSaveToDatabase(this.tableViewsList(), this.tableOptions.views!.urlSave!, this.tableOptions.views!.saveKey!);
        saveObsv.subscribe({
          next: () => {
            this.viewsSaveEnd(endMessage);
          },
          error: (err) => this.tableService.handleTableError(err, 'Views save error')
        });
      return;
      default:
        this.notification.showToast("error","NOT IMPLEMENTED", "This type os save view has not been implemented yet.");
        return;
    }
    this.viewsSaveEnd(endMessage);
  }

  viewsSaveEnd(endMessage: number){
    switch(endMessage){
      case 0:
        this.notification.showToast("info","Table view created", `New table view has been created.`);
        this.viewsModalShow.set(false);
        break;
      case 1:
        this.notification.showToast("info","Table view data updated", `The table view data was updated.`);
        break;
      case 2:
        this.notification.showToast("info","Table view name updated", `The table view alias was updated.`);
        break;
      case 3:
        this.notification.showToast("info","Table view delete", `The table view was deleted.`);
        break;
      case 4:
        this.notification.showToast("info","Table view active on startup", `Changed the view that will be active on startup.`);
        break;
    }
  }

  fetchTableData(event: TableLazyLoadEvent): void {
    if(!this.canFetchData()){
      return;
    }
    if (!this.initialConfigurationFetched) {
      return;
    }
    this.tableLazyLoadEventInformation = event;
    if (event.rows != null && event.rows !== undefined) {
      this.currentRowsPerPage.set(event.rows);
    }
    if (event.first != null && event.first !== undefined && event.rows != null && event.rows !== undefined) {
      this.currentPage.set(event.first / event.rows);
    }
    let filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(this.tableLazyLoadEventInformation.filters);
    filtersWithoutGlobalAndSelectedRows = this.revertDateTimeZoneFilters(filtersWithoutGlobalAndSelectedRows);
    const requestData: ITableQueryRequest = {
      page: this.currentPage(),
      pageSize: this.currentRowsPerPage(),
      sort: this.tableLazyLoadEventInformation.multiSortMeta,
      filter: filtersWithoutGlobalAndSelectedRows,
      globalFilter: this.globalSearchText(),
      columns: this.tableOptions.columns!.shown!.map(col => col.field),
      dateFormat: this.dateFormat(),
      dateTimezone: this.dateTimezone(),
      dateCulture: this.dateCulture(),
      exportDateFormat: this.exportDateFormat()
    };
    this.tableService.fetchTableData(this.tableOptions.urlTableData!, requestData)
      .pipe(
        finalize(() => {
          this.onDataEndUpdate.emit();
        })
      )
      .subscribe({
        next: (response: HttpResponse<ITablePagedResponse>) => this.handleTableDataResponse(response.body!),
        error: (err) => this.tableService.handleTableError(err, 'Columns Error')
      });
  }

  modifyFiltersWithoutGlobalAndSelectedRows(filters: any, overrideOption: number = -1): any {
    if (this.globalSearchText() === "") {
      this.globalSearchText.set(null);
    }
    let filtersWithoutGlobalAndSelectedRows = { ...filters };
    if (filtersWithoutGlobalAndSelectedRows.hasOwnProperty('global')) {
      delete filtersWithoutGlobalAndSelectedRows['global'];
    }
    this.selectorRowFilterBuilder(filtersWithoutGlobalAndSelectedRows, overrideOption);
    return filtersWithoutGlobalAndSelectedRows;
  }

  resetTableView(): void {
    this.tableViewCurrentSelectedAlias.set('');
    this.fetchTableConfiguration(true);
  }

  private selectorRowFilterBuilder(filtersWithoutGlobalAndSelectedRows: any, overrideOption: number = -1): void {
    if (filtersWithoutGlobalAndSelectedRows.hasOwnProperty('selector')) {
      const selectorFilter = filtersWithoutGlobalAndSelectedRows['selector'][0];
      let filterType: boolean | null = null;
      if(overrideOption < 0 || overrideOption > 2){
        filterType = selectorFilter.value;
      } else {
        switch (overrideOption){
          case 0:
            filterType = null;
            break;
          case 1:
            filterType = true;
            break;
          case 2:
            filterType = false;
            break;
        }
      }
      if (!filtersWithoutGlobalAndSelectedRows.hasOwnProperty('rowID')) {
          filtersWithoutGlobalAndSelectedRows['rowID'] = [              {                  "value": null,                  "matchMode": "in",                  "operator": "or"              }          ];
      }
      const idFilter = filtersWithoutGlobalAndSelectedRows['rowID'][0];
      if (filterType === true) {
          idFilter.matchMode = "in";
          idFilter.value = this.selectedRowsCheckbox();
      } else if (filterType === false) {
          idFilter.operator = "and";
          idFilter.matchMode = "notIn";
          idFilter.value = this.selectedRowsCheckbox();
      } else if (filterType === null) {
          idFilter.value = null;
          idFilter.matchMode = "in";
      }
    }
  }

  revertDateTimeZoneFilters(inputFilter: any){
    this.tableOptions.columns!.shown!.forEach((column) => {
      if (column.dataType === DataType.Date) {
        if (inputFilter.hasOwnProperty(column.field)) {
          const originalDate = inputFilter[column.field][0].value;
          if(originalDate !== null && originalDate instanceof Date){
            const utcDate = new Date(Date.UTC(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate()));
            inputFilter[column.field][0].value = utcDate;
          }
        }
      }
    });
    return inputFilter;
  }

  handleTableDataResponse(body: ITablePagedResponse): void{
    this.tableOptions.data = body.data;
    this.totalRecords.set(body.totalRecords);
    this.totalRecordsNotFiltered.set(body.totalRecordsNotFiltered);
    this.currentPage.set(body.page);
    this.cdr.markForCheck();
  }

  clearFilters(dt: Table, force: boolean = false, onlyGlobalFilter: boolean = false): void{
    if (onlyGlobalFilter && (!this.globalSearchText() || this.globalSearchText()!.trim() === '')) {
      return;
    }
    let hasToClear = this.hasToClearFilters(dt, this.globalSearchText(), force);
    if(hasToClear){
      if(!onlyGlobalFilter){
        this.predefinedFiltersSelectedValuesCollection.set({});
        for (const key in dt.filters) {
          if (dt.filters.hasOwnProperty(key)) {
            const filters = dt.filters[key];
            if (Array.isArray(filters)) {
              filters.forEach(filter => {
                filter.value = null;
              });
            } else {
              filters.value = null;
            }
          }
        }
        let filters = {...this.dt.filters};
        dt.columns?.forEach(
          element => {
            dt.filter(null, element.field, element.matchMode);
          }
        );
        this.dt.filters = filters;
      }
      this.globalSearchText.set(null);
      dt.filterGlobal('','');
    }
  }

  clearSorts(dt: Table, force: boolean = false): void{
    let hasToClear = this.hasToClearSorts(dt, force);
    if(hasToClear){
      dt.multiSortMeta = [];
      dt.sortMultiple();
    }
  }

  hasToClearSorts(dt: Table, force: boolean = false): boolean{
    let hasToClear: boolean = false;
    const hasSorts = (dt.multiSortMeta && dt.multiSortMeta.length > 0);
    if(force || hasSorts){
      hasToClear = true;
    }
    return hasToClear;
  }

  hasToClearFilters(dt: Table, globalSearchText: string|null, force: boolean = false): boolean{
    let hasToClear: boolean = false;
    const filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(dt.filters);
    const hasFilters = this.hasFilters(filtersWithoutGlobalAndSelectedRows);
    const hasGlobalFilter = (globalSearchText && globalSearchText.trim() !== "");
    if(force || hasFilters || hasGlobalFilter){
      hasToClear = true;
    }
    return hasToClear;
  }

  private hasFilters(filterRules: any): boolean {
    for (const columnName of Object.keys(filterRules)) {
        const columnFilters = filterRules[columnName];
        for (const filterRule of columnFilters) {
            if (filterRule.value !== null && filterRule.value !== "") {
                return true;
            }
        }
    }
    return false;
  }

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    return this.tableService.getColumnStyle(col, headerCols);
  }

  getPredefinedFilterValues(columnKeyName: string): IPredefinedFilter[] {
    return this.tableOptions.predefinedFilters?.[columnKeyName] || [];
  }

  getFrozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
    return frozenColumnAlignAsText(frozenColumnAlign);
  }

  getDataTypeAsText(dataType: DataType): string {
    return dataTypeAsText(dataType);
  }

  onPredefinedFilterChange(filterName: string, selectedValues: IPredefinedFilter[]): void {
    const filters = { ...this.dt.filters };
    const newValue = selectedValues && selectedValues.length ? selectedValues.map(value => value.value) : null;
    if (Array.isArray(filters[filterName])) {
      (filters[filterName] as FilterMetadata[]).forEach(criteria => {
          criteria.value = newValue;
      });
    } else if (filters[filterName]) {
      const criteria = filters[filterName] as FilterMetadata;
      criteria.value = newValue;
    }
    this.dt.filters = filters;
    this.dt._filter();
    this.cdr.markForCheck();
  }

  getPredfinedFilterMatch(colMetadata: IColumnMetadata, value: any): any {
    if (colMetadata.filterPredefinedValuesName && colMetadata.filterPredefinedValuesName.length > 0) {
        const options = this.getPredefinedFilterValues(colMetadata.filterPredefinedValuesName);
        return options.find(option => option.value === value);
    }
    return null;
  }

  copyToClipboardStart(event: MouseEvent) {
    if((this.tableOptions.copyToClipboardTime ?? 0) > 0) {
      const cellContent = (event.target as HTMLElement).innerText;
      this.copyCellDataTimer = setTimeout(() => {
        navigator.clipboard.writeText(cellContent).then(() => {
          this.notification.clearToasts();
          this.notification.showToast("info", "CELL CONTENT COPIED", "The cell content has been copied to your clipboard.");
        }).catch(err => {
          this.notification.clearToasts();
          this.notification.showToast("error", "CELL CONTENT COPIED", `The cell content failed to copy to your clipboard with error: ${err}`);
        });
      }, (this.tableOptions.copyToClipboardTime ?? 0) * 1000 );
    }
  }

  copyToClipboardCancel(){
    if((this.tableOptions.copyToClipboardTime ?? 0) > 0) {
      clearTimeout(this.copyCellDataTimer);
    }
  }

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal){
    return dataAlignHorizontalAsText(dataAlignHorizontal);
  }

  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical){
    return dataAlignVerticalAsText(dataAlignVertical);
  }

  isRowCheckboxSelected(rowID: any): boolean {
    return this.selectedRowsCheckbox().includes(rowID);
  }

  onRowChekboxChange(event: any, rowID: any): void {
    if (event.checked) {
        this.selectedRowsCheckbox.update(list => [...list, rowID]);
    } else {
        this.selectedRowsCheckbox.update(list => list.filter(selectedId => selectedId !== rowID));
    }
    this.onRowCheckboxChange.emit({
      rowID: rowID,
      selected: event.checked
    });
  }

  rowSelect(event: TableRowSelectEvent<any>): void{
    this.onRowSelect.emit({
      rowID: event.data.rowID,
      rowData: event.data
    });
  }

  rowUnselect(event: TableRowUnSelectEvent<any>): void{
    this.onRowUnselect.emit({
      rowID: event.data.rowID,
      rowData: event.data
    });
  }

  pageChange(event: TablePageEvent): void {
    this.currentPage.set(event.rows ? event.first / event.rows : 0);
    this.currentRowsPerPage.set(event.rows ? event.rows : 0);
  }

  columnSelectorShow(){
    this.tableOptions.columns?.selectorOrderByColumnName;
    let tempData = this.columns().map(column => {
      const isSelected = this.columnsSelected().some(selectedColumn => selectedColumn.field === column.field) || this.columnsCantBeHidden().some(selectedColumn => selectedColumn.field === column.field);
      const isSelectDisabled =  this.columnsCantBeHidden().some(selectedColumn => selectedColumn.field === column.field);
      return {
        field: column.field,
        header: column.header,
        selected: isSelected,
        selectDisabled: isSelectDisabled,
        cellOverflowBehaviour: column.cellOverflowBehaviour,
        cellOverflowBehaviourDisabled: !column.cellOverflowBehaviourAllowUserEdit,
        dataAlignHorizontal: column.dataAlignHorizontal,
        dataAlignHorizontalDisabled: !column.dataAlignHorizontalAllowUserEdit,
        dataAlignVertical: column.dataAlignVertical,
        dataAlignVerticalDisabled: !column.dataAlignVerticalAllowUserEdit
      };
    });
    if (this.tableOptions.columns?.selectorOrderByColumnName === true) {
      tempData = tempData.slice().sort((a, b) => {
        return a.header.toUpperCase().localeCompare(b.header.toUpperCase());
      });
    }
    this.columnModalData.set([...tempData]);
    this.filteredColumnData.set(this.columnModalData());
    this.showColumnSelector.set(true);
  }

  applyColumnModalChanges(selectedColumns: IColumnMetadata[]) {
    const existingColumns = this.dt.columns!;
    const columnsToKeep = new Set<string>();

    this.columnsCantBeHidden().forEach(col => columnsToKeep.add(col.field));
    selectedColumns.forEach(col => columnsToKeep.add(col.field));

    const finalColumns: IColumnMetadata[] = [];
    existingColumns.forEach(col => {
      if (columnsToKeep.has(col.field)) {
        finalColumns.push(col);
      }
    });

    selectedColumns.forEach(col => {
      const matchingColumn = this.columns().find(c => c.field === col.field);
      if (matchingColumn && !finalColumns.find(c => c.field === matchingColumn.field)) {
        finalColumns.push(matchingColumn);
      }
    });

    let prevColsToShow = this.tableOptions.columns!.shown;
    this.tableOptions.columns!.shown = this.tableService.orderColumnsWithFrozens(finalColumns);

    let sameColumnsAsBefore =
      prevColsToShow!.length === this.tableOptions.columns!.shown.length &&
      prevColsToShow!.every((prevCol, index) => prevCol.field === this.tableOptions.columns!.shown![index].field);

    this.columnsSelected.set(this.tableOptions.columns!.shown.filter(
      column => !this.columnsCantBeHidden().some(nonSelectable => nonSelectable.field === column.field)
    ));

    this.updateColumnsSpecialProperties(this.columnModalData());
    this.cdr.markForCheck();
    if (!sameColumnsAsBefore) {
      this.tableOptions.isActive = false;
      this.clearSorts(this.dt, true);
      this.clearFilters(this.dt, true, false);
      setTimeout(() => {
        this.tableOptions.isActive = true;
      }, 1);
    }
  }

  private updateColumnsSpecialProperties(columnsSource: any[]){
    const allColumns = [this.columns(), this.tableOptions.columns!.shown!, this.columnsSelected(), this.columnsCantBeHidden()];
    const columnModalDataMap = new Map(columnsSource.map((item: any) => [item.field, {         cellOverflowBehaviour: item.cellOverflowBehaviour,         dataAlignHorizontal: item.dataAlignHorizontal,        dataAlignVertical: item.dataAlignVertical,        width: item.width    }]));
    const updatedFields = new Set();
    allColumns.forEach((columnList) => {
        columnList.forEach((col: any) => {
            if (columnModalDataMap.has(col.field) && !updatedFields.has(col.field)) {
                const columnData = columnModalDataMap.get(col.field);
                if (columnData) {
                    col.cellOverflowBehaviour = columnData.cellOverflowBehaviour;
                    col.dataAlignHorizontal = columnData.dataAlignHorizontal;
                    col.dataAlignVertical = columnData.dataAlignVertical;
                    col.width = columnData.width;
                    updatedFields.add(col.field);
                }
            }
        });
    });
  }

  openExcelExport(){
    const defaultTitle = this.tableOptions.excelReport?.defaultTitle?.trim();
    const allowEdit = this.tableOptions.excelReport?.titleAllowUserEdit === true;
    this.excelReportTitle.set((!defaultTitle && !allowEdit) ? 'Report' : defaultTitle!);
    this.showExportModal.set(true);
  }

  generateExcelReport(event: any){
    if(!this.tableOptions.excelReport?.url?.trim()){
      return;
    }
    let filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(this.tableLazyLoadEventInformation.filters, event.selectedRows);
    filtersWithoutGlobalAndSelectedRows = this.revertDateTimeZoneFilters(filtersWithoutGlobalAndSelectedRows);
    const filtersMustBeApplied: boolean = (event.selectedRows === 1 || event.selectedRows === 2) 
    ? true 
    : event.applyFilters;
    const requestData: IExcelExportRequest = {
      page: this.currentPage(),
      pageSize: this.currentRowsPerPage(),
      sort: this.tableLazyLoadEventInformation.multiSortMeta,
      filter: filtersWithoutGlobalAndSelectedRows,
      globalFilter: this.globalSearchText(),
      columns: this.tableOptions.columns!.shown!.map(col => col.field),
      dateFormat: this.dateFormat(),
      dateTimezone: this.dateTimezone(),
      dateCulture: this.dateCulture(),
      exportDateFormat: this.exportDateFormat(),
      allColumns: event.allColumns,
      applyFilters: filtersMustBeApplied,
      applySorts: event.applySorts,
      filename: event.filename,
      useIconInBools: event.useIconInBools
    };
    this.tableService.fetchExcelReport(this.tableOptions.excelReport.url, requestData).subscribe({
      next: (response: HttpResponse<Blob>) => {
        this.tableService.downloadFile(response.body!, event.filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.showExportModal.set(false);
      },
      error: (err) => this.tableService.handleTableError(err, 'Excel export error')
    });
  }

  updateIconBlobsForCollections(): void {
    Object.keys(this.tableOptions.predefinedFilters ?? {}).forEach(key => {
      const filters = this.tableOptions.predefinedFilters?.[key];
      if (Array.isArray(filters)  && filters.length > 0) {
        filters.forEach(filter => {
          if (filter.imageBlobSourceEndpoint && !filter.imageBlob) {
            filter.imageBlob = undefined;
            filter.imageBlobFetchError = false;
            this.tableService.getIconBlob(filter.imageBlobSourceEndpoint).subscribe({
              next: (response: HttpResponse<Blob>) => {
                filter.imageBlob = response.body!;
                this.showExportModal.set(false);
              },
              error: () => {
                filter.imageBlobFetchError = true;
              }
            });
          }
        });
      }else {
        console.warn(`Filters for key ${key} is not an array:`, filters);
      }
    });
  }
}