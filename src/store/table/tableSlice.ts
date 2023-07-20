import { createSlice } from "@reduxjs/toolkit";

// // reducer imports
import { reducers, extraReducers } from "./tableReducer";

interface InitialState{
  columns:Array<any>,
  data:Array<any>,
  tableId: String | null,
  dbId: String | null,
  status: String,
  pageNo: Number,
  isTableLoading: boolean,
  isMoreData: boolean,
  filterId: String | null,
}

export const initialState:InitialState = {
  columns: [],
  data: [],
  tableId: null,
  dbId: null,
  status: "idle",
  pageNo: 0,
  isTableLoading: true,
  isMoreData: true,
  filterId: null,
};

const tableSlice = createSlice({
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
