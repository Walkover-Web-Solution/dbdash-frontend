import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { TableDataType } from "../../types/tableDataTypes";
// // reducer imports
import { reducers, extraReducers } from "./tableReducer";

import { initialState } from "./tableReducer";

const tableSlice = createSlice<
  TableDataType,
  SliceCaseReducers<TableDataType>,
  "table"
>({
  name: "table",
  initialState,
  reducers,
  extraReducers,
});

export const {
  addOptionToColumn,
  deleteColumn,
  resetData,
  updateColumnType,
  addColumnToLeft,
  updateCell,
  updateTableData,
  setTableLoading,
  updatecellbeforeapi,
} = tableSlice.actions;

export default tableSlice.reducer;
