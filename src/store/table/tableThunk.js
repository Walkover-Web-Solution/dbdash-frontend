import { createAsyncThunk } from "@reduxjs/toolkit";
import { createField, deleteField, getAllfields, hideAllField, updateField } from "../../api/fieldApi";
import { getTable } from "../../api/tableApi";
import { insertRow, uploadImage, updateRow, deleteRow } from "../../api/rowApi";
import { getTable1 } from "../allTable/allTableThunk";
import { addOptionToColumn, deleteColumn, setTableLoading, updateColumnHeader, updateColumnType } from "./tableSlice";
import { allOrg } from "../database/databaseSelector";
import { runQueryonTable } from "../../api/filterApi";
import { createView, deleteFieldInView } from "../../api/viewApi";
import { getTableInfo } from "./tableSelector";


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


const getHeaders = async (dbId, tableName, payloadfields) => {
    const fields = payloadfields || await getAllfields(dbId, tableName);
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

    const arr = fields?.data?.data?.fields || fields;

    Object.entries(arr).forEach((field) => {
        var json = {
            title: "",
            id: "",
            dataType: "",
            hasMenu: true,
            // minWidth: 100,
            // options: [],
            metadata: {},
            width: field[1].metaData?.width ? field[1].metaData?.width : 150
        }
        json.id = field[0];
        json.title = field[1].fieldName?.toLowerCase() || field[0]?.toLowerCase();
        // json.accessor = field[0]?.toLowerCase();
        json.metadata = field[1].metaData;
        json.dataType = field[1].fieldType?.toLowerCase();
        columns.push(json);

    }
    )
    return columns;
}

const getRowData = async (dbId, tableName, { getState }, org_id, page) => {
    const data = await getTable(dbId, tableName, page);
    const obj = data.data.data?.rows || data.data.data;
    const userInfo = allOrg(getState());
    const tableInfo = getTableInfo(getState())
    const userJson = await replaceCreatedByIdWithName(userInfo, org_id)
    const createdby = "fld" + tableName.substring(3) + "createdby"
    obj.map((row) => {
        row[createdby] = userJson?.[row[createdby]] ? (userJson?.[row[createdby]]?.first_name + " " + userJson?.[row[createdby]]?.last_name) : row[createdby];
    })
    const dataAndPageNo = {}
    dataAndPageNo.offset = data.data.data?.offset;
    if (tableInfo.tableId == tableName && tableInfo.pageNo < page) {
        dataAndPageNo.rows = [...tableInfo.data, ...obj];
        return dataAndPageNo;
    }
    dataAndPageNo.pageNo = 1;
    dataAndPageNo.rows = obj;
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
       
         columns = await getHeaders(payload.dbId, payload.tableName, payload?.fields)
        if (payload?.filter != null) {
            const tableInfo = getTableInfo(getState())
            const querydata = await runQueryonTable(
                payload.dbId,
                payload?.filter,
                payload?.pageNo
            )
            const userInfo = allOrg(getState());
            const userJson = await replaceCreatedByIdWithName(userInfo, payload?.org_id);
            const createdby = "fld" + payload.tableName.substring(3) + "createdby"
            querydata?.data?.data?.rows && querydata?.data?.data?.rows?.map((row) => {
                row[createdby] = userJson?.[row[createdby]] ? (userJson?.[row[createdby]]?.first_name + " " + userJson?.[row[createdby]]?.last_name) : row[createdby];
            })
            if (tableInfo.filterId == payload?.filterId) {
                querydata.data.data.rows = [
                    ...(tableInfo?.data ?? []),
                    ...(querydata?.data?.data?.rows ?? []),
                ];
            }
            // else {
            //     querydata.data.data.pageNo = 1;
            // }
            const dataa = {
                "columns": columns,
                "row": querydata?.data?.data?.rows,
                "tableId": payload?.tableName,
                "dbId": payload.dbId,
                "pageNo": querydata?.data?.data?.pageNo,
                "isMoreData": !(querydata?.data?.data?.offset == null),
                "filterId": payload?.filterId
            }
            dispatch(setTableLoading(false))
            return dataa;
        }
        else {

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

            dispatch(deleteColumn(payload));
            dispatch(getTable1({ dbId: payload?.dbId }))

            const { tableId, dbId } = getState().table
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: deletedfield.data?.data }));
            return 2;
        }
    }
)
export const updateColumnHeaders = createAsyncThunk(
    "table/updateColumnHeaders",
    async (payload, { dispatch, getState }) => {
        console.log(payload,"inside")
        const data = {
            newFieldName: payload?.label,
            newFieldType: payload?.fieldType,
            metaData: payload?.metaData
        }
        
        if(payload?.metaData?.isAllHide){
            await hideAllField(payload?.dbId, payload?.tableName,payload?.metaData)
            return;   
        }  
        else{

            await updateField(payload?.dbId, payload?.tableName, payload?.fieldName, data)
        }
        
        if(payload?.metaData?.width) return;
       
        const { tableId, dbId } = getState().table
        if(payload?.metaData?.hide){
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
            return;
        }else{
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
        }
        dispatch(getTable1({ dbId: payload?.dbId }))
        if(payload?.metaData?.hide){
            return;
        }
        dispatch(updateColumnHeader(payload));
        return 2;
    }
)

export const addColumnrightandleft = createAsyncThunk(
    "table/addColmunsrightandleft",
    async (payload,
        { dispatch, getState }
    ) => {
        const data = {
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
            dispatch(getTable1({ dbId: payload?.dbId }))
        // dispatch(addColumnToLeft(payload));
            const { tableId, dbId } = getState().table
        dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: createdfield?.data?.data }));
        return payload;
    }
)
export const addColumsToLeft = createAsyncThunk(
    "table/addColumsToLeft",
    async (payload, { dispatch, getState }) => {
        const data = {
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
            dispatch(getTable1({ dbId: payload?.dbId }))
        // dispatch(addColumnToLeft(payload));
            const { tableId, dbId } = getState().table
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId, fields: createdfield?.data?.data }));
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
export const deleteRows = createAsyncThunk(
    "table/deleteRows",
    async (payload, { dispatch, getState }) => {
        var arr = [];
        const { tableId, dbId } = getState().table
        for (var index in payload) {
            arr.push(payload[index].original.id || payload[index].original["fld" + tableId.substring(3) + "autonumber"])
        }
        await deleteRow(dbId, tableId, { row_id: arr });
        dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
        return payload;
    }
)
export const updateColumnsType = createAsyncThunk(
    "table/updateColumnsType",
    async (payload, { dispatch }) => {
        dispatch(updateColumnType(payload));
        return payload;
    }
)
export const updateColumnOrder = createAsyncThunk(
    "table/updateColumnOrder",
    async (payload, { getState }) => {
        const data = {
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