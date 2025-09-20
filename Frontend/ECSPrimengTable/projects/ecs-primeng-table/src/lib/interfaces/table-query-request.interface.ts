export interface ITableQueryRequest {
    page: number;
  
    pageSize: number;
  
    sort?: any
  
    filter: any;
  
    globalFilter?: string | null;
  
    columns?: string[];

    dateFormat: string;

    dateTimezone: string;

    dateCulture: string;
}