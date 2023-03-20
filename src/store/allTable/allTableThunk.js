import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDbById } from "../../api/dbApi"
import { createTable,updateTable,deleteTable } from "../../api/tableApi";
export const createTable1 = createAsyncThunk (
    "tables/createTable1", async (payload) =>{
        const data = await createTable(payload?.dbId,payload.data);
        return data.data.data.tables
    }
);
export const getTable1 = createAsyncThunk (
    "tables/getTable1",
     async (payload) =>{
        const data = await getDbById(payload?.dbId);
        return data.data.data
    }
);
export const updateTable1= createAsyncThunk (
    "tables/updateTable1", async (payload) =>{
        const data = await updateTable(payload?.dbId,payload.tableName,payload.data1);
        return data.data.data.tables
    }
);
export const removeTable1 = createAsyncThunk (
    "tables/removeTable1", async (payload) =>{
        const data = await deleteTable(payload?.dbId,payload?.tableid);
        return data.data.data.tables
    }
);