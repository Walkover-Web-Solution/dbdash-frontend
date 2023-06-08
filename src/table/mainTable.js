import React, { useState, useCallback, useEffect } from "react";
import { addColumnrightandleft, updateColumnHeaders } from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell, reorderFuncton } from "./addRow";
import { useMemo } from "react";
import Headermenu from "./headerMenu";
import DataEditor, {GridCellKind} from "@glideapps/glide-data-grid";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import "@glideapps/glide-data-grid/dist/index.css";
import { cloneDeep } from 'lodash';
import { getTableInfo } from "../store/table/tableSelector";

// import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function MainTable() {

  const params = useParams();
  const cellProps = useExtraCells();
  const dispatch = useDispatch();
  const fields1 = useSelector((state) => state.table.columns);
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
  const [menu, setMenu] = useState();
  const [directionAndId, setDirectionAndId] = useState({})
  const [fields, setFields] = useState(fields1 || [])
  const tableInfo = useSelector((state) => getTableInfo(state));
 
  // const possibleTags = [
  //       {
  //           tag: "Bug",
  //           color: "#ff4d4d35",
  //       },
  //       {
  //           tag: "Feature",
  //           color: "#35f8ff35",
  //       },
  //       {
  //           tag: "Enhancement",
  //           color: "#48ff5735",
  //       },
  //       {
  //           tag: "First Issue",
  //           color: "#436fff35",
  //       },
  //       {
  //           tag: "PR",
  //           color: "#e0ff3235",
  //       },
  //       {
  //           tag: "Assigned",
  //           color: "#ff1eec35",
  //       },
  //   ];
  const createLeftorRightColumn = () => {
    if (directionAndId.direction == "left" || directionAndId.direction == "right") {
      setOpen(false);
      dispatch(addColumnrightandleft({
        filterId:params?.filterName,fieldName: textValue, dbId: params?.dbId, tableId: params?.tableName, fieldType:
          selectValue, direction: directionAndId.direction, position: directionAndId.position, metaData: metaData, selectedTable, selectedFieldName, linkedValueName
      }));
      setSelectValue('longtext')
      setDirectionAndId({})
    }
    else {
      var data1 = metaData;
      if (selectValue == "link") {
        data1.foreignKey = {
          fieldId: selectedFieldName,
          tableId: selectedTable
        }
      }
      setOpen(false);
      addColumn(dispatch, params, selectValue, metaData, textValue, selectedTable, selectedFieldName, linkedValueName);
      setSelectValue('longtext')
    }
  };

  useEffect(() => {
    var newcolumn = []
    fields1.forEach(column => {
      if (column?.metadata?.hide != "true") {
        newcolumn.push(column)
      }
    });
    setFields(newcolumn);
  }, [fields1]);

  const addRows = () => {
    addRow(dispatch);
  };

  const reorder = useCallback(
    (item, newIndex) => {
      reorderFuncton(dispatch, item, newIndex, fields,params?.filterName,setFields)
    },
    [fields]
  );

  const handleRowMoved = useCallback((from, to) => {
    reorderRows(from, to, data, setData);
  }, [data, setData]);


let arrr=[];
const onCellEdited = useCallback((cell, newValue) => {
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === fields[cell[0]]?.id);
    arrr = cloneDeep(metaDataArray[0]?.metadata?.option || []);
  if(fields[cell[0]].dataType == "singleselect"){
    if(typeof(newValue) == "object")
    {
      console.log("type object",newValue)
      newValue = newValue.value || newValue.data.value || newValue.data;

    }
    editCell(cell, newValue, dispatch, fields,arrr,params,);
  }
  else {
    editCell(cell, newValue, dispatch, fields,false,params);
  }
}, [data, fields]);

  const handleColumnResize = (field, newSize, colIndex) => {
    let newarrr = [...fields || fields1];
    let obj = Object.assign({}, newarrr[colIndex]);
    obj.width = newSize;
    newarrr[colIndex] = obj;
    setFields(newarrr);
    dispatch(updateColumnHeaders({
      filterId:params?.filterName,
      dbId: params?.dbId,
      tableName: params?.tableName,
      columnId: field?.id,
      metaData: { width: newSize }
    }));
  };

  const onHeaderMenuClick = useCallback((col, bounds) => {
    setMenu({ col, bounds });
  }, []);

  const getData = useCallback((cell) => {
    const [col, row] = cell;
    const dataRow = dataa[row];
    if (dataRow) {

      const d = dataRow[fields[col]?.id];
      const { dataType } = fields[col] || "";
      if (dataType === "autonumber") {
        return {
          allowOverlay: true,
          kind: GridCellKind.Number,
          readonly: true,
          data: d,
          displayData: d.toString(),
        };
      }
      else if (dataType === "createdat" || dataType === "createdby" || dataType === "rowid") {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: true,
          displayData: d || "",
          data: d || "",
        };
      }
      else if (dataType === "datetime") {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "date-picker-cell",
            date: new Date(),
            displayDate: new Date().toISOString(),
            format: "date"
          }
      }
    }
    else if (dataType === "longtext") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d || "",
        data: d || "",
        provideEditor: true
      };
    }
      else if (dataType === "singlelinetext") {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: d || "",
          data: d || "",
          wrapText: false,
          multiline: false
        };
      }
      else if (dataType === "phone") {
        const data = d || "";
        const displayData = d !== null && d !== undefined ? d.toString() : "";
        return {
          allowOverlay: true,
          kind: GridCellKind.Number,
          data: data,
          displayData: displayData,
        };
      }
      // else if (dataType === "multipleselect" && d != null) {
      //   // const possibleTags = []; // Define your array of possible tags here
      //   // const row = 0; // Replace 0 with the appropriate row index
      //   const rand = () => Math.random();
      //   const uniq = (arr) => Array.from(new Set(arr));
        
      //   return {
      //     kind: GridCellKind.Custom,
      //     allowOverlay: true,
      //     copyData: "4",
      //     data: {
      //       kind: "tags-cell",
      //       possibleTags: possibleTags,
      //       readonly: false,
      //       tags: uniq([
      //         possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag,
      //         possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag,
      //         possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag,
      //         possibleTags[Math.round(rand() * 1000) % possibleTags.length].tag,
      //       ]),
      //     },
      //   };
      // }
      
      else if (dataType === "attachment" && d != null) {
        return {
          kind: GridCellKind.Image,
          data: d,
          allowOverlay: true,
          allowAdd: true
        };
      }
      else if (dataType === "singleselect"  && d != null) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: 4,
          data: {
            kind: "dropdown-cell",
            allowedValues: fields[col].metadata.option || [],
            value: d
          }
          };
        }
        else if (dataType === "checkbox" ) {
          return {
            kind: GridCellKind.Boolean,
            data: d,
            allowOverlay: false,
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
    else {
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
      <div className="table-container" style={{height:`${((window.screen.height*65)/100)}px`}}>
        <DataEditor
           {...cellProps}
          width={window.screen.width}
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
          onHeaderMenuClick={onHeaderMenuClick} //iske niche ki 2 line mat hatana
          // gridSelection={{row:item.length === 0?CompactSelection.empty() : CompactSelection.fromSingleSelection(item)}}
          // onGridSelectionChange={(ele)=>{console.log("ele",ele);}}
          
          onColumnMoved={reorder}
          onPaste={true}
          rightElement={
            <div className="addCol">
              <button onClick={() => setOpen(true)}>+</button>
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
      {open && <FieldPopupModal
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
      />}
      <Headermenu menu={menu} setMenu={setMenu} setOpen={setOpen} setDirectionAndId={setDirectionAndId} fields={fields} />
    </>

  );
}