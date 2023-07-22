import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { AllTableDataType } from "../../types/alltablesDataType";

import { initialState, reducers, extraReducers } from "./allTableReducer";
const allTableSlice = createSlice<AllTableDataType,SliceCaseReducers<AllTableDataType>,"tables">({
  name: "tables",
  initialState,
  reducers,
  extraReducers,
});
export const { add, getAll, update, remove, setAllTablesData, setReduxData } =
  allTableSlice.actions;
export default allTableSlice.reducer;
