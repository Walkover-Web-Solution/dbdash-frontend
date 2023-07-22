export interface TableColumType {
  title?: string;
  id: string;
  dataType: string;
  hasMenu?: boolean;
  metadata: {
    unique: boolean;
    hide: boolean;
    option?: Array<string> | Array<valueAndColor>;
    
  };

  width?: number;
  options?: Array<any>;
  label?: string;
  accessor?: string;
  created?: any;
}

export interface Deb{
    unique: boolean;
    hide: boolean;
    option?: Array<string> | Array<valueAndColor>;
    
}  
export interface valueAndColor{
  color:string;
  value:string;
}
export interface TableDataFieldType {
  [key: string]: number | string;
}

export interface TableDataType {
  columns: Array<TableColumType>;
  data: Array<TableDataFieldType>;
  tableId: string;
  dbId: String | null;
  status?: String;
  pageNo: number;
  isTableLoading?: boolean;
  isMoreData: boolean;
  filterId: String | null;
  name?: String;
  skipReset?: any;
}
export interface UpdatecellbeforeapiPayload {
  payload: {
    updatedvalue: { where: string; fields: string };
    rowIndex: number;
    row: { [fieldId: string]: any };
  };
}
