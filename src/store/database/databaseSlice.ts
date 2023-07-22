import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { DbStateType } from "../../types/databaseDataType";

import { initialState, reducers ,extraReducers } from "./databaseReducer";

const databaseSlice = createSlice<DbStateType, SliceCaseReducers<DbStateType>, "organdDb">({
    name: "organdDb",
    initialState,
    reducers,
    extraReducers
  });



export default databaseSlice.reducer;
