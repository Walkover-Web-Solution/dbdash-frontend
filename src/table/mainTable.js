/*eslint-disable */
import React, { useState, useCallback, useEffect } from "react";
import { // CompactSelection
  DataEditor, GridCellKind
} from "@glideapps/glide-data-grid";
import { addColumnrightandleft, deleteRows,updateCells, updateColumnHeaders } from "../store/table/tableThunk";
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
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
// import "@glideapps/glide-data-grid/dist/index.css";
import { cloneDeep } from 'lodash';
import { getTableInfo } from "../store/table/tableSelector";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";

export default function MainTable() {
  
  const params = useParams();
  const cellProps = useExtraCells();
  const dispatch = useDispatch();
  const fields1 = useSelector((state) => state.table.columns);
  const dataa = useSelector((state) => state.table.data) || [];
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectValue, setSelectValue] = useState('longtext');
  const [open, setOpen] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(null);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("")
  const [textValue, setTextValue] = useState('');
  const [data, setData] = useState(dataa);
  const [metaData, setMetaData] = useState({});
  const [menu, setMenu] = useState();
  const [directionAndId, setDirectionAndId] = useState({})
  const [imageLink, setImageLink] = useState("");
  const [fields, setFields] = useState(fields1 || [])
  const tableInfo = useSelector((state) => getTableInfo(state)); 
  const tableId = tableInfo?.tableId
  useEffect(()=>{
    setData(dataa)
  },[dataa])
  let todeleterows=false;
  document.addEventListener('keydown', function(event) {
    todeleterows=false;
  });
  console.log("tableInfo",tableId)
  const handleUploadFileClick = useCallback((cell) => {
    if(!data)return ;
    const [col, row] = cell;
    const dataRow = data?.[row] || data?.[row-1];
    const d = dataRow?.[fields?.[col]?.id];
    const index = cell?.[0]
    if(fields?.[index]?.dataType === "attachment" && (d==undefined || d?.length===0)){
      setOpenAttachment(cell);
    }
  });

  const onChangeUrl = (e, type) => {

    const row=openAttachment[1];
    const col=openAttachment[0];
    if (imageLink !== null) {
      dispatch(
        updateCells({
          columnId: fields[col]?.id,
          rowIndex:dataa[row][`fld${tableId.substring(3)}autonumber`],
          value: null,
          imageLink: imageLink,
          dataTypes: type,
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
    }
    e.target.value = null;
  };


  const onChangeFile = (e, type) => {
    const row=openAttachment[1];
    const col=openAttachment[0];
    if (e.target.files[0] != null) {
      dispatch(
        updateCells({
          columnId: fields[col]?.id,
          rowIndex:dataa[row][`fld${tableId.substring(3)}autonumber`],
          value: e.target?.files[0],
          imageLink: imageLink,
          dataTypes: type,
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
    }
    e.target.value = null;
  };


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
      if (column?.metadata?.hide != true) {
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
  if(todeleterows==false )
  {
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === fields[cell[0]]?.id);
    arrr = cloneDeep(metaDataArray[0]?.metadata?.option || []);
  if(fields[cell[0]].dataType == "singleselect"){
    if(typeof(newValue) == "object")
    {
      newValue = newValue.value || newValue.data.value || newValue.data;
      if(!arrr.includes(newValue)){
        arrr.push(newValue);
      } 
        editCell(cell, newValue, dispatch, fields,arrr,params,dataa[cell?.[1] ?? []],fields[cell[0]].dataType);
    }
  }
  else {
    editCell(cell, newValue, dispatch, fields,false,params,dataa[cell?.[1] ?? []],fields[cell[0]].dataType);
  }
} 
}, [dataa,data, fields]);

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
  const validateCell=useCallback((cell,newValue,oldValue)=>
{

  if(newValue.data.kind=='tags-cell')
     { 
          let tag="";
          let arr1=newValue.data.tags;
          let arr2=oldValue.data.tags || [];
          let arr=arr1.filter(x=>!arr2.includes(x));
          
          tag=arr[0]|| "";
          if(fields[cell[0]]?.id && tag!="" ){
            dispatch(
              updateCells({
                columnId:  fields1[cell[0]]?.id ,
                rowIndex :dataa[cell[1]][`fld${tableId.substring(3)}autonumber`],
                value:  tag ,
                dataTypes: newValue?.kind,
              })
             );       
     
      }}
    
    if(newValue.kind==='number' )
    {
      if( newValue.data.toString().length<13)
      return newValue;
      else return false;

    }
},[dataa,fields]);
  const handleDeleteRow = useCallback((selection) => {
    
    if(selection.current)
    {return;
    } 
    const deletedRowIndices = [];
    // const newData = [...dataa];
  
    for (const element of selection.rows.items) {
      const [start, end] = element;
      for (let i = start; i < end; i++) {
        console.log("dataa[i][`fld${tableId}autonumber`]",dataa[i][`fld${tableId.substring(3)}autonumber`])
        console.log("dataa[i]",dataa[i])
        deletedRowIndices.push(dataa[i][`fld${tableId.substring(3)}autonumber`]);
      }
    }
  
    if (deletedRowIndices.length > 0) {
    todeleterows = true;

      dispatch(deleteRows({deletedRowIndices,dataa}))
    }
    // const escapeKeyEvent = new KeyboardEvent("keydown", { key: "Escape" });
    // dataEditorRef.current.dispatchEvent(escapeKeyEvent);
  });
  




  const onHeaderMenuClick = useCallback((col, bounds) => {
    setMenu({ col, bounds });
  }, []);

  const getData = useCallback((cell) => {
    const [col, row] = cell;
    const dataRow = dataa[row] || [];
    if (dataRow) {

      const d = dataRow[fields[col]?.id];
      const { dataType } = fields[col] || "";

      
      if (dataType === "autonumber") {
        return {
          allowOverlay: true,
          kind: GridCellKind.Number,
          readonly: true,
          data: d || "",
          displayData: d.toString() || "",
        };
      }
      else if (dataType === "createdat" || dataType === "createdby" || dataType === "rowid" || dataType === "updatedby" || dataType === "updatedat"   ) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: true,
          displayData: d || "",
          data: d || "",
        };
      }
      else if (dataType === "datetime") {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "date-picker-cell",
            date: currentDate,
            displayDate: formattedDate,
            format: "date"
          }
        };
    }
    else if (dataType === "longtext") {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d || "",
        data: d || "",
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
        return {
          allowOverlay: true,
          kind: GridCellKind.Number,
          data: d || "",
          displayData:d || ""
        };
      }
      else if (dataType === "multipleselect") {
         const possibleTags = fields[col]?.metadata?.option;
        // const row = 0; // Replace 0 with the appropriate row index
        let newarr=[];
        possibleTags && possibleTags?.map(x=>{
          let newx={
            tag:x.value,
            color:x.color
          }
          newarr.push(newx);
        })
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
            kind: "tags-cell",
            possibleTags:  newarr || [],
            readonly: false,
            tags:d || [],
          },
        };
      }
      
      else if (dataType == "attachment" && d != null) {
        return {
          kind: GridCellKind.Image,
          data: d ,
          allowOverlay: true,
          allowAdd: true,
        };      
      }
      else if (dataType === "singleselect") {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: d,
          data: {
            kind: "dropdown-cell",
            allowedValues: fields[col]?.metadata?.option || [],
            value: d || ""
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
    return fields?.map((c) => ({
      ...c,
      hasMenu: true,
    }));
  }, [fields]);

  return (
    <>
      <div className="table-container" style={{height:`${((window?.screen?.height*65)/100)}px`}}>
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
          onDelete={handleDeleteRow}
          validateCell={validateCell}
          getCellsForSelection={true}
          onCellClicked={handleUploadFileClick}
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
            // targetColumn: 4
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

      {openAttachment && (
              <SelectFilepopup
                title="uplaodfile"
                label="UploadFileIcon"
                open={openAttachment?true:false}
                setImageLink={setImageLink}
                onChangeUrl={onChangeUrl}
                setOpen={setOpenAttachment}
                imageLink={imageLink}
                onChangeFile={onChangeFile}
              />
            )}
    </>
  );
}