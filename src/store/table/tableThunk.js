

import { createAsyncThunk } from "@reduxjs/toolkit";
import { createField, deleteField, hideAllField, updateField } from "../../api/fieldApi";
import { getTable } from "../../api/tableApi";
import { insertRow, uploadImage, updateRow, deleteRow } from "../../api/rowApi";
import { getTable1 } from "../allTable/allTableThunk";
import { addOptionToColumn, deleteColumn, setTableLoading, updateColumnType } from "./tableSlice";
import { allOrg } from "../database/databaseSelector";
import { runQueryonTable } from "../../api/filterApi";
import { createView, deleteFieldInView } from "../../api/viewApi";
// import { getTableInfo } from "./tableSelector";
import { getAllTableInfo } from "../allTable/allTableSelector";
import { setAllTablesData } from "../allTable/allTableSlice";



const replaceCreatedByIdWithName = async (userInfo, org_id) => {
    const users = userInfo?.find((org) => org?._id == org_id)?.users;
    var userJson = {};
    users?.forEach(user => {
        userJson[user.user_id._id] = user?.user_id;
    });
    if (!users) {
        userInfo.forEach(obj => {
            obj.users.forEach(user => {
                if (!(userJson?.[user.user_id._id]))
                    userJson[user.user_id._id] = user?.user_id;
            });
        });
    }
    return userJson;
}


const getHeaders = async (dbId, tableName, payloadfields, { getState }) => {  
    console.log("inside getHeaders")
    const fields = payloadfields || getAllTableInfo(getState())?.tables?.[tableName]?.fields
    const fieldIds = getAllTableInfo(getState())?.tables?.[tableName]?.fieldIds
    console.log("fields",fieldIds,fields)
    // const fields = payloadfields || await getAllfields(dbId, tableName);
    let columns = [
        // {
        //     id: 9999991,
        //     width: 10,
        //     label: "check",
        //     disableResizing: true,
        //     dataType: "check",
        //     accessor: "check",
        // },
    ];
    const arr =  fields;
    // const arr = fields;
    // fields?.data?.data?.fields ||

    // Object.entries(arr).forEach((field) => {
    //     var json = {
    //         title: "",
    //         id: "",
    //         dataType: "",
    //         hasMenu: true,
    //         // minWidth: 100,
    //         // options: [],
    //         metadata: {},
    //         width: field[1]?.metaData?.width ? field[1]?.metaData?.width : 150
    //     }
    //     json.id = field[0];
    //     json.title = field[1].fieldName?.toLowerCase() || field[0]?.toLowerCase();
    //     // json.accessor = field[0]?.toLowerCase();
    //     json.metadata = field[1].metaData;
    //     json.dataType = field[1].fieldType?.toLowerCase();
    //     columns.push(json);

    // }
    // )
    fieldIds.forEach((fieldId, index) => {
        const field = arr[fieldId];
        
        if (field) {
            var json = {
                title: "",
                id: "",
                dataType: "",
                hasMenu: true,
                // minWidth: 100,
                // options: [],
                metadata: {},
                width: field.metaData?.width ? field.metaData.width : 150
            }
            json.id = fieldId;
            json.title = field.fieldName?.toLowerCase() || fieldId.toLowerCase();
            // json.accessor = fieldId.toLowerCase();
            json.metadata = field.metaData;
            json.dataType = field.fieldType?.toLowerCase();
            columns[index] = json; // Replace the existing object at the corresponding index
        }
    });
    console.log("columns",columns)
    return columns;
}

