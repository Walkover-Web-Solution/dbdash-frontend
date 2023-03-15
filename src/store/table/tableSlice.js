import { createSlice } from "@reduxjs/toolkit";

// // reducer imports
import { initialState, reducers ,extraReducers } from "./tableReducer";

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers,
  extraReducers
});

export const { addOptionToColumn, bulkAdd,deleteColumn,updateColumnHeader,updateColumnType,addColumnToRight,addColumnToLeft,updateCell,addRow,updateTableData} = tableSlice.actions;

export default tableSlice.reducer;
