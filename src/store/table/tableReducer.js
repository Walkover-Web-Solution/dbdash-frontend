// import { current } from '@reduxjs/toolkit';
import { addColumns, addColumnsToRight, bulkAddColumns, updateColumnsType, updateCells, addRows, deleteColumns, updateColumnHeaders, addColumsToLeft } from './tableThunk.js';
import { randomColor, shortId } from "../../table/utils";


export const initialState = {
  columns: [],
  data: [],
  tableId: [],
  dbId: [],
  skipReset: false,
  status: "idle",
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

  deleteColumn(state, payload) {
    const action = payload.payload;
    if (action) {
      var deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }
    return {
      ...state,
      skipReset: true,
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
      skipReset: true,
      columns: [
        ...state.columns.slice(0, index),
        { ...state.columns[index], label: action.label },
        ...state.columns.slice(index + 1, state.columns.length)
      ]
    };
  },
  addColumnToRight(state, payload) {
    const action = payload.payload;
    if (action) {
      var rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }
    var rightId = shortId();
    return {
      ...state,
      skipReset: true,
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
  updateTableData(state, payload) {

    return {
      ...state, data: payload.payload
    }
  },
  updateCell(state, payload) {
    const action = payload.payload
    return {
      ...state,
      skipReset: true,
      data: state.data.map((row, index) => {
        if (index === action.rowIndex) {
          return {
            ...state.data[action.rowIndex],
            [action.columnId]: action.value
          };
        }
        return row;
      })
    };
  },
  addRow(state) {
    return {
      ...state,
      skipReset: true,
      data: [...state.data, {}]
    };
  },
  updateColumnType(state, payload) {
    const action = payload.payload
    if (action) {

      var typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
    }

    switch (action.dataType) {
      case "integer":
        if (state.columns[typeIndex].dataType === "integer") {
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
                : Number.parseInt(row[action.columnId])
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
            skipReset: true
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
            skipReset: true
          };
        }
      case "text":
        if (state.columns[typeIndex].dataType === "text") {
          return state;
        } else if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,
            skipReset: true,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ]
          };
        } else {
          return {
            ...state,
            skipReset: true,
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
      case "varchar":
        if (state.columns[typeIndex].dataType === "varchar") {
          return state;
        } else if (state.columns[typeIndex].dataType === "select") {
          return {
            ...state,
            skipReset: true,
            columns: [
              ...state.columns.slice(0, typeIndex),
              { ...state.columns[typeIndex], dataType: action.dataType },
              ...state.columns.slice(typeIndex + 1, state.columns.length)
            ]
          };
        } else {
          return {
            ...state,
            skipReset: true,
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
        state.columns = action.payload.columns;
        state.data = action.payload.row;
        state.tableId = action.payload.tableId;
        state.dbId = action.payload.dbId
      }
      state.status = "succeeded";

    })
    .addCase(bulkAddColumns.rejected, (state) => {
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
    .addCase(updateColumnHeaders.fulfilled, (state) => {
      state.status = "succeeded";

    })
    .addCase(updateColumnHeaders.rejected, (state) => {
      state.status = "failed";
    })


    // for add column to right
    .addCase(addColumnsToRight.pending, (state) => {
      state.status = "loading"
    })
    .addCase(addColumnsToRight.fulfilled, (state) => {

      state.status = "succeeded";

    })
    .addCase(addColumnsToRight.rejected, (state) => {
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
    .addCase(updateCells.fulfilled, (state) => {
      state.status = "succeeded";

    })
    .addCase(updateCells.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(addRows.pending, (state) => {
      state.status = "loading"
    })
    .addCase(addRows.fulfilled, (state) => {
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
}