const getRowData = async (dbId, tableName, { getState }, org_id, page) => {
    // const data = await getTable(dbId, tableName, page);
    // const obj = data.data.data?.rows || data.data.data;
    const userInfo = allOrg(getState());
    // const tableInfo = getTableInfo(getState())
    const userJson = await replaceCreatedByIdWithName(userInfo, org_id)
    const createdby = "fld" + tableName.substring(3) + "createdby";
    const updatedby = "fld" + tableName.substring(3) + "updatedby";
    
    const dataAndPageNo = {
        offset : true,
        rows : []
    }
    page = 1; 
    while (dataAndPageNo?.offset) {
        const data = await getTable(dbId, tableName, page);
        const obj = data.data.data?.rows || data.data.data;
        obj.map((row) => {
            row[createdby] = userJson?.[row[createdby]] ? (userJson?.[row[createdby]]?.first_name + " " + userJson?.[row[createdby]]?.last_name) : row[createdby];
            row[updatedby] = userJson?.[row[updatedby]] ? (userJson?.[row[updatedby]]?.first_name + " " + userJson?.[row[updatedby]]?.last_name) : row[updatedby];
        })
        dataAndPageNo.offset = data.data.data?.offset;
        dataAndPageNo.rows=[...dataAndPageNo.rows,...obj]
        page = page +1;
      }
    // if (tableInfo.tableId == tableName && tableInfo.pageNo < page) {
    //     dataAndPageNo.rows = [...tableInfo.data, ...obj];
    //     return dataAndPageNo;
    // }
    // dataAndPageNo.pageNo = 1;
    // dataAndPageNo.rows = obj;
    return dataAndPageNo;
}
export const addColumns = createAsyncThunk(
    "table/addColumns",
    async (payload, { dispatch }) => {
        dispatch(addOptionToColumn(payload));
        return 5;
    }
);
export const bulkAddColumns = createAsyncThunk(
    "table/bulkAddColumns",
    async (payload, { getState, dispatch }) => {
        var columns = null
        columns = await getHeaders(payload.dbId, payload.tableName, payload?.fields, { getState })
        const data = await getRowData(payload.dbId, payload.tableName, { getState }, payload.org_id, payload.pageNo)
        const dataa = {
            "columns": columns,
            "row": data?.rows,
            "tableId": payload?.tableName,
            "dbId": payload?.dbId,
            "pageNo": data?.pageNo,
            "isMoreData": !(data?.offset == null)
        }
        dispatch(setTableLoading(false))
        return dataa;
    }
);
export const filterData = createAsyncThunk(
    "table/bulkAddColumns",
    async (payload, { getState ,dispatch}) => {
        try {
            var filterQuery ; 
            const table = getAllTableInfo(getState())?.tables?.[payload?.tableId]
            const filter =table?.filters?.[payload?.filterId];
            const filterFields = filter?.fields;
            const fieldArrayInFilter = filter?.fieldIds ;
            if(payload?.filter)
            {
                filterQuery = payload?.filter
            }else{
                filterQuery = table?.filters?.[payload?.filterId].query
            }
            const userInfo = allOrg(getState());
            const userJson = await replaceCreatedByIdWithName(userInfo, payload?.org_id);
            const createdby = "fld" + payload?.tableId.substring(3) + "createdby"
           
            var offset = true
            var rows = [];
            var page =1
            while (offset) {
                const querydata = await runQueryonTable(payload.dbId,filterQuery,page)
                querydata?.data?.data?.rows && querydata?.data?.data?.rows?.map((row) => {
                    row[createdby] = userJson?.[row[createdby]] ? (userJson?.[row[createdby]]?.first_name + " " + userJson?.[row[createdby]]?.last_name) : row[createdby];
                })
                const obj = querydata?.data?.data?.rows
                offset = !!querydata?.data?.data?.offset;
                rows=[...rows,...obj]
                page = page +1;
              }
            let columns={} ;
            // const viewFields =table.view?.fields;//views fields
            // Create a new object with fields sorted based on the sorted fieldIds array;
            fieldArrayInFilter?.forEach((id) => {
                columns[id] = table?.fields?.[id];
            });
            // if(!fieldArrayInFilter)
            // {
            //     columns = { ...table?.fields,...viewFields}
            // }
          
            filterFields && Object.entries(filterFields).map((entry) => {
                const id = entry[0];
                const hide =  entry[1].hide;
                const width =  entry[1].width;
                columns[id] = {...columns[id],metaData: {...columns[id]?.metaData,hide: hide,width: width}};
            });
            columns = await getHeaders(payload?.dbId, payload?.tableId,columns, { getState } )

            const dataa = {
                "columns": columns,
                "row": rows,
                "tableId":payload?.tableId,
                "dbId": payload?.dbId,
                // "pageNo": querydata?.data?.data?.pageNo,
                // "isMoreData": !(querydata?.data?.data?.offset == null),
                "filterId": payload?.filterId
            }
            dispatch(setTableLoading(false))
                return dataa;
            }
         catch (error) {
            console.log("error")
        }
    }
);

