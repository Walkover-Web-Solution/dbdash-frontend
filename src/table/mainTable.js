import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import {  bulkAddColumns, deleteRows, updateColumnHeaders} from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell, reorderFuncton } from "./addRow";
import { DeleteOutlined } from "@mui/icons-material";
// import { Button } from "react-scroll";
// import { DeleteOutlined } from "@mui/icons-material";
// import  debounce  from 'lodash.debounce';

export default function MainTable() {
  const params = useParams();
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.table.columns);
  console.log("fields above call",fields)
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
console.log("selectedFieldName",selectedFieldName,"selectedTable",selectedTable)
  useEffect(() => {
    dispatch(
      bulkAddColumns({
        dbId: params?.dbId,
        tableName: params?.tableName,
      })
    );
  }, []);

  const createColumn = () => {
    var dataa = metaData;
    if (selectValue == "link") {
      dataa.foreignKey = {
        fieldId: selectedFieldName,
        tableId: selectedTable
      }
    }
    setOpen(false);
    console.log("linkedValueName",linkedValueName)
    addColumn(dispatch,params,selectValue,metaData,textValue,selectedTable,selectedFieldName,linkedValueName);
    setSelectValue('longtext')
  }

  const addRows = () => {
      addRow(dispatch);
  }; 

  const reorder = useCallback(
    (item, newIndex) => {
      reorderFuncton(dispatch,item,newIndex,fields)
    },
    [fields]
  );

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
    
    if (dataType === "autonumber" || dataType === "rowid") {
      return {
        allowOverlay: true,
        kind: GridCellKind.Number,
        data: d,
        displayData: d.toString(),
      };
    }
    else if (dataType === "createdat" || dataType === "createdby" || dataType === "longtext") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d || "",
        data: d || "",
      };
    }
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

  const deletedFunc = useCallback((celled) => {
    console.log("cell",celled)
  });

  const handledata = (selectedCells)=>{
     console.log("selectedCells",selectedCells)
  }

  return (
    <div className="table-container">
       {/* {getCellsForSelection?.length > 0 && ( */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
            // sx={{ position: "absolute", right: "1%", top: "16.5%" }}
              onClick={() => {
                dispatch(deleteRows(""));
              }}
              // variant="contained"
            >
              <DeleteOutlined style={{ fontSize: "19px" }} />
            </button>
          </div>
        {/* )} */}
      <DataEditor
        getCellContent={getData}
        onRowAppended={addRows}
        columns={fields}
        rows={dataa.length}
        rowMarkers="both"
        onCellEdited={onCellEdited}
        onRowMoved={handleRowMoved}
        getCellsForSelection={true}
        onCellSelection={handledata}
        onColumnResizeEnd={handleColumnResize}
        onColumnMoved={reorder}
        scaleToRem={true}
        onDelete={deletedFunc}
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
            submitData={createColumn}
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