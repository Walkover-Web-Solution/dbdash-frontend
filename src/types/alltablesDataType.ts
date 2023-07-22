    export interface AllTableDataType{
    [tableid:string]:AllTableTypeMapping;
}
 export interface AllTableTypeMapping{
    fieldIds:string[];
    fields:AllTableFieldsTypeMapping;
    filter?:AllTableFiltersObjTypes;
    tableName:string;
    update_at:string
}
 export interface AllTableFieldsTypeMapping{
    [fieldId:string]:{
        fieldName:string,
        fieldType:string | number,
        metaData?:AllTableMetaDataObjType,
    }
}
 export interface AllTableMetaDataObjType{
    unique?:boolean;
    hide?:boolean;
    isLookup?:boolean;
    width?:number;
}

 export interface AllTableFiltersObjTypes{
   [filterId:string]:AllTableFilterObjTypes
}
 export interface AllTableFilterObjTypes{
    filterName:string;
    query?:string;
    htmlToShow?:string;
    fieldIds:string[];
    viewId?:string;
}