export const deleteColumns = createAsyncThunk(
    "table/deleteColumns",
    async (payload, { dispatch, getState }) => {

        if (payload?.fieldDataType == "lookup") {
            const data = {
                viewFieldId: payload?.fieldName
            }
            await deleteFieldInView(payload?.dbId, payload?.tableId, data)
            dispatch(getTable1({ dbId: payload?.dbId }))

            dispatch(deleteColumn(payload));
            const { tableId, dbId } = getState().table
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
            return 2;
        }
        else {
            const deletedfield = await deleteField(payload?.dbId, payload?.tableId, payload?.fieldName)
            dispatch(setAllTablesData({
                dbId:deletedfield?.data?.data?.data?._id,
                tables: deletedfield?.data?.data?.data?.tables
            }))
            // dispatch(addColumnToLeft(payload));
            const { tableId, dbId } = getState().table
            if(payload?.filterId){
                dispatch(filterData({
                    filterId : payload?.filterId,
                    tableId: payload?.tableId ,
                    dbId: payload?.dbId
                  }))
            }else{
                dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: deletedfield?.data?.data?.fields }));
            }
            return 2;
        }
    }
)

export const updateColumnHeaders = createAsyncThunk(
    "table/updateColumnHeaders",
    async (payload, { dispatch }) => {
        const data = {
            filterId:payload?.filterId,
            newFieldName: payload?.label,
            newFieldType: payload?.fieldType,
            metaData: payload?.metaData
        }
        if (payload?.metaData?.isAllHide) {
            await hideAllField(payload?.dbId, payload?.tableName, {metaData:payload?.metaData,filterId:payload?.filterId})
            return ; }
        //call api to update backend 
        const  updatedDbdata = await updateField(payload?.dbId, payload?.tableName, payload?.columnId, data) ; 
        // update the all table reducer so all tables in the db will be updated 
        dispatch(setAllTablesData({
            dbId:updatedDbdata?.data?.data?._id,
            tables: updatedDbdata?.data?.data?.tables
        }))
        let  updatedColumn = updatedDbdata?.data?.data?.tables?.[payload?.tableName]?.fields?.[payload?.columnId];
        if(payload?.filterId){
            try{
                var  updatedFilterColumn = updatedDbdata?.data?.data?.tables?.[payload?.tableName]?.filters?.[payload?.filterId]?.fields?.[payload?.columnId];
                const updatedMetaData = {
                    ...updatedColumn.metaData, // Copy the existing metaData properties
                    hide: updatedFilterColumn.hide,// Update the hide property
                    width:updatedFilterColumn.width  
                  };
                  // Create a new updatedColumn object with the updated metaData
                   updatedColumn = {
                    ...updatedColumn, // Copy the existing properties of updatedColumn
                    metaData: updatedMetaData, // Update the metaData property
                  };
        //    updatedColumn.metaData.hide = updatedFilterColumn.hide
        //    updatedColumn.metaData.width = updatedFilterColumn.width 
            }
            catch(e){
                console.log(e)
            }
           
        }
        updatedColumn = {[payload?.columnId]:updatedColumn}
        updatedColumn = await getHeaders(null , null , updatedColumn)
        // now will update the table reducer so current table fields  will be updated as well 
        return updatedColumn[0] ;
    }
)

