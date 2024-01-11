import {GridCellKind} from "@glideapps/glide-data-grid";
import { addRows, updateCells, addColumsToLeft, updateColumnOrder, addMultipleRows } from "../store/table/tableThunk";
import { updatecellbeforeapi } from "../store/table/tableSlice";
export const addRow = (dispatch) => {
  dispatch(addRows({ type: "add_row" }))
  return;
}
export const addMultipleRow = (dispatch, rows, fromCSV)=>{
  dispatch(addMultipleRows({type:"add_multiple_rows", rows:rows, fromCSV:fromCSV}))
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

const updateCellsBatchFunction = async (dispatch,tableId,allRowsData,fields,list, params, users) => {
  let  updatedArray = []
  let indexIdMapping = {}
  let listLength=list.length;
  for(let i=0;i<listLength;i++)
  {
    const {location:cell, value:newValue}=list[i];
    let currentRow=allRowsData[cell[1]];
    let fieldId=fields[cell[0]]?.id;
    let rowAutonumber=currentRow[`autonumber`];

    const dataType=fields[cell[0]]?.dataType;

    let currentupdatedvalue;
    if(dataType === "multipleselect"){
      currentupdatedvalue = editmultipleselect(newValue, currentRow[fieldId] || [], cell, params, fieldId, dispatch, rowAutonumber);
    }else{
      currentupdatedvalue = currentupdatedvalue=giveCurrentUpdatedValue(dataType,newValue,tableId,currentRow,fieldId, users);
    }
    let updatedArrayLength=updatedArray.length;
    let latestElement=updatedArray[updatedArrayLength-1];

    if (!currentupdatedvalue) continue;
    if([rowAutonumber] in indexIdMapping && updatedArrayLength>0 && latestElement.where==currentupdatedvalue.where && dataType !== "multipleselect")
    {
      let obj=latestElement.fields;
      const[key,value]= Object.entries(currentupdatedvalue.fields)[0];
      obj[key]=value;
      updatedArray[updatedArrayLength - 1] = { ...latestElement, fields: obj }; 
    }
    else{
      indexIdMapping[rowAutonumber] = cell[1];
      if(dataType === "multipleselect"){
        updatedArray.push(...currentupdatedvalue);
      }else{
        updatedArray.push(currentupdatedvalue);
      }
    }
    
    if( (i%1000==0 && i!=0) || i==listLength-1)
    {
      dispatch(updateCells({updatedArray,indexIdMapping}));
      updatedArray = []
      indexIdMapping = {}
    }           
  }

}

export const editCellsInBatch=(list, dispatch,fields,params,allRowsData, users) => {
  const cell=list[0].location;

  if(params?.templateId || fields[cell[0]]?.dataType == "attachment") return;
  const tableId = params?.tableName.substring(3);

  
  if(list.length>1)
  {
    updateCellsBatchFunction(dispatch,tableId,allRowsData,fields,list, params, users);
    return ;
  }
const newValue=list[0].value;
  let currentRow=allRowsData[cell[1]];
  let fieldId=fields[cell[0]]?.id;
  let rowAutonumber=currentRow[`autonumber`];
  let currentupdatedvalue;
  let isMultipleSelect = fields[cell[0]]?.dataType == "multipleselect";
  if (isMultipleSelect) {
    currentupdatedvalue = editmultipleselect(newValue, currentRow[fieldId] || [], cell,params, fieldId,dispatch,rowAutonumber);
    // return;
  }else{
    currentupdatedvalue=[giveCurrentUpdatedValue(fields[cell[0]]?.dataType,newValue,tableId,currentRow,fieldId, users)];
  }
  
  if(!currentupdatedvalue) return ;
  if(!isMultipleSelect){
    dispatch(updatecellbeforeapi({ updatedvalue: currentupdatedvalue[0], rowIndex: cell[1], row: currentRow }));
  }
  dispatch(updateCells({
    updatedArray: currentupdatedvalue,
    indexIdMapping: { [rowAutonumber]: cell[1]},
    oldData : currentRow[fieldId]
  }))
  
}
const giveCurrentUpdatedValue = (dataType, newValue, tableId, currentRow, fieldId, users) => {
  const rowAutonumber = currentRow[`autonumber`];
  const isDatetime = dataType === "datetime";
  const isSingleSelect = dataType === "singleselect";
  const isUser = dataType === "user";

  let newdata = isDatetime ? (newValue.data.date || "") : (isSingleSelect || isUser ? newValue.data.value : newValue.data);
  if(isUser){
    let userEmail = newdata?.split("(")[1]?.slice(0, -1);
    let userId = Object.keys(users).find(user => users[user].email === userEmail);
    newdata = [userId];
  }
  const where=`autonumber = ${rowAutonumber}`;
  const fields=isSingleSelect?{[fieldId]:newdata}:{ [fieldId]: newdata || null };
  return newdata !== currentRow[fieldId] ? { where, fields} : null;
};

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
export const getDataExternalFunction=(cell,allRowsData,fieldsToShow,readOnlyDataTypes, users)=>{
  const [col, row] = cell;
  const dataRow = allRowsData[row] || [];

  if (dataRow) {
    let d = dataRow[fieldsToShow[col]?.id];
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
      const dateObj = new Date(d);
      const currentDate = d && (dateObj !== "Invalid Date" && !isNaN(dateObj) ? dateObj : null);
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
          copyData: d.toString(),
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
          copyData: "",
          data: {
            kind: "date-picker-cell",
            displayDate: "",
            format: "date",
          },
        };
      }
    } else if (dataType === "longtext" || dataType === "json") {
      d = d ? (typeof d !== "string" &&  dataType === "json" ? JSON.stringify(d) : d) : "";
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: readOnlyOrNot,
        allowWrapping: true,
        displayData: d,
        data: d,
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
        displayData: d?.toString() || "",
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
        copyData: d?.toString() || "",
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
        copyData: d || "",
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
   
   else if(dataType === "user"){
    let dValue;
    if(!d || d.length === 0){
      dValue = undefined;
    }else{
      dValue = userIdToProfile(users[d[0]]);
    }
      return {
        kind: GridCellKind.Custom,
        allowOverlay: true,
        copyData: dValue || "",
        data: {
          displayData : d ? (users?.[d]?.first_name + " " + users?.[d]?.last_name) : "",
          readonly: readOnlyOrNot,
          kind: "dropdown-cell",
          allowedValues: Object.values(users).map(user => userIdToProfile(user)), //users.map(user => user.first_name + " " + user.last_name),
          value: dValue
        }
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
const editmultipleselect = (newValue, oldValuetags, cell, params, fieldId, dispatch, rowAutonumber) => {
  if (params?.templateId || !fieldId) return;

  const newValuetags = newValue.data.tags || [];
  const addedTags = newValuetags.filter(tag => !oldValuetags.includes(tag));
  const removedTags = oldValuetags.filter(tag => !newValuetags.includes(tag));

  let updateArray = [];
  const rowIndex = rowAutonumber;
  
  if (addedTags.length > 0) {
    updateArray.push({
      // where: `autonumber = ${rowIndex}`,
      where: `autonumber = ${rowIndex}`,
      fields: { [fieldId]: addedTags.map((element) => `'${element}'`).join(",").slice(1,-1) },
    });   
  }
  
  if (removedTags.length > 0) {
    updateArray.push({
      // where: `autonumber = ${rowIndex}`,
      where: `autonumber = ${rowIndex}`,
      fields: { [fieldId]: { delete: removedTags } },
    });
  }
  return updateArray;
};
const userIdToProfile = (user)=>{
  if(!user) return "";
  return `${user?.first_name} ${user?.last_name} (${user?.email})`
}
