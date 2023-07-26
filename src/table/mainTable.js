import React, { useState, useCallback, useEffect} from "react";
import {
  CompactSelection,
  DataEditor,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  addColumnrightandleft,
  deleteRows,
  updateCells,
  updateColumnHeaders,
} from "../store/table/tableThunk";
import PropTypes from "prop-types";

import "./Glidedatagrid.css";
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
import { getTableInfo } from "../store/table/tableSelector";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";
import { headerIcons } from "./headerIcons";
import variables from '../assets/styling.scss';
import isEqual  from "../store/isEqual";
export default function MainTable(props) {
  const params = useParams();
  const customEqual = (oldVal, newVal) => isEqual(oldVal, newVal);

  const cellProps = useExtraCells();
  const dispatch = useDispatch();
  const allFieldsofTable = useSelector((state) => state.table.columns,customEqual);
  const allRowsData = useSelector((state) => state.table.data || [],customEqual);
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectValue, setSelectValue] = useState("longtext");
  const [open, setOpen] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(null);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("");
  const [textValue, setTextValue] = useState("");
  const [data, setData] = useState(allRowsData);
  const [metaData, setMetaData] = useState({});
  const [menu, setMenu] = useState();
  const [directionAndId, setDirectionAndId] = useState({});
  const [imageLink, setImageLink] = useState("");
  const [queryByAi, setQueryByAi] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredRow,setHoveredRow]=useState(false);
  const [targetColumn,setTargetColumn]=useState(0);
  const emptyselection = {
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  };
  const [selection, setSelection] = useState(emptyselection);
  const [fieldsToShow, setFieldsToShow] = useState(allFieldsofTable || []);
  const tableInfo = useSelector((state) => getTableInfo(state),customEqual);
  const tableId = tableInfo?.tableId;
  useEffect(() => {
    setData(allRowsData);
  }, [allRowsData]);
  const isSingleCellSelected = useMemo(() => {
    return selection.current && (selection.current.range.height * selection.current.range.width === 1);
  }, [selection]);
  const handleUploadFileClick = useCallback((cell) => {
    if (!data) return;
    const [col, row] = cell;
    const dataRow = data?.[row] || data?.[row - 1];
    const d = dataRow?.[fieldsToShow?.[col]?.id];
    const index = cell?.[0];
    if (
      fieldsToShow?.[index]?.dataType === "attachment" 
    ) {
      setOpenAttachment({cell,d,fieldId:fieldsToShow?.[col]?.id,rowAutonumber: allRowsData[row][`fld${tableId.substring(3)}autonumber`]});

    }
  });
  document.addEventListener(
    "keydown",
    React.useCallback((event) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
        setShowSearch(!showSearch);
        event.stopPropagation();
        event.preventDefault();
      }
    }, [])
  );
  const onChangeUrl = (e, type) => {
    if(params?.templateId) return;

    const row = openAttachment?.cell[1];
    const col = openAttachment?.cell[0];

    if (imageLink !== null) {
      dispatch(
        updateCells({
          columnId: fieldsToShow[col]?.id,
          rowIndex: allRowsData[row][`fld${tableId.substring(3)}autonumber`],
          value: null,
          imageLink: imageLink,
          dataTypes: type,
          indexIdMapping: {
            [allRowsData[row][`fld${tableId.substring(3)}autonumber`]]: row,
          },
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
    }
    e.target.value = null;
  };
  const onChangeFile = (e, type) => {
    if(params?.templateId) return;

    const row = openAttachment?.cell[1];
    const col = openAttachment?.cell[0];

    if (e.target.files[0] != null) {
      dispatch(
        updateCells({
          columnId: fieldsToShow[col]?.id,
          rowIndex: allRowsData[row][`fld${tableId.substring(3)}autonumber`],
          value: e.target?.files[0],
          imageLink: imageLink,
          dataTypes: type,
          indexIdMapping: {
            [allRowsData[row][`fld${tableId.substring(3)}autonumber`]]: row,
          },
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
      
    }
  };
  const createLeftorRightColumn = () => {
    if(params?.templateId) return;
    if (
      directionAndId.direction == "left" ||
      directionAndId.direction == "right"
    ) {
      setOpen(false);
      dispatch(
        addColumnrightandleft({
          filterId: params?.filterName,
          fieldName: textValue,
          dbId: params?.dbId,
          tableId: params?.tableName,
          fieldType: selectValue,
          direction: directionAndId.direction,
          position: directionAndId.position,
          metaData: metaData,
          selectedTable,
          selectedFieldName: selectedFieldName,
          linkedValueName,
        })
      );
      setSelectValue("longtext");
      setDirectionAndId({});
    } else {
      var data1 = metaData;
      if (selectValue == "link") {
        data1.foreignKey = {
          fieldId: selectedFieldName,
          tableId: selectedTable,
        };
      }
      if (selectValue == "formula") {
        var queryToSend =
          JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.data_type +
          ` GENERATED ALWAYS AS (${JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.generated?.expression
          }) STORED;`;
      }
      setOpen(false);
      addColumn(
        dispatch,
        params,
        selectValue,
        metaData,
        textValue,
        selectedTable,
        selectedFieldName,
        linkedValueName,
        queryToSend,
        queryByAi.userQuery
      );
      setSelectValue("longtext");
    }
  };
  useEffect(() => {
    var newcolumn = [];
    allFieldsofTable.forEach((column) => {
      if (column?.metadata?.hide !== true) {
        newcolumn.push(column);
      }
    });
  
    const targetIndex = newcolumn.findIndex((field) => {
      const dataType = field.dataType;
      return (
        dataType !== "autonumber" &&
        dataType !== "createdat" &&
        dataType !== "createdby" &&
        dataType !== "rowid" &&
        dataType !== "updatedby" &&
        dataType !== "updatedat"
      );
    });
  
    if (targetIndex !== -1) {
      setTargetColumn(targetIndex);
    }
  
    setFieldsToShow(newcolumn);
  }, [allFieldsofTable]);
  
  const addRows = () => {
    if(params?.templateId) return;
    addRow(dispatch);
  };
  const reorder = useCallback(
    (item, newIndex) => {
      if(params?.templateId) return;
      reorderFuncton(
        dispatch,
        item,
        newIndex,
        fieldsToShow,
        allFieldsofTable,
        params?.filterName,
        setFieldsToShow
      );
    },
    [fieldsToShow, allFieldsofTable]
  );
  const handleRowMoved = useCallback(
    (from, to) => {
      if(params?.templateId) return;
      reorderRows(from, to, data, setData);
    },
    [data, setData]
  );
  const onCellEdited = useCallback(
    (cell, newValue) => {
      if(params?.templateId) return;
      if(fieldsToShow[cell[0]]?.dataType == "attachment") return;
      if (fieldsToShow[cell[0]]?.dataType == "multipleselect") {
        editmultipleselect(newValue, allRowsData[cell[1]][fieldsToShow[cell[0]]?.id] || [], cell);
        return;
      }
      if (newValue?.readonly == true || newValue?.data == allRowsData[cell[1]][fieldsToShow[cell[0]]?.id] ||
        (newValue?.data == "" && !allRowsData[cell[1]][fieldsToShow[cell[0]]?.id])) return;
      if (fieldsToShow[cell[0]].dataType == "singleselect") {
        newValue = newValue.data.value;
      }
     
      editCell(
        cell,
        newValue,
        dispatch,
        fieldsToShow,
        params,
        allRowsData[cell?.[1] ?? []],
        fieldsToShow[cell[0]].dataType,
        isSingleCellSelected
      );
    },
    [allRowsData,fieldsToShow]
  );
 const handleColumnResizeWithoutAPI=useCallback((_,newSize,colIndex)=>{
  let newarrr = [...(fieldsToShow || allFieldsofTable)];
  let obj = Object.assign({}, newarrr[colIndex]);
  obj.width = newSize;
  newarrr[colIndex] = obj;
  setFieldsToShow(newarrr);
 });
  const handleColumnResize = (field, newSize) => {
      if(params?.templateId) return;
    dispatch(
      updateColumnHeaders({
        filterId: params?.filterName,
        dbId: params?.dbId,
        tableName: params?.tableName,
        columnId: field?.id,
        metaData: { width: newSize },
      })
    );
  };
  const editmultipleselect = (newValue, oldValuetags, cell) => {
    if(params?.templateId) return;
    if (!fieldsToShow[cell[0]]?.id) return;
    const newValuetags = newValue.data.tags;
    const addedTags = newValuetags.filter((tag) => !oldValuetags.includes(tag));
    const removedTags = oldValuetags.filter((tag) => !newValuetags.includes(tag));
    const joinedString = addedTags.map((element) => `'${element}'`).join(",");
    let updateArray = [];
    const rowIndex = allRowsData[cell[1]][`fld${tableId.substring(3)}autonumber`];
    addedTags?.length > 0 &&
      updateArray.push({
        where: `fld${tableId.substring(3)}autonumber = ${rowIndex}`,
        fields: {
          [fieldsToShow[cell[0]]?.id]: joinedString.slice(1, -1),
        },
      });
    removedTags?.length > 0 &&
      updateArray.push({
        where: `fld${tableId.substring(3)}autonumber = ${rowIndex}`,
        fields: {
          [fieldsToShow[cell[0]]?.id]: { delete: removedTags },
        },
      });
    dispatch(
      updateCells({
        updatedArray: updateArray,
        indexIdMapping: { [rowIndex]: cell[1] },
      })
    );
  };
  const validateCell = useCallback(
    (cell, newValue) => {
      if(params?.templateId) return;
      if (newValue.kind === "number") {
        if (newValue?.data?.toString().length < 13 || !newValue?.data) {
          return newValue;
        } else return false;
      }
    },
    [allRowsData, fieldsToShow]
  );
  const handleDeleteRow = (selection) => {
    if(params?.templateId) return;
    if (selection.current) {
      return;
    }
    const deletedRowIndices = [];
    for (const element of selection.rows.items) {
      const [start, end] = element;
      for (let i = start; i < end; i++) {
        deletedRowIndices.push(
          allRowsData[i][`fld${tableId.substring(3)}autonumber`]
        );
      }
    }
    if (deletedRowIndices.length > 0) {
      dispatch(deleteRows({ deletedRowIndices, allRowsData }));
    }
    setSelection(emptyselection);
  };
  const onHeaderMenuClick = useCallback((col, bounds) => {
    if(params?.templateId) return;
    
    setMenu({ col, bounds });
  }, []);
  const getData = useCallback(
    (cell) => {
      const [col, row] = cell;
      const dataRow = allRowsData[row] || [];
      if (dataRow) {
        const d = dataRow[fieldsToShow[col]?.id];
        let { dataType } = fieldsToShow[col] || "";
       
        if (dataType === "autonumber") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            readonly: true,
            data: d || "",
            displayData: d?.toString() || "",
          };
        }
        else if (
          dataType === "createdat" ||
          dataType === "createdby" ||
          dataType === "rowid" ||
          dataType === "updatedby" ||
          dataType === "updatedat"
        ) {
          
          let updatedtime=d;
          if(d!==null && dataType === "updatedat")
          updatedtime=new Date(d*1000)
          
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: true,
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
            readonly: false,
            allowWrapping: true,
            displayData: d || "",
            data: d || "",
          };
        }
        else if (dataType === "url") {
          return {
            kind: GridCellKind.Uri,
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
            multiline: false,
          };
        } else if (dataType === "phone") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            data: d || "",
            displayData: d || "",
          };
        } else if (dataType === "numeric") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            data: d || "",
            displayData: d || "",
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
              readonly: false,
              tags: d || [],
            },
          };
        } else if (dataType == "attachment" && d != null) {
          return {
            kind: GridCellKind.Image,
            data: d,
            allowAdd: true,
          };
        } else if (dataType === "singleselect") {
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            data: {
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
                 kind: GridCellKind.Boolean,
                 data: show,
                 allowOverlay: false,
               };
             }
       
       else {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: d?.toString()|| "",
            data:  d?.toString() || "",
          };
        }
      } else {
        return {};
      }
    },
    [allRowsData, fieldsToShow]
  );
  const realCols = useMemo(() => {
   return   [...fieldsToShow];
  }, [fieldsToShow]);
 
  const handlegridselection = (event) => {

    setSelection(event);
  };

 
