import React, { useState, useCallback, useEffect, useRef } from "react";
import { CompactSelection, DataEditor } from "@glideapps/glide-data-grid";
import PropTypes from "prop-types";
import './../../../table/Glidedatagrid.css';
import "./../../../App.scss";
import "../../../table/style.css";
import { getDataExternalFunction} from "../../../table/addRow";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import { headerIcons } from "../../../table/headerIcons";
import { customUseSelector } from "../../../store/customUseSelector";

export default function TemplateTable(props) {
  const cellProps = useExtraCells();
  const allFieldsofTable = customUseSelector((state) => state.table.columns);//fields from redux
  const allRowsData = customUseSelector((state) => state.table.data || []); // data from redux
  const users = customUseSelector((state) => state.tables.userDetail || {});
  const [showSearch, setShowSearch] = useState(false);
  const targetColumn = useRef(0); // 
  const readOnlyDataTypes = [ "autonumber", "createdat", "createdby", "rowid", "updatedby", "updatedat"];
  
  const emptyselection = {
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  };
  const [selection] = useState(emptyselection);
  const [fieldsToShow, setFieldsToShow] = useState(allFieldsofTable || []);
 
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
        setShowSearch(!showSearch);
        event.stopPropagation();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const handleColumnResizeWithoutAPI = useCallback((_, newSize, colIndex) => {
    let newarrr = [...(fieldsToShow || allFieldsofTable)];
    let obj = Object.assign({}, newarrr[colIndex]);
    obj.width = newSize;
    newarrr[colIndex] = obj;
    setFieldsToShow(newarrr);
  });
  

  const getData = useCallback(
    (cell) =>
      getDataExternalFunction(cell,allRowsData,fieldsToShow,readOnlyDataTypes, users),
    [allRowsData, fieldsToShow, users]
  );

 
  return (
    <>
      <div className="table-container" style={{ height: props?.height || `74vh` }}>
        <DataEditor
          {...cellProps}
          width={props?.width || window.screen.width}
          getCellContent={getData}
          columns={fieldsToShow}
          rows={allRowsData.length}
          gridSelection={selection}
          rowMarkers="both"
          rowSelectionMode="multi"
          showSearch={showSearch}
          onSearchClose={() => setShowSearch(false)}
          onColumnResize={handleColumnResizeWithoutAPI}
          headerIcons={headerIcons}
          showMinimap={props?.minimap}
        />
      </div>
    </>
  );
}
TemplateTable.propTypes = {
  minimap: PropTypes.any,
  height: PropTypes.any,
  width: PropTypes.any,
};