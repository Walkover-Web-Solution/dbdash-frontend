import {addColumnrightandleft } from "../store/table/tableThunk";

export const CreateLeftorRightColumn = (dispatch, params, selectValue, metaData, textValue) => { 
    dispatch(addColumnrightandleft({
      fieldName: textValue,
      dbId: params?.dbId,
      tableId: params?.tableName,
      fieldType: selectValue,
      metaData: metaData
    }));
    return;
}
