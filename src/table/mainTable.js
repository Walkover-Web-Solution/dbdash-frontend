import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import {  bulkAddColumns} from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell } from "./addRow";

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

  const getData = useCallback((cell) => {
    const [col, row] = cell;
    const dataRow = dataa[row];
    const d = dataRow[fields[col].id];
    const { dataType } = fields[col];

    if (dataType === "autonumber") {
      return {
        allowOverlay: true,
        kind: GridCellKind.Number,
        data: d,
        displayData: d.toString(),
      };
    }

    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: d || "",
      data: d || "",
    };
  }, [dataa, fields]);


  return (
    <div className="table-container">
      <DataEditor
        getCellContent={getData}
        onRowAppended={addRows}
        columns={fields}
        rows={dataa.length}
        rowMarkers="both"
        onCellEdited={onCellEdited}
        onRowMoved={handleRowMoved}
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