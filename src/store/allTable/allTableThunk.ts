import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDbInUser, getDbById, removeDbInUser, updateAccessOfUserInDb } from "../../api/dbApi"
import { updateTable } from "../../api/tableApi";
import { ShareDbPayloadThunkType, AllTableDataType, RemoveTableThunkPayloadType, UpdateTableThunkPayloadType } from '../../types/alltablesDataType';



export const createTable1 = createAsyncThunk (
    "tables/createTable1", async (payload:AllTableDataType) =>{
        return payload?.tables
    }
);
export const getTable1 = createAsyncThunk (
    "tables/getTable1",
     async (payload:any) =>{
        const data = await getDbById(payload?.dbId);
        return data.data.data
    }
);
export const removeTable1 = createAsyncThunk (
    "tables/removeTable1", async (payload:RemoveTableThunkPayloadType) =>{
        return payload?.tableData;
    }
);
export const updateTable1= createAsyncThunk (
    "tables/updateTable1", async (payload:UpdateTableThunkPayloadType) =>{

        const data = await updateTable(payload?.dbId,payload.tableName,payload.data1);
        return data.data.data.tables
    }
);
export const addDbInUserThunk=createAsyncThunk(
    "tables/addDbInUserThunk",async(payload:ShareDbPayloadThunkType)=>{
        
       const response= await addDbInUser(payload.dbId,payload.adminId,payload.data);

       return response?.data?.data;
    }
)
export const removeDbInUserThunk=createAsyncThunk(
    "tables/removeDbInUserThunk",async(payload:any)=>{
        console.log("RemovePayload", payload)

       const response= await removeDbInUser(payload.dbId,payload.adminId,payload.data);
const responsetosend={
    response:response,
    userId:payload?.userId
}

       return responsetosend;
    }
)
export const updateAccessOfUserInDbThunk=createAsyncThunk(
    "tables/updateAccessOfUserInDbThunk",async(payload:ShareDbPayloadThunkType)=>{

       const response= await updateAccessOfUserInDb(payload.dbId,payload.adminId,payload.data);
       return response.data?.data;
    }
)

