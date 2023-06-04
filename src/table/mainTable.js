import React, { useState, useCallback } from "react";
import { 
  // CompactSelection
  DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import {  updateColumnHeaders} from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import {addColumn,  addRow, editCell,reorderFuncton } from "./addRow";
import { useMemo } from "react";
import Headermenu from "./headerMenu";


export default function MainTable() {
  const params = useParams();
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.table.columns);
  const dataa = useSelector((state) => state.table.data);
  console.log(dataa,"datttttt");
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectValue, setSelectValue] = useState('longtext');
  const [open, setOpen] = useState(false);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("")
  const [textValue, setTextValue] = useState('');
  const [data, setData] = useState(dataa);
  const [metaData, setMetaData] = useState({});
  const [menu, setMenu] = useState();
  console.log("fields",fields,"data",data);
  const createColumn = () => {
    var data1 = metaData;
    if (selectValue == "link") {
      data1.foreignKey = {
        fieldId: selectedFieldName,
        tableId: selectedTable
      }
    }
    setOpen(false);
    // dispatch(addColumnrightandleft({
    //   fieldName: textValue,
    //   dbId: params?.dbId,
    //   tableId: params?.tableName,
    //   fieldType: selectValue,
    //   metaData: metaData
    // }));
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

  const onCellEdited = useCallback((cell, newValue) => {
    editCell(cell, newValue,dispatch,fields);
    },[data, fields]);

     const handleColumnResize = (fields, newSize, colIndex, newSizeWithGrow) => {
      console.log(fields, newSize, colIndex, newSizeWithGrow,786)
        dispatch(updateColumnHeaders({
            dbId:params?.dbId,
            tableName:params?.tableName,
            fieldName:fields?.id,
            metaData:{width:newSize}
        }));
      };

    const onHeaderMenuClick = useCallback((col, bounds) => {
      setMenu({ col, bounds });
      }, []);
      

  const getData = useCallback((cell) => {
    const [col, row] = cell;
    const dataRow = dataa[row];
    if(dataRow){
    
    const d = dataRow[fields[col]?.id];
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
  }
  else{
    return {};
  }
  }, [dataa, fields]);

  const realCols = useMemo(() => {
    return fields.map((c) => ({
      ...c,
      hasMenu: true,
    }));
  }, [fields]);

  return (
    <>
    <div className="table-container">
      <DataEditor
        width={1300}
        getCellContent={getData}
        onRowAppended={addRows}
        columns={realCols}
        rows={dataa.length}
        rowMarkers="both"
        rowSelectionMode="multi"
        onCellEdited={onCellEdited}
        onRowMoved={handleRowMoved}
        getCellsForSelection={true}
        onColumnResizeEnd={handleColumnResize}
        onHeaderMenuClick={onHeaderMenuClick } //iske niche ki 2 line mat hatana
        // gridSelection={{row:item.length === 0?CompactSelection.empty() : CompactSelection.fromSingleSelection(item)}}
        // onGridSelectionChange={(ele)=>{console.log("ele",ele);setItem(ele.rows.items)}}
        onColumnMoved={reorder}

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
            // submitData={createLeftorRightColumn}
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
                  targetColumn: 4
                }}
      />
    </div>
   <Headermenu menu={menu} setMenu={setMenu}  setOpen={setOpen}   />
    </>
    
  );
}