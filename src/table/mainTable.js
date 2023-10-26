import React, { useState, useCallback, useEffect, useRef } from "react";
import { CompactSelection, DataEditor } from "@glideapps/glide-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { deleteRows, updateColumnHeaders } from "../store/table/tableThunk";
import PropTypes from "prop-types";
import "./Glidedatagrid.css";
import "../../src/App.scss";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addRow,editCell,getDataExternalFunction,reorderFuncton,} from "./addRow";
import { useMemo } from "react";
import Headermenu from "./headerMenu";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
// import { getTableInfo } from "../store/table/tableSelector";
import SelectFilepopup from "./selectFilepopup";
import { headerIcons } from "./headerIcons";
import variables from "../assets/styling.scss";
import { customUseSelector } from "../store/customUseSelector";
export default function MainTable(props) {
  const params = useParams();
  const cellProps = useExtraCells();
  const dispatch = useDispatch();
  const allFieldsofTable = customUseSelector((state) => state.table.columns);//fields from redux
  const allRowsData = customUseSelector((state) => state.table.data || []); // data from redux
  const [open, setOpen] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(null);
  const [metaData, setMetaData] = useState({}); // why we need this metaData here 
  const [menu, setMenu] = useState();
  const [directionAndId, setDirectionAndId] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(false);
  const targetColumn = useRef(0); // 
  const readOnlyDataTypes = [ "autonumber", "createdat", "createdby", "rowid", "updatedby", "updatedat"];

  const emptyselection = {
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  };
  const [selection, setSelection] = useState(emptyselection);
  const [fieldsToShow, setFieldsToShow] = useState(allFieldsofTable || []);
  // const tableInfo = customUseSelector((state) => getTableInfo(state));
  // const tableId = tableInfo?.tableId;

  const isSingleCellSelected = useMemo(() => {
    return (selection.current && selection.current.range.height * selection.current.range.width === 1 );
  }, [selection]);

  const handleUploadFileClick = useCallback((cell) => {
    if (!allRowsData) return;
    const [col, row] = cell;
    const dataRow = allRowsData?.[row] || allRowsData?.[row - 1];
    const d = dataRow?.[fieldsToShow?.[col]?.id];
    const index = cell?.[0];
    if (fieldsToShow?.[index]?.dataType === "attachment") {
      setOpenAttachment({
        cell,
        d,
        fieldId: fieldsToShow?.[col]?.id,
        // rowAutonumber: allRowsData[row][`fld${tableId?.substring(3)}autonumber`],
        rowAutonumber: allRowsData[row][`autonumber`],
      });
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
  useEffect(() => {
    var newcolumn = [];
    allFieldsofTable.forEach((column) => {
      if (column?.metadata?.hide !== true) {
        newcolumn.push(column);
      }
    });

    const targetIndex = newcolumn.findIndex((field) => {
      const dataType = field.dataType;

      return !readOnlyDataTypes.includes(dataType);
    });

    if (targetIndex !== -1) {
      targetColumn.current = targetIndex;
    }

    setFieldsToShow(newcolumn);
  }, [allFieldsofTable]);

  const addRows = () => {
    if (params?.templateId) return;
    addRow(dispatch, [{}]);
  };
  const reorder = useCallback(
    (item, newIndex) => {
      if (params?.templateId) return;
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
  const onCellEdited =(cell, newValue) => {
      editCell(
        cell,
        newValue,
        dispatch,
        fieldsToShow,
        params,
        allRowsData,
        fieldsToShow[cell[0]].dataType,
        isSingleCellSelected
      );
    }
   
  const handleColumnResizeWithoutAPI = useCallback((_, newSize, colIndex) => {
    let newarrr = [...(fieldsToShow || allFieldsofTable)];
    let obj = Object.assign({}, newarrr[colIndex]);
    obj.width = newSize;
    newarrr[colIndex] = obj;
    setFieldsToShow(newarrr);
  });
  const handleColumnResize = (field, newSize) => {
    if (params?.templateId) return;
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
  

  const handleDeleteRow = (selection) => {
    if (params?.templateId || selection?.current) return;
    const deletedRowIndices = [];
    for (const element of selection.rows.items) {
      const [start, end] = element;
      for (let i = start; i < end; i++) {
        // deletedRowIndices.push(allRowsData[i][`fld${tableId.substring(3)}autonumber`] );
        deletedRowIndices.push(allRowsData[i][`autonumber`] );
      }
    }
    if (deletedRowIndices.length > 0)  dispatch(deleteRows({ deletedRowIndices, dataa: allRowsData }));
    setSelection(emptyselection);
  };

  const onHeaderMenuClick = useCallback((col, bounds) => {
    if (params?.templateId) return;
    setMenu({ col, bounds });
  }, []);
  const getData = useCallback(
    (cell) =>
      getDataExternalFunction(cell,allRowsData,fieldsToShow,readOnlyDataTypes),
    [allRowsData, fieldsToShow]
  );

  const handlegridselection = (event) => {setSelection(event);};

  const handleRightClickOnHeader = useCallback((col, event) => {
    if (params?.templateId) return;
    event.preventDefault();
    setMenu({ col, bounds: event.bounds });
  });
  const getRowThemeOverride = (row) => {
    if (row != hoveredRow || open || menu || openAttachment) return;
    return {
      bgCell: variables.rowHoverColor,
      bgCellMedium: variables.codeblockbgcolor,
    };
  };
  const getHoveredItemsInfo = (event) => {setHoveredRow(event?.location[1]); };
  return (
    <>
      {selection?.rows?.items?.length > 0 && (
        <button className="fontsize deleterowbutton" onClick={() => handleDeleteRow(selection)}>
          <div className="deleterows">Delete Rows</div>
          <div><DeleteOutlineIcon className="deletecolor" /></div>
        </button>
      )}
      <div className="table-container" style={{ height: props?.height || `64vh` }}>
        <DataEditor
          {...cellProps}
          width={props?.width || window.screen.width}
          fillHandle={true}
          getCellContent={getData}
          onRowAppended={addRows}
          columns={fieldsToShow}
          rows={allRowsData.length}
          gridSelection={selection}
          rowMarkers="both"
          rowSelectionMode="multi"
          onItemHovered={getHoveredItemsInfo}
          onGridSelectionChange={handlegridselection}
          onCellEdited={onCellEdited}
          // validateCell={validateCell}
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
          rightElement={<div className="addCol"><button onClick={() => setOpen(true)}>+</button></div>}
          trailingRowOptions={{ sticky: true,tint: true,hint: "New row...",targetColumn: targetColumn.current,}}
        />
      </div>
      {open && (
        <FieldPopupModal
          title="create column"
          label="Column Name"
          tableId={params?.tableName}
          open={open}
          metaData={metaData}
          setMetaData={setMetaData}
          setOpen={setOpen}
          setDirectionAndId={setDirectionAndId}
          directionAndId={directionAndId}
        />
      )}
      {menu && (
        <Headermenu
          menu={menu}
          setMenu={setMenu}
          setOpen={setOpen}
          setDirectionAndId={setDirectionAndId}
          fields={fieldsToShow}
        />
      )}
      {openAttachment && (
        <SelectFilepopup
          title="uplaodfile"
          label="UploadFileIcon"
          attachment={openAttachment}
          open={openAttachment ? true : false}
          setOpen={setOpenAttachment}
        />
      )}
    </>
  );
}
MainTable.propTypes = {
  minimap: PropTypes.any,
  height: PropTypes.any,
  width: PropTypes.any,
};
