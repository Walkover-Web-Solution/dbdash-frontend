import { addRows, addColumnrightandleft, updateCells } from "../store/table/tableThunk";

export const addRow = (dispatch) => { 
    dispatch(addRows({ type: "add_row" }))    
    return;
}
export const addColumn = (dispatch,params,selectValue,metaData,textValue) => { 
  console.log(params,selectValue,metaData,textValue,"col")
    dispatch(addColumnrightandleft({
      fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
        selectValue, metaData: metaData
    }));
    return;
}

export const editCell = (cell, newValue,dispatch,fields) => { 
    const [col,row] = cell;
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

