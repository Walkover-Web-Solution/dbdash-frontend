import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { TableDataType } from "../../types/tableDataTypes";
// // reducer imports
import { reducers, extraReducers } from "./tableReducer";

const initialState: TableDataType = {
  columns: [],
  data: [],
  tableId: "",
  dbId: null,
  status: "idle",
  pageNo: 0,
  isTableLoading: true,
  isMoreData: true,
  filterId: null,
};

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
