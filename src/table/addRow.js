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

const callreducerforupdatecellsbeforeapi=(dispatch,updatedArray,indexIdMapping,data)=>
{
  let tabledata=[...data];
  let newDatatemp=[];
  updatedArray?.map((row)=>{
    let index=row?.where?.indexOf('=')+1;
    const autonumber=row?.where?.slice(index).trim();
    let obj={...tabledata[indexIdMapping[autonumber]]};
    Object.entries(row.fields).map(([key,value])=>{

      if(typeof value=='number')
      {
          obj[key]=value? value+"" : null;

      }
      else obj[key]=value || null;

    });
    
    tabledata[indexIdMapping[autonumber]]=obj;
    newDatatemp.push(obj);
    });

 dispatch(updatecellbeforeapi({updatedArray,indexIdMapping,newData:tabledata}));
}
export const editCell = (cell, newValue, dispatch, fields, params, dataType,tabledata) => {
const currentrow=tabledata[cell?.[1] ?? []];
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
          [key]: newdata || newValue?.data || null,
        }
      });
    }
    let lastElement = [valuesArray[valuesArray.length - 1]];

   
    indexIdMapping[currentrow[`fld${tableId}autonumber`]] = cell[1]
    let currentcellindexIdMapping = {};
    currentcellindexIdMapping[currentrow[`fld${tableId}autonumber`]] = cell[1];
    
    callreducerforupdatecellsbeforeapi(dispatch,lastElement,currentcellindexIdMapping,tabledata);
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
