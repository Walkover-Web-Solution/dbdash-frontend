import {
  addColumns,
  addColumnrightandleft,
  bulkAddColumns,
  updateColumnsType,
  updateCells,
  addRows,
  addMultipleRows,
  deleteColumns,
  updateColumnHeaders,
  addColumsToLeft,
  updateColumnOrder,
  updateMultiSelectOptions,
  deleteRows,
} from "./tableThunk";

import { randomColor, shortId } from "../../table/utils.js";
import {
  TableDataFieldMapping,
  UpdatecellbeforeapiPayload,
} from "../../types/tableDataTypes";
import { TableDataType } from "../../types/tableDataTypes";
import {
  ActionReducerMapBuilder,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { NoInfer } from "react-redux";
export const initialState: TableDataType = {
  columns: [],
  data: [],
  tableId: "",
  dbId: null,
  status: "idle",
  pageNo: 0,
  isTableLoading: true,
  isMoreData: true,
  filterId: null,
  rows: null,
};

export const reducers: ValidateSliceCaseReducers<
  TableDataType,
  SliceCaseReducers<TableDataType>
> = {
  addOptionToColumn(
    state,
    payload: {
      payload: { backgroundColor: string; columnId: string; option: any };
    }
  ): void {
    const action = payload.payload;

    if (action) {
      var optionIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      state.columns = [
        ...state.columns.slice(0, optionIndex),
        {
          ...state.columns[optionIndex],
          options: [
            ...(state.columns[optionIndex].options as []),
            { label: action.option, backgroundColor: action.backgroundColor },
          ],
        },
        ...state.columns.slice(optionIndex + 1, state.columns.length),
      ];

      state.skipReset = true;
    }
  },
  updatecellbeforeapi(state, payload: UpdatecellbeforeapiPayload): void {
    const action = payload.payload;
    let rows = [...state.data];
    let rowtoupdatecell = { ...action?.row };
    const [key, value] = Object.entries(action?.updatedvalue?.fields)[0];
    rowtoupdatecell[key] = value == "number" ? value.toString() : value;
    rows[action?.rowIndex] = rowtoupdatecell;
    state.data = rows;
  },
  resetData(): TableDataType {
    return {
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
  },
  deleteColumn(
    state,
    payload: { payload: { fieldName: string; columnId: string } }
  ) {
    const action = payload.payload;
    if (!action?.fieldName) return;
    let deleteIndex;
    if (action) {
      deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }
    return {
      ...state,

      columns: [
        ...state.columns.slice(0, deleteIndex),
        ...state.columns.slice(deleteIndex + 1, state.columns.length),
      ],
    };
  },
  updateColumnHeader(
    state,
    payload: { payload: { columnId: string; label: string } }
  ) {
    const action = payload.payload;
    let index;
    if (action) {
      index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }

    return {
      ...state,

      columns: [
        ...state.columns.slice(0, index),
        { ...state.columns[index], label: action?.label },
        ...state.columns.slice(index + 1, state.columns.length),
      ],
    };
  },
  addColumnrightandleft(
    state,
    payload: { payload: { columnId: string; focus: any } }
  ) {
    const action = payload.payload;
    let rightIndex;
    if (action) {
      rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }
    var rightId = shortId();
    return {
      ...state,

      columns: [
        ...state.columns.slice(0, rightIndex + 1),
        {
          id: rightId,
          label: "Column",
          accessor: rightId,
          dataType: "text",
          created: action.focus && true,
          options: [],
          metadata: { unique: false, hide: false },
        },
        ...state.columns.slice(rightIndex + 1, state.columns.length),
      ],
    };
  },
  addColumnToLeft(
    state,
    payload: { payload: { columnId: string; fieldName: string; focus: any } }
  ) {
    const action = payload.payload;
    if (action) {
      var leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      state.skipReset = true;
      state.columns = [
        ...state.columns.slice(0, leftIndex),
        {
          id: action?.fieldName,
          label: action?.fieldName,
          accessor: action?.fieldName,
          dataType: "text",
          created: action.focus && true,
          options: [],
          metadata: { unique: false, hide: false },
        },
        ...state.columns.slice(leftIndex, state.columns.length),
      ];
    }
  },

  setTableLoading(state, { payload }) {
    return {
      ...state,
      isTableLoading: payload,
    };
  },
  updateTableData(state, payload) {
    return {
      ...state,
      data: payload.payload,
    };
  },

  updateCell(
    state,
    payload: {
      payload: {
        rowIndex: number;
        dataTypes: string;
        columnId: string;
        value: string;
      };
    }
  ) {
    const action = payload.payload;

    state.skipReset = true;
    let arr: Array<TableDataFieldMapping> = [];

    state.data.forEach((ele) => {
      if (ele.id !== action.rowIndex) {
        arr = [...arr, { ...ele }];
      } else {
        if (action?.dataTypes == "file") {
          let arrr;
          arrr = ele?.[action?.columnId] == null ? [] : ele?.[action?.columnId];
          arrr.push(action.value);
          arr = [...arr, { ...ele, [action.columnId.toLowerCase()]: arrr }];
        } else {
          arr = [
            ...arr,
            { ...ele, [action.columnId.toLowerCase()]: action.value },
          ];
        }
      }
    });
    state.data = arr;
  },

  updateColumnType(
    state,
    payload: { payload: { columnId: string; dataType: string } }
  ) {
    const action = payload.payload;
    let typeIndex;
    if (action) {
      typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }

    switch (action.dataType) {
      case "numeric":
        if (state.columns[typeIndex].dataType === "numeric") {
          return state;
        } else {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: isNaN(row[action.columnId] as number)
                ? ""
                : Number.parseFloat(row[action.columnId] as string),
            })),
          };
        }
      case "select":
        if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        } else {
          let options: Array<any> = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              {
                ...state.columns[typeIndex],
                dataType: action.dataType,
                options: [
                  ...(state.columns[typeIndex].options as []),
                  ...options,
                ],
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        }
      case "longtext" || "json":
        if (state.columns[typeIndex].dataType == "text" || state.columns[typeIndex].dataType == "json") {
          return state;
        } else if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        } else {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: row[action.columnId] + "",
            })),
          };
        }

      case "singleselect":
        if (state.columns[typeIndex].dataType === "singleselect") {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        } else {
          let options: Array<TableDataFieldMapping> = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              {
                ...state.columns[typeIndex],
                dataType: action.dataType,
                options: [
                  ...(state.columns[typeIndex].options as []),
                  ...options,
                ],
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        }
      case "multipleselect":
        if (state.columns[typeIndex].dataType === "multipleselect") {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        } else {
          let options: Array<any> = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              {
                ...state.columns[typeIndex],
                dataType: action.dataType,
                options: [
                  ...(state.columns[typeIndex].options as []),
                  ...options,
                ],
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        }

      case "singlelinetext":
        if (state.columns[typeIndex].dataType === "text") {
          return state;
        } else if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
          };
        } else {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length),
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: row[action.columnId] + "",
            })),
          };
        }
      default:
        return state;
    }
  },
};

