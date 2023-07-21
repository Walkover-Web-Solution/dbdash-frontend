export interface TableColumType {
    title: string;
    id: string;
    dataType: string;
    hasMenu: boolean;
    metadata?: {
      unique: boolean;
      hide: boolean;
      option: Array<string>;
    };
    width: number;
    options?:Array<any>
  }
  
  export interface TableDataFieldType {
    [key: string]: String | Number;
  }
  
  export interface TableDataType {
    columns: Array<TableColumType>;
    data: Array<TableDataFieldType>;
    tableId: String | null;
    dbId: String | null;
    status?: String;
    pageNo: Number;
    isTableLoading?: boolean;
    isMoreData: boolean;
    filterId: String | null;
    name?:String;
    skipReset?:any;
  }