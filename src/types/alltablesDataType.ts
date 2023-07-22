
import { UsersMapping } from "./databaseDataType";


export interface AllTableDataType{
  created_by?:string
  dbId  : string;
  tables:TableDataType;
  orgId : string;
  userAcess: UserAcessType;
  userDetail: UsersMapping|{};  
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface TableDataType{
    [tableid:string]:TableTypeMapping;
}

 export interface TableTypeMapping{
    fieldIds:string[];
    fields:TableFieldsType;
    filter?:TableFiltersType;
    tableName:string;
    update_at:string
}

 export interface TableFieldsType{
    [fieldId:string]:TableFieldsMappingType
}

 export interface TableFieldsMappingType{
    fieldName:string,
    fieldType:string | number,
    metaData?:MetaDataType,
 }
 export interface MetaDataType{
    unique?:boolean;
    hide?:boolean;
    isLookup?:boolean;
    width?:number;
}

 export interface TableFiltersType{
   [filterId:string]:TableFilterMappingType

}
 export interface TableFilterMappingType{
    filterName:string;
    query?:string;
    htmlToShow?:string;
    fieldIds:string[];
    viewId?:string;
}

export interface UserAcessType{
    [UserAcessId:string]:{
        access:number;
    }

}

// export interface ActionDataType{
//     payload:
// }
export interface ActionDataType<T>{
    payload:T 
}

export interface removeDbInUserPayloadDataType{
    response:any;
    userId:string;
}

export interface RemoveTableThunkPayload{  // use the data for name change
    tableData:TableDataType;
}


export interface UpdateTableThunkPayload{
    dbId:string;
    tableName:string;
    data1:NewTableNameType;
}

export interface NewTableNameType{
    newTableName:string;
}

export interface ShareDbPayloadThunkType{
    adminId:string;
    data:DataInUserSharePayload;
    dbId:string;
    userId?:string;
}
export interface DataInUserSharePayload{
    email:string;
    userAccess:number
}