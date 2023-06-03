import React, { useState, useCallback, useEffect } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import {  bulkAddColumns, updateColumnHeaders} from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell, reorderFuncton } from "./addRow";


// const SimpleMenu = styled.div(`
// width: 175px;
// padding: 8px 0;
// border-radius: 6px;
// box-shadow: 0px 0px 1px rgba(62, 65, 86, 0.7), 0px 6px 12px rgba(62, 65, 86, 0.35);

// display: flex;
// flex-direction: column;

// background-color: white;
// font-size: 13px;
// font-weight: 600;
// font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

// .danger {
//   color: rgba(255, 40, 40, 0.8);
//   &:hover {
//     color: rgba(255, 40, 40, 1);
//   }
// }

// > div {
//   padding: 6px 8px;
//   color: rgba(0, 0, 0, 0.7);
//   &:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//     color: rgba(0, 0, 0, 0.9);
//   }
//   transition: background-color 100ms;
//   cursor: pointer;
// }
// `);

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
  // const [selectedRows, setSelectedRows] = useState([]);
  console.log("fields",fields)
  useEffect(() => {
    dispatch(
      bulkAddColumns({
        dbId: params?.dbId,
        tableName: params?.tableName,
      })
    );
  }, []);

  const createColumn = () => {
    var data1 = metaData;
    if (selectValue == "link") {
      data1.foreignKey = {
        fieldId: selectedFieldName,
        tableId: selectedTable
      }
    }
    setOpen(false);
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

      // const [menu, setMenu] = useState({
      //   col: null,
      //   bounds: null,
      // });
      
      // const onHeaderMenuClick = useCallback((col, bounds) => {
        
      //   setMenu({ col, bounds });

        
      // }, []);
      

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

  // const deletedFunc = useCallback((celled) => {
  //   console.log("cell",celled)
  // });
  // const handleSelectionChanged = (selectedCells) => {
  //   const selectedRowIds = selectedCells.map((cell) => cell.row);
  //   console.log("selectedRowIds",selectedRowIds)
  //   setSelectedRows(selectedRowIds);      
  // };
  // console.log("Selected Rows IDs:", selectedRows);

  return (
    <>
    <div className="table-container">
      <DataEditor
        width={1300}
        getCellContent={getData}
        onRowAppended={addRows}
        columns={fields}
        rows={dataa.length}
        rowMarkers="both"
        onCellEdited={onCellEdited}
        onRowMoved={handleRowMoved}
        getCellsForSelection={true}
        onColumnResizeEnd={handleColumnResize}
        onColumnMoved={reorder}
        scaleToRem={true}
        // onSelectionChanged={handleSelectionChanged}
        // onDelete={deletedFunc}
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
                  targetColumn: 4
                }}
      />
    </div>
   {/* <Headermenu menu={menu} setMenu={setMenu}/> */}
   {/* {isOpen &&
    renderLayer(
      <SimpleMenu {...layerProps}>
        <div onClick={() => setMenu(undefined)}>These do nothing</div>
        <div onClick={() => setMenu(undefined)}>Add column right</div>
        <div onClick={() => setMenu(undefined)}>Add column left</div>
        <div className="danger" onClick={() => setMenu(undefined)}>
          Delete
        </div>
      </SimpleMenu>
   )}
    */}
    </>
    
  );
}