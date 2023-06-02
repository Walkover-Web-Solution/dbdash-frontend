import { addRows, updateCells, addColumsToLeft,updateColumnOrder } from "../store/table/tableThunk";

export const addRow = (dispatch) => { 
    dispatch(addRows({ type: "add_row" }))    
    return;
}
export const addColumn = (dispatch,params,selectValue,metaData,textValue,selectedTable,selectedFieldName,linkedValueName) => { 
  console.log(params,selectValue,metaData,textValue,linkedValueName,selectedTable,selectedFieldName,"col")
      dispatch(addColumsToLeft({
      fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
        selectValue, metaData: metaData,selectedTable,selectedFieldName,linkedValueName
    }));
    return;
}

export const editCell = (cell, newValue,dispatch,fields) => { 
    const [col, row] = cell;
          const key = fields[col].id;
          dispatch(
          updateCells({
            columnId: key,
            rowIndex:row+1,
            value: newValue.data,
            dataTypes: newValue.kind,
          })
         );
          return;
}

export const reorderFuncton = (dispatch,currentIndex,newIndex,fields) => { 
const newOrder = Array.from(fields);
const key = fields[currentIndex].id;
const [removedColumn] = newOrder.splice(currentIndex, 1);
newOrder.splice(newIndex, 0, removedColumn);
dispatch(
  updateColumnOrder({
    columns: newOrder,
    id: key,
    oldIndex: currentIndex, 
    newIndex: newIndex,
  })
);
return;

}