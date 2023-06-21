
import { addColumns, addColumnrightandleft, bulkAddColumns, updateColumnsType, updateCells, addRows, deleteColumns, updateColumnHeaders, addColumsToLeft, updateColumnOrder, updateMultiSelectOptions, deleteRows } from './tableThunk.js';
import { randomColor, shortId } from "../../table/utils";
// import { current } from '@reduxjs/toolkit';

export const initialState = {
  columns: [],
  data: [],
  tableId: null,
  dbId: null,
  status: "idle",
  pageNo: 0,
  isTableLoading: true,
  isMoreData: true,
  filterId: null

};

export const reducers = {
  addOptionToColumn(state, payload) {
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
            ...state.columns[optionIndex].options,
            { label: action.option, backgroundColor: action.backgroundColor }
          ]
        },
        ...state.columns.slice(optionIndex + 1, state.columns.length)
      ];

      state.skipReset = true;
    }
  },
  resetData() {
    return {
      columns: [],
      data: [],
      tableId: null,
      dbId: null,
      status: "idle",
      pageNo: 0,
      isTableLoading: true,
      isMoreData: true,
      filterId: null
    }
  },
  deleteColumn(state, payload) {
    const action = payload.payload;
    if (!(action?.fieldName)) return;
    if (action) {
      var deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }
    return {
      ...state,

      columns: [
        ...state.columns.slice(0, deleteIndex),
        ...state.columns.slice(deleteIndex + 1, state.columns.length)
      ]
    };
  },
  updateColumnHeader(state, payload) {
    const action = payload.payload;
    if (action) {
      var index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }

    return {
      ...state,

      columns: [
        ...state.columns.slice(0, index),
        { ...state.columns[index], label: action?.label },
        ...state.columns.slice(index + 1, state.columns.length)
      ]

    };
  },
  addColumnrightandleft(state, payload) {
    const action = payload.payload;
    if (action) {
      var rightIndex = state.columns.findIndex(
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
          options: []

        },
        ...state.columns.slice(rightIndex + 1, state.columns.length)
      ]
    };
  },
  addColumnToLeft(state, payload) {
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
          options: []
        },
        ...state.columns.slice(leftIndex, state.columns.length)
      ]

    }
  },

  setTableLoading(state, { payload }) {
    return {
      ...state, isTableLoading: payload
    }
  },
  updateTableData(state, payload) {

    return {
      ...state, data: payload.payload
    }
  },

  updateCell(state, payload) {
    const action = payload.payload

    state.skipReset = true;
    let arr = [];

    state.data.forEach((ele) => {
      if (ele.id !== action.rowIndex) {
        arr = [...arr, { ...ele }];
      }
      else {

        if (action?.dataTypes == "file") {
          var arrr = ele?.[action?.columnId] == null ?
            [] : ele?.[action?.columnId];
          arrr.push(action.value)
          arr = [...arr, { ...ele, [action.columnId.toLowerCase()]: arrr }];
        }
        else {
          arr = [...arr, { ...ele, [action.columnId.toLowerCase()]: action.value }];
        }
      }
    });
    state.data = arr;

  },



  updateColumnType(state, payload) {
    const action = payload.payload
    if (action) {

      var typeIndex = state.columns.findIndex(
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
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: isNaN(row[action.columnId])
                ? ""
                : Number.parseFloat(row[action.columnId])
            }))
          };
        }
      case "select":
        if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
          };
        } else {
          let options = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor()
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
                options: [...state.columns[typeIndex].options, ...options]
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
          };
        }
      case "longtext":
        if (state.columns[typeIndex].dataType === "text") {
          return state;
        } else if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ]
          };
        } else {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: row[action.columnId] + ""
            }))
          };
        }

      case "singleselect":
        if (state.columns[typeIndex].dataType === "singleselect") {
          return {
            ...state,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
          };
        } else {
          let options = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor()
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
                options: [...state.columns[typeIndex].options, ...options]
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
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
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
          };
        } else {
          let options = [];
          state.data.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor()
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
                options: [...state.columns[typeIndex].options, ...options]
              },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
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
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ]
          };
        } else {
          return {
            ...state,

            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ],
            data: state.data.map((row) => ({
              ...row,
              [action.columnId]: row[action.columnId] + ""
            }))
          };
        }
      default:
        return state;
    }
  }

}



