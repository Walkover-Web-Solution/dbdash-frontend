import { toast } from "react-toastify";
import { addRows, updateCells, addColumsToLeft, updateColumnOrder } from "../store/table/tableThunk";
import debounce from 'lodash.debounce';
import { updatecellbeforeapi } from "../store/table/tableSlice";

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
  const batchSize = 1000; // Set the batch size to 1000
  const totalRows = valuesArray.length;

  for (let i = 0; i < totalRows; i += batchSize) {
    const batch = valuesArray.slice(i, i + batchSize);
    dispatch(
      updateCells({
        updatedArray: batch,
        indexIdMapping: indexIdMapping
      })
    );
  }
 
  valuesArray = []
  indexIdMapping = {}
}, 300);


export const editCell = (cell, newValue, dispatch, fields,currentrow, params, dataType) => {

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
    
    let currentupdatedvalue = {
      "where": `fld${tableId}autonumber = ${currentrow[`fld${tableId}autonumber`]}`,
      "fields": {}
    };
    
    if (dataType == "singleselect") {
      currentupdatedvalue.fields[key] = newValue;
    } else {
      currentupdatedvalue.fields[key] = newdata || newValue?.data || null;
    }
    
    valuesArray.push(currentupdatedvalue);
    indexIdMapping[currentrow[`fld${tableId}autonumber`]] = cell[1]
  
      updateCellsAfterSomeDelay(dispatch);
      dispatch(updatecellbeforeapi({ updatedvalue: currentupdatedvalue, rowIndex: cell[1], row: currentrow }))
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