export const addColumnrightandleft = createAsyncThunk(
    "table/addColmunsrightandleft",
    async (payload,
        { dispatch, getState }
    ) => {
        const data = {
            filterId:payload?.filterId,
            fieldName: payload?.fieldName,
            fieldType: payload?.fieldType,
            direction: payload?.direction,
            position: payload?.position,
            metaData: payload?.metaData,
            selectedFieldName: payload?.selectedFieldName,
            selectedTable: payload?.selectedTable,
            query: payload?.query,
            linkedForeignKey: payload?.linkedValueName,
            foreignKey: payload?.foreignKey,
            duplicateField: payload?.duplicateField
        }
        let createdfield;
        if (payload?.fieldType == "lookup")
            createdfield = await createView(payload?.dbId, payload?.tableId, data);
        else
            createdfield = await createField(payload?.dbId, payload?.tableId, data);
        dispatch(setAllTablesData({
            dbId:createdfield?.data?.data?.data?._id,
            tables: createdfield?.data?.data?.data?.tables
        }))
        
        const { tableId, dbId } = getState().table
        if(payload?.filterId){
            dispatch(filterData({
                filterId : payload?.filterId,
                tableId: payload?.tableId ,
                dbId: payload?.dbId
              }))
        }else{
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: createdfield?.data?.data?.fields }));
        }
        return payload;
    }
)
export const addColumsToLeft = createAsyncThunk(
    "table/addColumsToLeft",
    async (payload, { dispatch, getState }) => {
        const data = {
            filterId:payload?.filterId,
            fieldName: payload?.fieldName,
            fieldType: payload?.fieldType,
            metaData: payload?.metaData,
            query: payload?.query,
            selectedFieldName: payload?.selectedFieldName,
            selectedTable: payload?.selectedTable,
            linkedForeignKey: payload?.linkedValueName,
            foreignKey: payload?.foreignKey
        }
        let createdfield;
        if (payload?.fieldType == "lookup")
            createdfield = await createView(payload?.dbId, payload?.tableId, data);
        else
            createdfield = await createField(payload?.dbId, payload?.tableId, data);


        dispatch(setAllTablesData({
            dbId:createdfield?.data?.data?.data?._id,
            tables: createdfield?.data?.data?.data?.tables
        }))
        // dispatch(addColumnToLeft(payload));
        const { tableId, dbId } = getState().table
        if(payload?.filterId){
            dispatch(filterData({
                filterId : payload?.filterId,
                tableId: payload?.tableId ,
                dbId: payload?.dbId
              }))
        }else{
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: createdfield?.data?.data?.fields }));
        }
        return payload;
    }
)
export const updateCells = createAsyncThunk(
    "table/updateCells",
    async (payload, { getState }) => {
        const { tableId, dbId } = getState().table
        const value = payload?.value
        const columnId = payload.columnId;
        const userInfo = allOrg(getState());
        if (payload?.dataTypes == "file") {
            const data = await uploadImage(dbId, tableId, payload.rowIndex, columnId, payload?.value, payload?.imageLink)
            payload.value = data?.data?.data;
            return payload;
        }
        const data = await updateRow(dbId, tableId, payload.rowIndex, { [columnId]: value })
        const createdby = "fld" + tableId.substring(3) + "createdby"
        userInfo.forEach(obj => {
            obj.users.forEach(user => {
                if (user?.user_id?._id == data?.data?.data?.[createdby]) {
                    data.data.data[createdby] = user?.user_id?.first_name + " " + user?.user_id?.last_name
                    return;
                }
            });
        })
        payload.newData = data?.data?.data;
        return payload;
    }
)
export const addRows = createAsyncThunk(
    "table/addRows",
    async (_, { getState }) => {
        const userInfo = allOrg(getState());
        const { tableId, dbId } = getState().table
        const newRow = await insertRow(dbId, tableId);
        const createdby = "fld" + tableId.substring(3) + "createdby"
        userInfo.forEach(obj => {
            obj.users.forEach(user => {
                if (user?.user_id?._id == newRow?.data?.data?.[createdby]) {
                    newRow.data.data[createdby] = user?.user_id?.first_name + " " + user?.user_id?.last_name
                    return;
                }
            });
        })
        return newRow?.data?.data;
    }
)
// export const deleteRows = createAsyncThunk(
//     "table/deleteRows",
//     async (payload, { dispatch, getState }) => {
//         var arr = [];
//         const { tableId, dbId } = getState().table
//         for (var index in payload) {
//             arr.push(payload[index].original.id || payload[index].original["fld" + tableId.substring(3) + "autonumber"])
//         }
//         await deleteRow(dbId, tableId, { row_id: arr });
//         dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
//         return payload;
//     }
// )
export const updateColumnsType = createAsyncThunk(
    "table/updateColumnsType",
    async (payload, { dispatch }) => {
        dispatch(updateColumnType(payload));
        return payload;
    }
)

export const deleteRows = createAsyncThunk(
    "table/deleteRows",
    async (payload, {  getState }) => {
         const { tableId, dbId } = getState().table
    await deleteRow(dbId, tableId, { row_id: payload.deletedRowIndices });
       let rows=payload.dataa;
      let newrows=rows.filter(row=>{ return(!payload.deletedRowIndices.includes(Object.entries(row)[1][1]));})
        return newrows;
    }
)
export const updateColumnOrder = createAsyncThunk(  
    "table/updateColumnOrder",
    async (payload, { getState }) => {
        const data = {
            filterId:payload?.filterId,
            oldIndex: payload?.oldIndex,
            newIndex: payload?.newIndex
        }
        const { tableId, dbId } = getState().table
        await updateField(dbId, tableId, payload?.id, data)
        return payload;
    }
)
export const updateMultiSelectOptions = createAsyncThunk(
    "table/updateMultiSelectOptions",
    async (payload) => {
        const data = {
            newFieldName: payload?.label,
            newFieldType: payload?.fieldType,
            metaData: { option: payload?.metaData }
        }
        await updateField(payload?.dbId, payload?.tableName, payload?.fieldName, data)
        return payload;
    }
)