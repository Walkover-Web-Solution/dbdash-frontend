import { createAsyncThunk } from "@reduxjs/toolkit";
import { createField, deleteField, getAllfields, updateField } from "../../api/fieldApi";
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

const getHeaders = async (dbId, tableName) => {
    const fields = await getAllfields(dbId, tableName);
    delete fields?.data?.data?.fields["fieldIds"]
    let columns = [
        {
            id: 9999991,
            width: 10,
            label: "check",
            disableResizing: true,
            dataType: "check",
            accessor: "check",
        },
    ]
    Object.entries(fields?.data?.data?.fields).forEach((field) => {
        var json = {
            id: "",
            label: "",
            accessor: "",
            minWidth: 100,
            dataType: "",
            options: [],
            metadata: {},
            width:field[1].metaData?.width ? field[1].metaData?.width : 150
        }
        json.id = field[0];
        json.label = field[1].fieldName?.toLowerCase() || field[0]?.toLowerCase();
        // json.width = field[1].metaData?.width 
        json.accessor = field[0]?.toLowerCase();
        if (field[1].fieldType == "createdby")
            json.accessor = "createdby";
        if (field[1].fieldType == "id")
            json.accessor = "id";
        if (field[1].fieldType == "rowid")
            json.accessor = "rowid";
        if (field[1].fieldType == "autonumber")
            json.accessor = "autonumber";
        if (field[1].fieldType == "createdat")
            json.accessor = "createdat";
        json.metadata = field[1].metaData;
        json.dataType = field[1].fieldType?.toLowerCase();
        columns.push(json);
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
const getRowData = async (dbId, tableName, { getState }, org_id, page) => {
    const data = await getTable(dbId, tableName, page);
    const obj = data.data.data?.rows || data.data.data;
    const userInfo = allOrg(getState());
    const tableInfo = getTableInfo(getState())
    const userJson = await replaceCreatedByIdWithName(userInfo,org_id)
   
    obj.map((row) => {
        row.createdby = userJson?.[row.createdby] ? (userJson?.[row.createdby]?.first_name + " " + userJson?.[row.createdby]?.last_name) : row.createdby;
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
        if ((payload?.pageNo <= 1) || !(payload?.pageNo)) {
            columns = await getHeaders(payload.dbId, payload.tableName)
        }
        if (payload?.filter != null) {
            const querydata = await runQueryonTable(
                payload.dbId,
                payload?.filter
            )
            const userInfo = allOrg(getState());
            const userJson = await replaceCreatedByIdWithName(userInfo, payload?.org_id);
            querydata?.data?.data?.rows && querydata?.data?.data?.rows?.map((row) => {
                row.createdby = userJson?.[row.createdby] ? (userJson?.[row.createdby]?.first_name + " " + userJson?.[row.createdby]?.last_name) : row.createdby;
            })
            const dataa = {
                "columns": columns,
                "row": querydata?.data?.data?.rows,
                "tableId": payload?.tableName,
                "dbId": payload.dbId
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
            await deleteField(payload?.dbId, payload?.tableId, payload?.fieldName)
            //delte api call
            dispatch(deleteColumn(payload));
            dispatch(getTable1({ dbId: payload?.dbId }))
            const { tableId, dbId } = getState().table
            dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
            return 2;
        }
        // return response of api;
    }
)
export const updateColumnHeaders = createAsyncThunk(
    "table/updateColumnHeaders",
    async (payload, { dispatch, getState }) => {
        const data = {
            newFieldName: payload?.label,
            newFieldType: payload?.fieldType,
            metaData: payload?.metaData
        }
        await updateField(payload?.dbId, payload?.tableName, payload?.fieldName, data)
        if(payload?.metaData?.width) return;
        dispatch(getTable1({ dbId: payload?.dbId }))
        dispatch(updateColumnHeader(payload));
        const { tableId, dbId } = getState().table
        dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
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
        if (payload?.fieldType == "lookup")
            await createView(payload?.dbId, payload?.tableId, data);
        else
            await createField(payload?.dbId, payload?.tableId, data);
        dispatch(getTable1({ dbId: payload?.dbId }))
        const { tableId, dbId } = getState().table
        dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
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
        if (payload?.fieldType == "lookup")
            await createView(payload?.dbId, payload?.tableId, data);
        else
            await createField(payload?.dbId, payload?.tableId, data);
        dispatch(getTable1({ dbId: payload?.dbId }))
        // dispatch(addColumnToLeft(payload));
        const { tableId, dbId } = getState().table
        dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
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
        userInfo.forEach(obj => {
            obj.users.forEach(user => {
                if (user?.user_id?._id == data?.data?.data?.createdby) {
                    data.data.data.createdby = user?.user_id?.first_name + " " + user?.user_id?.last_name
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
        userInfo.forEach(obj => {
            obj.users.forEach(user => {
                if (user?.user_id?._id == newRow?.data?.data?.createdby) {
                    newRow.data.data.createdby = user?.user_id?.first_name + " " + user?.user_id?.last_name
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
        for (var index in payload) {
            arr.push(payload[index].original.id)
        }
        const { tableId, dbId } = getState().table
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
    async(payload)=>{
        const data={
            newFieldName:payload?.label,
            newFieldType:payload?.fieldType,
            metaData:{option:payload?.metaData}
        }
        await updateField(payload?.dbId, payload?.tableName, payload?.fieldName, data)
        return payload;

    }
)