const handleRightClickOnHeader=useCallback((col,event)=>{
  if(params?.templateId) return;
  event.preventDefault();
  setMenu({col,bounds:event.bounds});
})
  
  const getRowThemeOverride=(row)=>{
   if(row!=hoveredRow || open==true || menu!=null) return;
    return { bgCell: variables.rowHoverColor,bgCellMedium: variables.codeblockbgcolor};
  }
  
  const getHoveredItemsInfo=(event)=>{
    setHoveredRow(event?.location[1]);
  }
  
  return (
    <>
      {JSON.stringify(selection) !== JSON.stringify(emptyselection) &&
        selection.rows.items.length > 0 && (
          <button
            className="fontsize deleterowbutton"
           
            onClick={() => handleDeleteRow(selection)}
          >
            <div className="deleterows">Delete Rows</div>
            <div>
              <DeleteOutlineIcon className="deletecolor"/>
            </div>
          </button>
        )}
      <div
        className="table-container"
        style={{ height:props?.height ||  `64vh` }}
      >
        <DataEditor
          {...cellProps}
          width={props?.width || window.screen.width}
          fillHandle={true}
          getCellContent={getData}
          onRowAppended={addRows}
          columns={realCols}
          rows={allRowsData.length}
          gridSelection={selection}
          rowMarkers="both"
          rowSelectionMode="multi"
          onItemHovered={getHoveredItemsInfo}
          onGridSelectionChange={handlegridselection}
          onCellEdited={onCellEdited}
          onRowMoved={handleRowMoved}
          validateCell={validateCell}
          onHeaderContextMenu={handleRightClickOnHeader}
          getCellsForSelection={true}
          showSearch={showSearch}
          getRowThemeOverride={getRowThemeOverride}
          onSearchClose={() => setShowSearch(false)}
          onCellClicked={handleUploadFileClick}
          onColumnResize={handleColumnResizeWithoutAPI}
          onColumnResizeEnd={handleColumnResize}
          onHeaderMenuClick={onHeaderMenuClick} 
          headerIcons={headerIcons}
          showMinimap={props?.minimap}
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
            targetColumn: targetColumn,
            // targetColumn: 4
          }}
        />
      </div>
      {open && (
        <FieldPopupModal
          title="create column"
          label="Column Name"
          setSelectedFieldName={setSelectedFieldName}
          tableId={params?.tableName}
          selectedFieldName={selectedFieldName}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          setSelectValue={setSelectValue}
          selectValue={selectValue}
          showFieldsDropdown={showFieldsDropdown}
          setShowFieldsDropdown={setShowFieldsDropdown}
          open={open}
          metaData={metaData}
          setMetaData={setMetaData}
          setOpen={setOpen}
          queryByAi={queryByAi}
          setQueryByAi={setQueryByAi}
          submitData={createLeftorRightColumn}
          linkedValueName={linkedValueName}
          setLinkedValueName={setLinkedValueName}
          textValue={textValue}
          setTextValue={setTextValue}
        />
      )}
     {menu &&  <Headermenu
        menu={menu}
        setMenu={setMenu}
        setOpen={setOpen}
        setDirectionAndId={setDirectionAndId}
        fields={fieldsToShow}
      />}
      {openAttachment && (
        <SelectFilepopup
          title="uplaodfile"
          label="UploadFileIcon"
          attachment={openAttachment}
          open={openAttachment ? true : false}
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
MainTable.propTypes = {
  minimap: PropTypes.any,
  height:PropTypes.any,
  width:PropTypes.any,
}