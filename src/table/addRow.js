import { toast } from "react-toastify";
import { addRows, updateCells, addColumsToLeft, updateColumnOrder } from "../store/table/tableThunk";
import debounce from 'lodash.debounce';
export const addRow = (dispatch) => {
  dispatch(addRows({ type: "add_row" }))
  return;
}
export const addColumn = (dispatch, params, selectValue, metaData, textValue, selectedTable, selectedFieldName, linkedValueName, queryToSend, userQuery) => {
  dispatch(addColumsToLeft({
    filterId: params?.filterName, fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
      selectValue, metaData: metaData, selectedTable, selectedFieldName, linkedValueName,
    query: queryToSend,
    userQuery: userQuery
  }));
  return;
}
let valuesArray = [];
let indexIdMapping = {}
const updateCellsAfterSomeDelay = debounce(async (dispatch) => {
  dispatch(
    updateCells({
      updatedArray: valuesArray,
      indexIdMapping : indexIdMapping
    })
  );
  valuesArray = []
}, 300);

export const editCell = (cell, newValue, dispatch, fields, params, currentrow, dataType) => {
  if (newValue?.data && newValue.data.kind == 'tags-cell') return;
  const col = cell[0];
  const tableId = params?.tableName.substring(3);
  const key = fields[col].id;
  if (currentrow && Object.entries(currentrow)[1] && Object.entries(currentrow)[1][1]) {
    let newdata;
    if (dataType == "datetime") {
      if (!newValue?.data?.date && newValue?.data?.date != "") {
        toast.warning("Invalid or undefined date");
        return;
      }
      newdata = newValue?.data?.date;

    } else {
      newdata = dataType == 'phone' || dataType == 'checkbox' ? newValue?.data?.toString() : newValue?.data;
    }
    if (dataType == "singleselect") {
      valuesArray.push({
        "where": `fld${tableId}autonumber = ${currentrow[`fld${tableId}autonumber`]}`,
        "fields": {
          [key]: newValue?.data || newdata || newValue,
        }
      });

    }
    else {
      valuesArray.push({
        "where": `fld${tableId}autonumber = ${currentrow[`fld${tableId}autonumber`]}`,
        "fields": {
          [key]: newdata || newValue?.data,
        }
      });
    }
    indexIdMapping[currentrow[`fld${tableId}autonumber`]] =  cell[1]
    updateCellsAfterSomeDelay(dispatch)
    return;
  }
}

export const reorderFuncton = (dispatch, currentIndex, newIndex, fields, fields1, filterId, setFields) => {
  const newOrder = Array.from(fields);
  const key = fields[currentIndex].id;

  let newIndex1 = fields1.indexOf(newOrder[newIndex]);
  const [removedColumn] = newOrder.splice(currentIndex, 1);
  newOrder.splice(newIndex, 0, removedColumn);

  dispatch(
    updateColumnOrder({
      filterId: filterId,
      columns: newOrder,
      id: key,
      oldIndex: currentIndex,
      newIndex: newIndex1,
    })
  );
  setFields(newOrder)
  return;

}