export function extraReducers(builder) {
  builder
    //   add columns
    .addCase(addColumns.pending, (state) => {

      state.status = "loading"
    })
    .addCase(addColumns.fulfilled, (state) => {

      state.status = "succeeded";

    })
    .addCase(addColumns.rejected, (state) => {

      state.status = "failed";
    })



    .addCase(bulkAddColumns.pending, (state) => {
      state.status = "loading"
    })
    .addCase(bulkAddColumns.fulfilled, (state, action) => {
      if (action.payload) {
        if (action.payload.columns) state.columns = action.payload.columns;
        state.data = action.payload.row;
        state.tableId = action.payload.tableId;
        state.dbId = action.payload.dbId;
        state.pageNo = action?.payload?.pageNo ? action?.payload?.pageNo : state.pageNo + 1;
        state.isMoreData = action?.payload?.isMoreData;
        state.filterId = action?.payload?.filterId;
        // state.page = 100;
      }
      state.status = "succeeded";

    })
    .addCase(bulkAddColumns.rejected, (state) => {
      state.status = "failed";
      state.isTableLoading = false
    })

    .addCase(deleteRows.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(deleteRows.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    })
    .addCase(deleteRows.rejected, (state) => {
      state.status = "failed";
    })


    .addCase(deleteColumns.pending, (state) => {
      state.status = "loading"
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
      state.status = "loading"
    })
    .addCase(updateColumnHeaders.fulfilled, (state, { payload }) => {
      let allColumns = [];
      state.columns.forEach(column => {
        if (column.id == payload?.id) {
          allColumns = [...allColumns, { ...payload }];
        }
        else {
          allColumns = [...allColumns, { ...column }];
        }
      });
      state.columns = allColumns
      state.status = "succeeded";

    })
    .addCase(updateColumnHeaders.rejected, (state) => {
      state.status = "failed";
    })

    // for change in options array 
    .addCase(updateMultiSelectOptions.pending, (state) => {
      state.status = "loading"
    })
    .addCase(updateMultiSelectOptions.fulfilled, (state, { payload }) => {

      state.columns.forEach((column, index) => {
        if (column.id == payload.columnId) {
          state.columns[index].metadata.option = payload.metaData;
        }
      });
      state.status = "succeeded";

    })
    .addCase(updateMultiSelectOptions.rejected, (state) => {
      state.status = "failed";
    })



    // for add column to right and left
    .addCase(addColumnrightandleft.pending, (state) => {
      state.status = "loading"
    })
    .addCase(addColumnrightandleft.fulfilled, (state) => {

      state.status = "succeeded";

    })
    .addCase(addColumnrightandleft.rejected, (state) => {
      state.status = "failed";
    })


    .addCase(addColumsToLeft.pending, (state) => {
      state.status = "loading"
    })
    .addCase(addColumsToLeft.fulfilled, (state) => {
      state.status = "succeeded";

    })
    .addCase(addColumsToLeft.rejected, (state) => {
      state.status = "failed";
    })


    .addCase(updateCells.pending, (state) => {
      state.status = "loading"
    })
    .addCase(updateCells.fulfilled, (state, { payload }) => {
      // try {
      const action = payload;
      state.skipReset = true;
      //   let table =  [...state.data] ||  [];
      //   let tableitem = table?.filter(item =>
      //     Object.entries(item)[1][1] == action.rowIndex
      //   );
      //   tableitem[action.columnId] = action.value;
      //   const index = table.findIndex(item =>
      //     Object.entries(item)[1][1] == action.rowIndex
      //   );

      //   if (index !== -1) {
      //     table[index] = tableitem;
      //   }


      //   state.data = table;
      // }
      // catch (e) {
      //   console.log(e, "erorr");
      // }
      let arr = []
      // let updatedSeriesData = table?.map((series) => {
      //   series[action.columnId] = payload.value;
      //   return series; // Return the updated series object
      // });
      if (action?.updatedArray) {
        arr = state.data.map(obj1 => {
          const matchedObj = action.newData.find(obj2 => obj2["fld" + state.tableId.substring(3) + "autonumber"] === obj1["fld" + state.tableId.substring(3) + "autonumber"]);
          return matchedObj ? matchedObj : obj1;
        });
      }
      else {
        state.data.forEach((ele) => {
          const id = ele.id ? "id " : "fld" + state.tableId.substring(3) + "autonumber"
          if (ele[id] !== action.rowIndex) {
            arr = [...arr, { ...ele }];
          }
          else {

            if (action?.dataTypes == "file") {
              var arrr = ele?.[action?.columnId] == null ? [] : ele?.[action?.columnId];
              arrr.push(action.value)
              arr = [...arr, { ...ele, [action.columnId.toLowerCase()]: arrr }];
            }
            else {
              arr = [...arr, action.newData[0]];
            }
          }
        });
      }

      state.data = arr;
      state.status = "succeeded"
    })
    .addCase(updateCells.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(addRows.pending, (state) => {

      state.status = "loading"

    })
    .addCase(addRows.fulfilled, (state, { payload }) => {
      let arr = [...state.data]
      state.data = [...arr, payload]
      state.status = "succeeded";

    })
    .addCase(addRows.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(updateColumnsType.pending, (state) => {
      state.status = "loading"
    })
    .addCase(updateColumnsType.fulfilled, (state) => {
      state.status = "succeeded";

    })
    .addCase(updateColumnsType.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(updateColumnOrder.pending, (state) => {
      state.status = "loading"

    })
    .addCase(updateColumnOrder.fulfilled, (state, { payload }) => {
      state.columns = payload.columns
      state.status = "succeeded";

    })
    .addCase(updateColumnOrder.rejected, (state) => {
      state.status = "failed";
    })
}

