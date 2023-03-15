import { createAsyncThunk } from "@reduxjs/toolkit";
import { add , remove} from "./userSlice";
import { getCurrentUser } from "../../api/userApi";



export const saveUser = createAsyncThunk (
    "user/saveUser", async (payload , {dispatch}) =>{
        const data = await getCurrentUser();
        dispatch(add(data.data.data));
        return 5;
    }
);


export const removeUser = createAsyncThunk (
    "user/removeUser", async (_payload , {dispatch}) =>{
        dispatch(remove());
        return 5;
    }
);