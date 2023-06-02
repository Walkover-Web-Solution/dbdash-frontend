import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import {  bulkAddColumns, updateColumnHeaders} from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell } from "./addRow";
// import  debounce  from 'lodash.debounce';

export default function MainTable() {
  const params = useParams();
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.table.columns);
  const dataa = useSelector((state) => state.table.data);
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectValue, setSelectValue] = useState('longtext');
  const [open, setOpen] = useState(false);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("")
  const [textValue, setTextValue] = useState('');
  const [data, setData] = useState(dataa);
  const [metaData, setMetaData] = useState({});
//  const [columns, setColumns] = useState(second)

  useEffect(() => {
    dispatch(
      bulkAddColumns({
        dbId: params?.dbId,
        tableName: params?.tableName,
      })
    );
  }, []);

  const createLeftorRightColumn = () => {
    setOpen(false);
    addColumn(dispatch,params,selectValue,metaData,textValue);
    setSelectValue('longtext')
  }

  const addRows = () => {
      addRow(dispatch);
  };

  const handleRowMoved = useCallback((from, to) => {
    reorderRows(from, to, data, setData);
  }, [data, setData]);

  const onCellEdited = useCallback(
    (cell, newValue) => {
    editCell(cell, newValue,dispatch,fields);
    },[data, fields]
     );

     const handleColumnResize = (fields, newSize, colIndex, newSizeWithGrow) => {
      console.log(fields, newSize, colIndex, newSizeWithGrow,786)
      // console.log(fieldName,786)
        // debounce(async()=>{
        dispatch(updateColumnHeaders({
            dbId:params?.dbId,
            tableName:params?.tableName,
            fieldName:fields?.id,
            // columnId : fields?.id,
            metaData:{width:newSize}
        }));
        
    
      // setColumns([...columns]); // Assuming you're using React and maintaining the columns state using useState
      };

  const getData = useCallback((cell) => {
   
    const [col, row] = cell;
    const dataRow = dataa[row];
    const d = dataRow[fields[col].id];
    const { dataType } = fields[col];

    // const handlePhoneChange = (event) => {
    //   const newValue = event.target.value;
    //   console.log(newValue)
    //   // Handle the phone number change here
    // };

    // if (dataType === "phone") {
    //   return {
    //     kind: GridCellKind.Custom,
    //     allowOverlay: true,
    //     copyData: "4",
    //     data: {
    //       kind: "phone-cell",
    //       value: d || "",
    //       onChange: (newValue) => handlePhoneChange(newValue, cellProps),
    //     },
    //   };
    // }
    
    if (dataType === "autonumber" ) {
      return {
        allowOverlay: true,
        kind: GridCellKind.Number,
        data: d,
        displayData: d.toString(),
      };
    }
    else if (dataType === "createdat" || dataType === "createdby" || dataType === "longtext"|| dataType === "rowid") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d || "",
        data: d || "",
      };
    }
    // else if (dataType === "checkbox") {
    //   return {
    //     kind: GridCellKind.Boolean,
    //     allowOverlay: true,
    //     readonly: false,
    //     displayData: 0 || "",
    //     data: 0 || "",
    //   };
    // }
    else if(dataType === "multipleselect" && d != null){
      return {
        kind: GridCellKind.Bubble,
        data: d,
        allowOverlay: true
      };
    }
    else if (dataType === "attachment" && d != null) {
      return {
        kind: GridCellKind.Image,
        data: d,
        allowOverlay: true,
        allowAdd: true
      };
    } 
    else {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d || "",
        data: d || "",
      };
    }
  }, [dataa, fields]);


  // function CustomCellRenderer(cell) {
  //   console.log(cell,"cell")
  //   const { dataType, value } = cell;
  //   if (dataType === "phone") {
      // const handlePhoneChange = (event) => {
      //   const newValue = event.target.value;
      //   console.log(newValue)
      //   // Handle the phone number change here
      // };
  
  //     return (
  //       <input type="tel" value={value} onChange={handlePhoneChange} />
  //     );
  //   }
  
  //   // Render the default cell content if it's not a phone type
  //   return value;
  // }

  return (
    <div className="table-container">
      <DataEditor
        getCellContent={getData}
        // customCellRenderer={CustomCellRenderer}
        onRowAppended={addRows}
        columns={fields}
        rows={dataa.length}
        rowMarkers="both"
        onCellEdited={onCellEdited}
        onRowMoved={handleRowMoved}
        getCellsForSelection={true}
        onColumnResizeEnd={handleColumnResize}
        scaleToRem={true}
        // onColumnResize={fields}
        onPaste={true}
        rightElement={
          <div className="addCol">
          <button onClick={() => setOpen(true)}>+</button>
          <FieldPopupModal
            title="create column"
            label="Column Name"
            setSelectedFieldName={setSelectedFieldName}
            tableId={params?.tableName}
            selectedFieldName={selectedFieldName}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            setSelectValue={setSelectValue}
            showFieldsDropdown={showFieldsDropdown}
            setShowFieldsDropdown={setShowFieldsDropdown}
            open={open}
            metaData={metaData}
            setMetaData={setMetaData}
            setOpen={setOpen}
            submitData={createLeftorRightColumn}
            linkedValueName={linkedValueName}
            setLinkedValueName={setLinkedValueName}
            setTextValue={setTextValue}
          />
        </div>
        }
        trailingRowOptions={{
                  sticky: true,
                  tint: true,
                  hint: "New row...",
                }}
      />
    </div>
  );
}