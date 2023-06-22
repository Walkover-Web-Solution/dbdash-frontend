import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import { getViewTable } from "../../api/viewTableApi";
import "./viewTable.scss"; // Import custom CSS file

const ViewTable = () => {
  const { viewid } = useParams();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getViewTable(viewid);
        // console.log("respose",response)
        const responseData = response.data.data;

        const fetchedRows = responseData.offsetAndRows.rows;
        setRows(fetchedRows);

        const fields = responseData.sortedObj.fields;
        const columns = Object.entries(fields).map(([key, value]) => ({
          title: value.fieldName?.toLowerCase() || key?.toLowerCase(),
          id: key,
          dataType: value.fieldType?.toLowerCase(),
          hasMenu: true,
          metadata: value.metaData,
          width: value.metaData?.width || 150,
        }));
        setColumns(columns);
      } catch (error) {
        console.error("Error fetching view table:", error);
      }
    };

    fetchData();
  }, [viewid]);

  const getData = (cell) => {
    const [col, row] = cell;
    const rowData = rows[row];
    const column = columns[col];

    if (rowData && column) {
      const cellData = rowData[column.id];
      const { dataType } = column;

      if (dataType === "autonumber") {
        return {
          kind: GridCellKind.Number,
          allowOverlay: true,
          data: cellData,
          displayData: cellData?.toString(),
        };
      } else if (
        dataType === "createdat" ||
        dataType === "createdby" ||
        dataType === "longtext" ||
        dataType === "rowid"
      ) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: cellData || "",
          data: cellData || "",
        };
      } else if (dataType === "multipleselect" && cellData != null) {
        return {
          kind: GridCellKind.Bubble,
          data: cellData,
          allowOverlay: true,
        };
      } else if (dataType === "attachment" && cellData != null) {
        return {
          kind: GridCellKind.Image,
          data: cellData,
          allowOverlay: true,
          allowAdd: true,
        };
      } else {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: cellData || "",
          data: cellData || "",
        };
      }
    } else {
      return {};
    }
  };

  return (
    <div className="table-container">
      {rows.length > 0 && (
        <DataEditor
          width={1000}
          height={500}
          getCellContent={getData}
          columns={columns}
          rows={rows.length}
          rowMarkers="both"
          rowSelectionMode="multi"
        />
      )}
    </div>
  );
};

export default ViewTable;