export function extraReducers(
  builder: ActionReducerMapBuilder<NoInfer<TableDataType>>
) {
  builder
    //   add columns
    .addCase(addColumns.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addColumns.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(addColumns.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(bulkAddColumns.pending, (state) => {
      state.status = "loading";
    })
    .addCase(bulkAddColumns.fulfilled, (state, action) => {
      if (action.payload) {
        if (action.payload.columns) state.columns = action.payload.columns;
        state.data = action.payload.pageNo === 1 ? action.payload.row : [...state.data, ...(action.payload.row||[])];
        state.tableId = action.payload.tableId;
        state.dbId = action.payload.dbId;
        state.pageNo = action?.payload?.pageNo
          ? action?.payload?.pageNo
          : state.pageNo + 1;
        state.isMoreData = action?.payload?.isMoreData;
        state.filterId = action?.payload?.filterId;
        if(action.payload.isMoreData){
          setTimeout(()=>{
            action.payload.dispatch(bulkAddColumns({
              dbId : action.payload.dbId,
              tableName: action.payload.tableId,
              pageNo: action.payload.pageNo + 1
            }))
          }, 1)
        }
        // state.page = 100;
      }
      state.status = "succeeded";
    })
    .addCase(bulkAddColumns.rejected, (state) => {
      state.status = "failed";
      state.isTableLoading = false;
    })

    .addCase(deleteRows.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteRows.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    })
    .addCase(deleteRows.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(deleteColumns.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteColumns.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(deleteColumns.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //for update column header
    .addCase(updateColumnHeaders.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateColumnHeaders.fulfilled, (state, { payload }) => {
      let allColumns: Array<any> = [];
      state.columns.forEach((column) => {
        if (column.id == payload?.id) {
          allColumns = [...allColumns, { ...payload }];
        } else {
          allColumns = [...allColumns, { ...column }];
        }
      });
      state.columns = allColumns;
      state.status = "succeeded";
    })
    .addCase(updateColumnHeaders.rejected, (state) => {
      state.status = "failed";
    })

    // for change in options array
    .addCase(updateMultiSelectOptions.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateMultiSelectOptions.fulfilled, (state, { payload }: any) => {
      state.columns.forEach((column, index) => {
        if (column.id == payload.columnId) {
          state.columns[index].metadata.option = payload.metaData;
          // state.columns[index].metadata = {...state?.columns[index]?.metadata,option:payload.metaData}
        }
      });
      state.status = "succeeded";
    })
    .addCase(updateMultiSelectOptions.rejected, (state) => {
      state.status = "failed";
    })

    // for add column to right and left
    .addCase(addColumnrightandleft.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addColumnrightandleft.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(addColumnrightandleft.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(addColumsToLeft.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addColumsToLeft.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(addColumsToLeft.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(updateCells.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateCells.fulfilled, (state, { payload }: any) => {
      const action = payload;
      state.skipReset = true;
      let arr = [...state.data];
      // const autonumberId = "fld" + state.tableId.substring(3) + "autonumber";
      const indexIdMapping = action?.indexIdMapping;
      action?.newData?.forEach((row) => {
        arr[indexIdMapping[row?.["autonumber"]]] = row;
      });
      if (action?.dataTypes == "file") {
        var row = arr[indexIdMapping[action?.rowIndex]];
        var imageArray: any = row[action?.columnId] || [];
        imageArray = [...imageArray, action.value];
        row[action?.columnId] = imageArray;
        arr[indexIdMapping[action?.rowIndex]] = row;
      }
      state.data = arr;
      state.status = "succeeded";
    })
    .addCase(updateCells.rejected, (state, payload: any) => {
      state.status = "failed";
      const action = payload.meta.arg;
      let arr = [...state.data];
      const indexIdMapping = action?.indexIdMapping;
      const updatedArray = action?.updatedArray;
      const fieldsObject = (Object.values(updatedArray)[0] as any)?.fields;
      if(!fieldsObject) return;
      const fieldsKey = Object.keys(fieldsObject)[0];
      let row = arr[Object.values(indexIdMapping)[0] as any];
      row[fieldsKey] = action?.oldData;
      arr[Object.values(indexIdMapping)[0] as any] = row;
      state.data = arr;
    })

    .addCase(addRows.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addRows.fulfilled, (state, { payload }) => {
      let arr = [...state.data];
      state.data = [...arr, payload];
      state.status = "succeeded";
    })
    .addCase(addRows.rejected, (state) => {
      state.status = "failed";
    })
    .addCase(addMultipleRows.pending, (state)=>{
      state.status = "loading";
    })
    .addCase(addMultipleRows.fulfilled, (state, {payload})=>{
      let arr = [...state.data];
      state.data = [...arr, ...payload]
      state.status = "succeeded";
    })
    .addCase(addMultipleRows.rejected, (state)=>{
      state.status = "failed";
    })

    .addCase(updateColumnsType.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateColumnsType.fulfilled, (state) => {
      state.status = "succeeded";
    })
    .addCase(updateColumnsType.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(updateColumnOrder.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateColumnOrder.fulfilled, (state, { payload }: any) => {
      state.columns = payload.columns;
      state.status = "succeeded";
    })
    .addCase(updateColumnOrder.rejected, (state) => {
      state.status = "failed";
    });
}
