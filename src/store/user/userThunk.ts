import { createAsyncThunk } from "@reduxjs/toolkit";
import { add , remove} from "./userSlice";
import { getCurrentUser } from "../../api/userApi";
import { AddPayloadType } from "../../types/userType";


export const saveUser = createAsyncThunk (
    "user/saveUser", async (payload , {dispatch}) =>{
        const data = await getCurrentUser();
        const response:AddPayloadType=data.data.data;
        dispatch(add(response));
        return 5;
    }
);


export const removeUser = createAsyncThunk (
    "user/removeUser", async (_payload , {dispatch}) =>{
        dispatch(remove);
        return 5;
    }
);