import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import { bulkAddColumns } from "../store/table/tableThunk";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.scss";
import { reorderRows } from "./reorderRows.js";

export default function MainTable() {
  const params = useParams();
  const fields = useSelector((state) => state.table.columns);
  const dataa = useSelector((state) => state.table.data);
  const [, setColumns] = useState(fields);
  const [data, setData] = useState(dataa);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      bulkAddColumns({
        dbId: params?.dbId,
        tableName: params?.tableName,
      })
    );
  }, []);

  const onAddCol = useCallback(() => {
    const newData = dataa.map((row) => {
      return { ...row, new: "" };
    });
    setData(newData);
    setColumns([
      ...fields,
      {
        title: "New",
        id: "new",
        hasMenu: true,
      },
    ]);
  }, [dataa, fields]);

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

  const handleRowMoved = useCallback((from, to) => {
    reorderRows(from, to, data, setData);
  }, [data, setData]);
  return (
    <div className="table-container">
      <DataEditor
        getCellContent={getData}
        columns={fields}
        rows={dataa.length}
        rowMarkers="both"
        onRowMoved={handleRowMoved}
        rightElement={
          <div className="addCol">
            <button onClick={onAddCol}>+</button>
          </div>
        }
      />
    </div>
  );
}
