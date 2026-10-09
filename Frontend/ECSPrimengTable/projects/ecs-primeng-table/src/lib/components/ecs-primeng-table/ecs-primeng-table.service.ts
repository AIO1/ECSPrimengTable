import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '../../services';
import { IColumnMetadata, IExcelExportRequest, IPredefinedFilter, ITableConfiguration, ITablePagedResponse, ITableView, ITableViewData } from '../../interfaces';
import { CellOverflowBehaviour, FrozenColumnAlign, TableViewSaveMode } from '../../enums';
import { ITableQueryRequest } from '../../interfaces/table-query-request.interface';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { DomHandler } from 'primeng/dom';

@Injectable({
  providedIn: 'root'
})
export class ECSPrimengTableService {
  constructor(
    private http: ECSPrimengTableHttpService,
    private notification: ECSPrimengTableNotificationService
  ) {}
  
  fetchTableConfiguration(url: string): Observable<HttpResponse<ITableConfiguration>>{
      return this.http.handleHttpGetRequest<ITableConfiguration>(url);
  }
  fetchTableData(url: string, postData: ITableQueryRequest): Observable<HttpResponse<ITablePagedResponse>>{
      return this.http.handleHttpPostRequest<ITablePagedResponse>(url, postData);
  }
  fetchExcelReport(url: string, postData: IExcelExportRequest): Observable<HttpResponse<Blob>>{
    let httpOptions = new HttpHeaders({
      'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json'
    });
    return this.http.handleHttpPostRequest<Blob>(url, postData, httpOptions, "blob");
  }
  getIconBlob(url: string): Observable<HttpResponse<Blob>> {
      return this.http.handleHttpGetRequest<Blob>(url,"blob");
    }

  downloadFile(data: Blob, fileName: string, contentType: string) {
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  handleTableError(
    error: any,
    customTitle: string = 'Data Loading Error'
  ): void {
    const message = error.message || 'Unknown error occurred';
    this.notification.showToast('error', customTitle, message);
  }

  orderColumnsWithFrozens(colsToOrder: IColumnMetadata[]): IColumnMetadata[]{
    const frozenLeftColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Left);
    const frozenRightColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Right);
    const nonFrozenColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Noone);
    return [...frozenLeftColumns, ...nonFrozenColumns, ...frozenRightColumns];
  }

  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    if (action) { 
      action(rowData); 
    }
  }

  handlePredefinedFilterClick(action: (rowData: any, option: IPredefinedFilter) => void, rowData: any = null, option: IPredefinedFilter): void {
    if (action) { 
      action(rowData, option); 
    }
  }

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    let styles: Record<string, string> = {};
    if (!headerCols) {
      switch (col.cellOverflowBehaviour) {
        case CellOverflowBehaviour.Wrap:
          styles['white-space'] = 'normal';
          styles['word-wrap'] = 'break-word';
          styles['word-break'] = 'break-all';
          styles['overflow'] = 'hidden';
        break;

        case CellOverflowBehaviour.Hidden:
          default:
          styles['white-space'] = 'nowrap';
        break;
      }
    }

    if (col.initialWidth > 0) {
      const width = `${col.initialWidth}px`;
      styles['width'] = width;
      styles['min-width'] = width;
      styles['max-width'] = width;
    }

    return styles;
  }

  fetchTableViews(tableViewSaveAs: TableViewSaveMode, recoverListEndpoint: string, tableViewSaveKey: string): ITableView[] | Observable<HttpResponse<ITableView[]>>{
    let tableViewList: ITableView[] = [];
    let tableViewNotParsed: string | null = null;
    if(tableViewSaveKey !== "" && tableViewSaveKey !== ''){
        switch(tableViewSaveAs){
            case TableViewSaveMode.None:
                tableViewNotParsed = null;
            break;
            case TableViewSaveMode.SessionStorage:
                tableViewNotParsed = sessionStorage.getItem(tableViewSaveKey);
            break;
            case TableViewSaveMode.LocalStorage:
                tableViewNotParsed = localStorage.getItem(tableViewSaveKey);
            break;
            case TableViewSaveMode.DatabaseStorage:
                const postData: any = {
                    tableViewSaveKey: tableViewSaveKey
                };
                return this.http.handleHttpPostRequest<ITableView[]>(recoverListEndpoint,postData);
            default:
                this.notification.showToast("error","SAVE VIEW TYPE DOES NOT EXIST", "This type of save view does not exist.");
        }
    }
    tableViewList = tableViewNotParsed ? JSON.parse(tableViewNotParsed) : [];
    this.sortViews(tableViewList);
    return tableViewList;
  }
  sortViews(tableSaveViewList: ITableView[]): void{
      tableSaveViewList.sort((a, b) => 
          a.viewAlias.toLowerCase().localeCompare(b.viewAlias.toLowerCase())
      );
  }
  updateViewsMenuItems(tableSaveViewList: ITableView[]): MenuItem[]{
        return tableSaveViewList.map(item => ({
            label: item.viewAlias,
            lastActive: item.lastActive
        }));
    }
  viewsSaveToDatabase(tableSaveViewList: ITableView[], setListEndpoint: string, tableViewSaveKey: string): Observable<HttpResponse<any>>{
        const serializedSaveViews = tableSaveViewList.map(view => ({
            viewAlias: view.viewAlias,
            viewData: JSON.stringify(view.viewData),
            lastActive: view.lastActive
        }));
        const postData: any = {
            tableViewSaveKey: tableViewSaveKey,
            views: serializedSaveViews
        };
        return this.http.handleHttpPostRequest<any>(setListEndpoint,postData);
    }
  viewGenerateData(dt: Table, globalSearchText: string | null, currentPage: number, currentRowsPerPage: number, modifyFiltersFn: (filters: any) => any): ITableViewData{
        let colsWidth = this.computeColumnWidths(dt);
        let tableWidth = this.computeTableWidth(dt);
        const filtersWithoutGlobalAndSelectedRows = {...modifyFiltersFn(JSON.parse(JSON.stringify(dt.filters)))};
        if (filtersWithoutGlobalAndSelectedRows['rowID']) {
            filtersWithoutGlobalAndSelectedRows['rowID'][0].value = null;
        }
        if (filtersWithoutGlobalAndSelectedRows['selector']) {
            filtersWithoutGlobalAndSelectedRows['selector'][0].value = null;
        }
        const tableView: ITableViewData = {
          columnsShown: [...dt.columns!],
          multiSortMeta: dt.multiSortMeta,
          filters: {...filtersWithoutGlobalAndSelectedRows},
          globalSearchText: globalSearchText,
          currentPage: currentPage,
          currentRowsPerPage: currentRowsPerPage,
          tableWidth: tableWidth,
          columnsWidth: colsWidth
        }
        return tableView;
    }

    computeColumnWidths(dt: Table): any {
      let widths: number[] = [];
      const headers = dt.el.nativeElement.querySelectorAll('.p-datatable-thead > tr > th');
      headers.forEach((header: HTMLElement) => widths.push(DomHandler.getOuterWidth(header)));
      return widths.join(',');
    }

    computeTableWidth(dt: Table): any {
        let tableWidth = 0;
        if (dt.columnResizeMode() === 'expand') {
            const viewChildElement = dt.tableViewChild();
            if (viewChildElement) {
                tableWidth = DomHandler.getOuterWidth(viewChildElement.nativeElement);
            }
        }
        return tableWidth;
    }
}