import { addRows, updateCells, addColumsToLeft,updateColumnOrder } from "../store/table/tableThunk";

export const addRow = (dispatch) => { 
    dispatch(addRows({ type: "add_row" }))    
    return;
}
export const addColumn = (dispatch,params,selectValue,metaData,textValue,selectedTable,selectedFieldName,linkedValueName) => { 
      dispatch(addColumsToLeft({
      filterId:params?.filterName,fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
        selectValue, metaData: metaData,selectedTable,selectedFieldName,linkedValueName
    }));
    return;
}

export const editCell = (cell, newValue,dispatch,fields,arrr,params,currentrow,dataType) => { 
  const col = cell[0];
if(newValue?.data && newValue.data.kind=='tags-cell') return;
  const key = fields[col].id;
  if (currentrow && Object.entries(currentrow)[1] && Object.entries(currentrow)[1][1]) 
    { 
      let newdata=dataType=='phone'?newValue?.data?.toString():newValue?.data;
          dispatch(
          updateCells({
            columnId: key,
            rowIndex :Object.entries(currentrow)[1][1],
            value:  newValue?.data || newdata || newValue,
            dataTypes: newValue?.kind,
          })
         );
          return;
}
}

export const reorderFuncton = (dispatch,currentIndex,newIndex,fields,filterId,setFields) => { 
const newOrder = Array.from(fields);
const key = fields[currentIndex].id;
const [removedColumn] = newOrder.splice(currentIndex, 1);
newOrder.splice(newIndex, 0, removedColumn);
dispatch(
  updateColumnOrder({
    filterId:filterId,
    columns: newOrder,
    id: key,
    oldIndex: currentIndex, 
    newIndex: newIndex,
  })
);
setFields(newOrder)
return;

}
