import { UsersMapping } from "./databaseDataType";

// Interface representing the structure of the AllTable.
export interface AllTableDataType {
  created_by?: string;
  dbId: string;
  tables: TableDataType;
  orgId: string;
  userAcess: UserAcessType;
  userDetail: UsersMapping | {};
  status?: "idle" | "loading" | "succeeded" | "failed";
}

//Interface representing the structure of all tables in the database.
export interface TableDataType {
  [tableid: string]: TableTypeMapping;
}

// Interface representing the structure of a single table in the database.
export interface TableTypeMapping {
  fieldIds: string[];
  fields: TableFieldsType;
  filter?: TableFiltersType;
  tableName: string;
  update_at: string;
}

// Interface representing the structure of all fields in a table.
export interface TableFieldsType {
  [fieldId: string]: TableFieldsMappingType;
}

// Interface representing the metadata for a field in a table.
export interface TableFieldsMappingType {
  fieldName: string;
  fieldType: string;
  metaData?: MetaDataType;
}
// Interface representing the metadata for a field in a table.
export interface MetaDataType {
  unique?: boolean;
  hide?: boolean;
  isLookup?: boolean;
  width?: number;
}
// Interface representing the filters for a table.
export interface TableFiltersType {
  [filterId: string]: TableFilterMappingType;
}

// Interface representing the structure of a single filter for a table.
export interface TableFilterMappingType {
  filterName: string;
  query?: string; 
  htmlToShow?: string;
  fieldIds: string[];
  viewId?: string;
}

// Interface representing the access level of users for different operations
export interface UserAcessType {
  [UserAcessId: string]: {
    access: number;
  };
}

// Generic interface for representing action payloads.
export interface ActionDataType<T> {
  payload: T;
}

// Interface for the payload of removing a database for a user.
export interface RemoveDbReducerPayloadType {
  response: any;
  userId: string;
}

// Interface for the payload of removing a table.
export interface RemoveTableThunkPayloadType {
  tableData: TableDataType; // Data related to the table to be removed.
}


// Interface for the payload of updating a table's name.
export interface UpdateTableThunkPayloadType {
  dbId: string;
  tableName: string;
  data1: NewTableNameType;
}

// Interface for the New Name

export interface NewTableNameType {
  newTableName: string;
}

// Interface for the payload of sharing a database with a user.
export interface ShareDbPayloadThunkType {
  adminId: string;
  data: DataInUserSharePayload;
  dbId: string;
  userId?: string;
}

// Interface for the payload of user access data when sharing a database.
export interface DataInUserSharePayload {
  email: string;
  userAccess: number;
}
