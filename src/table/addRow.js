import { addRows, addColumnrightandleft  } from "../store/table/tableThunk";

export const addRow = (dispatch) => { 
    dispatch(addRows({ type: "add_row" }))    
    return;
}
export const addColumn = (dispatch,params,selectValue,metaData,textValue) => { 
    dispatch(addColumnrightandleft({
      fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
        selectValue, metaData: metaData
    }));
    return;
}