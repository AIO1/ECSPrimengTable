export interface ITablePagedResponse {
    page: number;

    totalRecords: number;

    totalRecordsNotFiltered: number;
    
    data: any;
}