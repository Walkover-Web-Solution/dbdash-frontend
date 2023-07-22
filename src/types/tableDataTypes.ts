export interface TableColumType {
  title?: string;
  id: string;
  dataType: string;
  hasMenu?: boolean;
  metadata: MetaDataMapping;
  width?: number;
  options?: Array<any>;
  label?: string;
  accessor?: string;
  created?: any;
}

export interface MetaDataMapping {
  unique: boolean;
  hide: boolean;
  option?: Array<string> | Array<ValueAndColorMapping>;
  isLookup?: boolean;
  query?: string;
  isAllHide?: boolean;
}
export interface ValueAndColorMapping {
  color: string;
  value: string;
}
export interface TableDataFieldMapping {
  [tableId: string]: number | string;
}

export interface TableDataType {
  columns: Array<TableColumType>;
  data: Array<TableDataFieldMapping>;
  tableId: string;
  dbId: String | null;
  status?: String;
  pageNo: number;
  isTableLoading?: boolean;
  isMoreData: boolean;
  filterId: String | null;
  name?: String;
  skipReset?: any;
  offset?: boolean;
  rows?: any;
}
export interface UpdatecellbeforeapiPayload {
  payload: {
    updatedvalue: { where: string; fields: string };
    rowIndex: number;
    row: { [fieldId: string]: any };
  };
}

export interface UserInfoTypes {
  _id: string;
  users: Array<{ user_id: { _id: string } }>;
}

export interface DeleteColumnsTypes {
  metaData: { isLookup: boolean };
  fieldName: string;
  dbId: string;
  tableId: string;
  filterId: string;
}
export interface FilterDataTypes {
  dbId: string;
  tableName?: string;
  fields?: any;
  pageNo?: number;
  org_id?: string;
  tableId: string;
  filterId: string;
  filter?: any;
  fieldName?: string;
  metaData?: MetaDataMapping;
  label?:string;
  fieldType?:string;
}

export interface UpdateColumnHeaderTypes{
  filterId:string;
  label:string;
  fieldType:string;
  metaData:MetaDataMapping;
  tableName:string;
  dbId:string;
  columnId:string;
  fieldName?:string;
  direction:string;
  position?:string;
  selectedFieldName?:string;
  selectedTable?:string;
  query:string;
  linkedValueName?:string;
  foreignKey?:string;
  duplicateField?:string;
  tableId:string;
  userQuery:string;
  dataTypes?:string;
  value?:string;
  rowIndex?:number;
  imageLink?:string
  updatedArray?:Array<any>;
  newData?:TableDataType;
}

export interface BulkAddColumnsTypes{
  dbId:string;
  tableName:string;
  fields?:any;
  org_id?:string;
  pageNo?:number
}