import { createAsyncThunk } from "@reduxjs/toolkit";
import { createField, deleteField, getAllfields, updateField } from "../../api/fieldApi";
import { getTable } from "../../api/tableApi";
import {insertRow} from "../../api/rowApi";
import { updateRow ,deleteRow} from "../../api/rowApi";
// reducer imports
import { addColumnToLeft, addColumnToRight, addOptionToColumn,addRow,deleteColumn,updateCell,updateColumnHeader, updateColumnType} from "./tableSlice";
import { runQueryonTable } from "../../api/filterApi";
import { allOrg } from "../database/databaseSelector";
// import { useSelector } from "react-redux";

// const alldb = useSelector((state) => selectOrgandDb(state))
const getHeaders = async(dbId,tableName) =>{
    const fields = await getAllfields(dbId,tableName);
    let columns = [
        {
            id: 9999991,
            width: 100,
            label: "check",
            disableResizing: true,
            dataType: "check",
            accessor : "check",
        },
    ]
   
   Object.entries(fields.data.data.fields).forEach( (field) =>{
       var json = {
           id: "",
        label: "",
        accessor: "",
        minWidth: 100,
        dataType: "",
        options: []
    }
    json.id = field[0];
    json.label = field[1].fieldName?.toLowerCase() || field[0]?.toLowerCase();
    
    json.accessor = field[0]?.toLowerCase() ;
    if( field[1].fieldType == "createdby" )
    json.accessor = "createdby" ;
    if( field[1].fieldType == "createdat")
    json.accessor = "createdat" ;
    // columns.push (json);
    json.dataType = field[1].fieldType?.toLowerCase();
    columns.push (json);
    }
    )
    
    columns.push({
             id: 999999,
             width: 20,
             label: "+",
             disableResizing: true,
             dataType: "null"
    })
    return columns;
}


const getRowData = async(dbId,tableName,{getState},org_id) =>{
    const data = await getTable(dbId,tableName);
    const obj = data.data.data.tableData;
    const userInfo = allOrg(getState());
    const users = userInfo.find((org)=>org?._id== org_id)?.users;
    var userJson= {};
    users?.forEach(user => {
        userJson[user.user_id._id]=user.user_id;
    });
    obj.map((row)=>{
        row.createdby = userJson[row.createdby].first_name +" " + userJson[row.createdby].last_name; 
    })
    return obj
}

export const addColumns = createAsyncThunk(
    "table/addColumns",
    async (payload,{dispatch}) =>{
        dispatch(addOptionToColumn(payload));
        return 5;
    }
) ;

export const bulkAddColumns = createAsyncThunk(
    "table/bulkAddColumns",
    async (payload,{getState}) =>{      
        if(payload.filter != null)
        {
            const querydata = await runQueryonTable(
                payload.dbId,
                payload?.filter
            )
            console.log("querydata",querydata);
            const columns =  await getHeaders(payload.dbId,payload.tableName)
            const dataa = {
                "columns":columns,
                "row":querydata.data.data,
                "tableId":payload.tableName,
                "dbId":payload.dbId
            }
            return dataa;
        }
        else{  
            const columns =  await getHeaders(payload.dbId,payload.tableName)
            // const data = await getTable(payload.dbId,payload.tableName)
            // const  s  = allOrg(getState());
            // console.log("getState",s.map((i)=>console.log(i.users[0].user_id._id )) )
            const data = await getRowData(payload.dbId,payload.tableName,{getState},payload.org_id)
            // console.log("payload",payload?.alldb)
            const dataa = {
                "columns":columns,
                "row":data,
                "tableId":payload.tableName,
                "dbId":payload.dbId
            }
            return dataa;
        }
    }
) ;

export const deleteColumns = createAsyncThunk(
    "table/deleteColumns",
    async(payload,{dispatch,getState})=>{
        await deleteField(payload?.dbId,payload?.tableId,payload?.fieldName)
        //delte api call 
            dispatch(deleteColumn(payload));
            const {tableId, dbId} = getState().table
            dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return 2;
        // return response of api;
    }
)
export const updateColumnHeaders = createAsyncThunk(
    "table/updateColumnHeaders",
    async(payload,{dispatch,getState})=>{
        const data={
            newFieldName:payload?.label,
            newFieldType:payload?.fieldType
        }
        await updateField(payload?.dbId,payload?.tableName,payload?.fieldName,data)
        dispatch(updateColumnHeader(payload));
        const {tableId, dbId} = getState().table
        dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return 2;
    }
)

export const addColumnsToRight = createAsyncThunk(
    "table/addColumnsToRight",
    async(payload,{dispatch,getState})=>{

        dispatch(addColumnToRight(payload));
        const {tableId, dbId} = getState().table
        dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return payload;
    }
)

export const addColumsToLeft = createAsyncThunk(
    "table/addColumsToLeft",
    async(payload,{dispatch,getState})=>{
        const data={
            fieldName:payload?.fieldName,
            fieldType:payload?.fieldType
        }
        await createField(payload?.dbId,payload?.tableId,data);
        dispatch(addColumnToLeft(payload));
        const {tableId, dbId} = getState().table
        dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return payload;
    }
)

export const updateCells = createAsyncThunk(
    "table/updateCells",
    async(payload,{dispatch,getState})=>{
       const {tableId, dbId} = getState().table
       const value = payload.value
       const  columnId= payload.columnId;
       await updateRow(dbId,tableId,payload.rowIndex,{[columnId]:value})
        dispatch(updateCell(payload));
        return payload;
    }   
)

export const addRows = createAsyncThunk(
    "table/addRows",
    async(payload,{dispatch,getState})=>{
        const {tableId, dbId} = getState().table
        await insertRow(dbId,tableId);
        dispatch(addRow(payload));
        dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return payload;
    }
)
export const deleteRows = createAsyncThunk(
    "table/deleteRows",
    async(payload,{dispatch,getState})=>{
       
        var arr = [];
        for (var index in payload) {
            // console.log(arr.push(payload[index].original.id ))
            arr.push(payload[index].original.id )
        }
        const {tableId, dbId} = getState().table
        console.log(dbId,tableId,{row_id:arr})
       await deleteRow(dbId,tableId,{row_id:arr}) ;
        dispatch(bulkAddColumns({tableName:tableId,dbId :dbId}));
        return payload;
    }
)

export const updateColumnsType = createAsyncThunk(
    "table/updateColumnsType",
    async(payload,{dispatch})=>{
        
        dispatch(updateColumnType(payload));
        return payload;
    }
)