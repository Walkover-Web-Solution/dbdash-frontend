import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDbInUser, getDbById, removeDbInUser, updateAccessOfUserInDb } from "../../api/dbApi"
import { updateTable } from "../../api/tableApi";
export const createTable1 = createAsyncThunk (
    "tables/createTable1", async (payload) =>{
        return payload?.tables
    }
);
export const getTable1 = createAsyncThunk (
    "tables/getTable1",
     async (payload) =>{
        const data = await getDbById(payload?.dbId);
        return data.data.data
    }
);
export const addDbInUserThunk=createAsyncThunk(
    "tables/addDbInUserThunk",async(payload)=>{
       const response= await addDbInUser(payload.dbId,payload.adminId,payload.data);

       return response;
    }
)
export const removeDbInUserThunk=createAsyncThunk(
    "tables/removeDbInUserThunk",async(payload)=>{
       const response= await removeDbInUser(payload.dbId,payload.adminId,payload.data);
const responsetosend={
    response:response,
    userId:payload?.userId
}
       return responsetosend;
    }
)

export const updateAccessOfUserInDbThunk=createAsyncThunk(
    "tables/updateAccessOfUserInDbThunk",async(payload)=>{
       const response= await updateAccessOfUserInDb(payload.dbId,payload.adminId,payload.data);
       console.log("response",response);
       return response;
    }
)
export const updateTable1= createAsyncThunk (
    "tables/updateTable1", async (payload) =>{
        const data = await updateTable(payload?.dbId,payload.tableName,payload.data1);
        return data.data.data.tables
    }
);
export const removeTable1 = createAsyncThunk (
    "tables/removeTable1", async (payload) =>{
        return payload?.tableData;
    }
);
