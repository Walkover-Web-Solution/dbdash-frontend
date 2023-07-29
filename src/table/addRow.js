import { toast } from "react-toastify";
import {GridCellKind} from "@glideapps/glide-data-grid";
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
export const editCell = (cell, newValue, dispatch, fields, params, allRowsData, dataType,isSingleCellSelected) => {
  const tableId = params?.tableName.substring(3);
  const fieldId=fields[cell[0]]?.id;
  const currentrow= allRowsData[cell?.[1] ?? []];
  const rowAutonumber=currentrow[`fld${tableId}autonumber`];

  if(params?.templateId || fields[cell[0]]?.dataType == "attachment") return;

  if (fields[cell[0]]?.dataType == "multipleselect") {
    editmultipleselect(newValue, allRowsData[cell[1]][fieldId] || [], cell,params,tableId, fieldId,dispatch,rowAutonumber);
    return;
  }

  if (newValue?.readonly == true || newValue?.data == allRowsData[cell[1]][fieldId] ||(!newValue?.data  && !allRowsData[cell[1]][fieldId])) return;
 

  const col = cell[0];
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
      currentupdatedvalue.fields[key] = newValue.data.value;
    } else {
      currentupdatedvalue.fields[key] = newdata || newValue?.data || null;
    }
    
    valuesArray.push(currentupdatedvalue);
    indexIdMapping[currentrow[`fld${tableId}autonumber`]] = cell[1]
  
    if (isSingleCellSelected==true) {
      dispatch(updatecellbeforeapi({ updatedvalue: currentupdatedvalue, rowIndex: cell[1], row: currentrow }));
      dispatch(updateCells({
        updatedArray: [currentupdatedvalue],
        indexIdMapping: { [currentrow[`fld${tableId}autonumber`]]: cell[1]},
        oldData : currentrow[key]
      }))
    }
    else updateCellsAfterSomeDelay(dispatch);
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
export const getDataExternalFunction=(cell,allRowsData,fieldsToShow,readOnlyDataTypes)=>{
  const [col, row] = cell;
  const dataRow = allRowsData[row] || [];

  if (dataRow) {
    const d = dataRow[fieldsToShow[col]?.id];
    let { dataType } = fieldsToShow[col] || "";
    const readOnlyOrNot=(fieldsToShow[col]?.metadata?.isLookup || readOnlyDataTypes.includes(dataType))?true:false;
   
    if (dataType === "autonumber") {
      return {
        allowOverlay: true,
        kind: GridCellKind.Number,
        readonly: readOnlyOrNot,
        data: d || "",
        displayData: d?.toString() || "",
      };
    }
    else if (readOnlyDataTypes.includes(dataType) ) {
      
      let updatedtime=d;
      if(d!==null && dataType === "updatedat")
      updatedtime=new Date(d*1000)
      
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        displayData: (d && updatedtime.toString()) || "",
        data: (d && updatedtime.toString()) || "",
      };
    } 
    
    else if (dataType === "datetime") {
      const currentDate = d && !isNaN(new Date(d)) ? new Date(d) : null;
      if (currentDate instanceof Date && !isNaN(currentDate)) {
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const year = currentDate.getFullYear().toString().padStart(4, "0");
        const formattedDate = `${day}-${month}-${year}`;
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "date-picker-cell",
            date: currentDate,
            displayDate: formattedDate,
            format: "date",
          },
        };
      } else {
    return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "date-picker-cell",
            date: new Date(),
            displayDate: "",
            format: "date",
          },
        };
      }
    } else if (dataType === "longtext") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        allowWrapping: true,
        displayData: d || "",
        data: d || "",
      };
    }
    else if (dataType === "url") {
      return {
        kind: GridCellKind.Uri,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        displayData: d || "",
        data: d || "",
      };
    }
    else if (dataType === "singlelinetext") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        displayData: d || "",
        data: d || "",
        wrapText: false,
        multiline: false,
      };
    } else if (dataType === "phone") {
      return {
        allowOverlay: true,
        readonly: readOnlyOrNot,

        kind: GridCellKind.Number,
        data: d || "",
        displayData: d || "",
      };
    } else if (dataType === "numeric") {
      return {
        allowOverlay: true,
        readonly: readOnlyOrNot,

        kind: GridCellKind.Number,
        data: d?.toString() || "",
        displayData: d?.toString() || "",
      };
    } else if (dataType === "multipleselect") {
      const possibleTags = fieldsToShow[col]?.metadata?.option;
      let newarr = [];
      possibleTags &&
        possibleTags?.map((x) => {
          let newx = {
            tag: x.value,
            color: x.color,
          };
          newarr.push(newx);
        });
      return {
        kind: GridCellKind.Custom,
        allowOverlay: true,
        copyData: "4",
        data: {
          kind: "tags-cell",
          possibleTags: newarr || [],
          readonly: readOnlyOrNot,
          tags: d || [],
        },
      };
    } else if (dataType == "attachment" && d != null) {
      return {
        kind: GridCellKind.Image,
        data: d,
        readonly: readOnlyOrNot,

        allowAdd: true,
      };
    } else if (dataType === "singleselect") {
      return {
        kind: GridCellKind.Custom,
        allowOverlay: true,
        copyData: d,
        data: {
          readonly: readOnlyOrNot,
          kind: "dropdown-cell",
          allowedValues: fieldsToShow[col]?.metadata?.option || [],
          value: d || "",
        },
      };
    } 
    else if (dataType === "checkbox" ) {
           let show=false;
           if(d)
           {
             if(typeof d=='string')
             {
               show=d=='true'?true:false;
             }
             else show=d;
           }
           return {
          readonly: readOnlyOrNot,

             kind: GridCellKind.Boolean,
             data: show,
             allowOverlay: false,
           };
         }
   
   else {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        displayData: d?.toString()|| "",
        data:  d?.toString() || "",
      };
    }
  } else {
    return {};
  }
}
const editmultipleselect = (newValue, oldValuetags, cell, params, tableId, fieldId, dispatch, rowAutonumber) => {
  if (params?.templateId || !fieldId) return;

  const newValuetags = newValue.data.tags || [];
  const addedTags = newValuetags.filter(tag => !oldValuetags.includes(tag));
  const removedTags = oldValuetags.filter(tag => !newValuetags.includes(tag));

  let updateArray = [];
  const rowIndex = rowAutonumber;
  
  if (addedTags.length > 0) {
    updateArray.push({
      where: `fld${tableId}autonumber = ${rowIndex}`,
      fields: { [fieldId]: addedTags.map((element) => `'${element}'`).join(",").slice(1,-1) },
    });   
  }
  
  if (removedTags.length > 0) {
    updateArray.push({
      where: `fld${tableId}autonumber = ${rowIndex}`,
      fields: { [fieldId]: { delete: removedTags } },
    });
  }

  dispatch(updateCells({ updatedArray: updateArray, indexIdMapping: { [rowIndex]: cell[1] } }));
};
