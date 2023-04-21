import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDbById } from "../../api/dbApi"
import { createTable,updateTable,deleteTable } from "../../api/tableApi";
export const createTableThunk = createAsyncThunk (
    "tables/createTableThunk", async (payload) =>{
        const data = await createTable(payload?.dbId,payload.data);
        return data.data.data.tables
    }
);
export const getAllTableThunk = createAsyncThunk (
    "tables/getAllTableThunk",
     async (payload) =>{
        const data = await getDbById(payload?.dbId);
        return data.data.data
    }
);
export const renameTableThunk= createAsyncThunk (
    "tables/renameTableThunk", async (payload) =>{
        const data = await updateTable(payload?.dbId,payload.tableName,payload.data1);
        return data.data.data.tables
    }
);
export const removeTableThunk = createAsyncThunk (
    "tables/removeTableThunk", async (payload) =>{
        const data = await deleteTable(payload?.dbId,payload?.tableid);
        return data.data.data.tables
    }
);
