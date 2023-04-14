import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers ,extraReducers } from "./allTableReducer";
const allTableSlice = createSlice({
    name:"tables",
    initialState,
    reducers,
    extraReducers
  });
export const { add , getAll,update,remove,setAllTablesData,setReduxData } = allTableSlice.actions;
export default allTableSlice.reducer