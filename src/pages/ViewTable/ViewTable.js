import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import { getViewTable } from "../../api/viewTableApi";

const ViewTable = () => {
  const { viewid } = useParams();
  let columns = [];
  let rows = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getViewTable(viewid);
        rows = response.data.data.offsetAndRows.rows;
        const field = response.data.data.sortedObj.fields;
        Object.entries(field).forEach(([key, value]) => {
          const column = {
            title: value.fieldName?.toLowerCase() || key?.toLowerCase(),
            id: key,
            dataType: value.fieldType?.toLowerCase(),
            hasMenu: true,
            metadata: value.metaData,
            width: value.metaData?.width || 150,
          };
          columns.push(column);
        });
        console.log(columns)
        console.log(rows)
      } catch (error) {
        console.error("Error fetching view table:", error);
      }
    };

    fetchData();
  }, [viewid]);

  
  const getData = (cell) => {
    console.log("in")
    const [col, row] = cell;
    const dataRow = rows[row];
    if (dataRow) {
      const d = dataRow[columns[col]?.id];
      console.log(d)
      const { dataType } = columns[col];

      if (dataType === "autonumber") {
        return {
          kind: GridCellKind.Number,
          allowOverlay: true,
          data: d,
          displayData: d?.toString(),
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
          displayData: d || "",
          data: d || "",
        };
      } else if (dataType === "multipleselect" && d != null) {
        return {
          kind: GridCellKind.Bubble,
          data: d,
          allowOverlay: true,
        };
      } else if (dataType === "attachment" && d != null) {
        return {
          kind: GridCellKind.Image,
          data: d,
          allowOverlay: true,
          allowAdd: true,
        };
      } else {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: d || "",
          data: d || "",
        };
      }
    } else {
      return {};
    }
  };

  return (
    <>
      <div className="table-container">
        <DataEditor
          width={1300}
          getCellContent={getData}
          columns={columns}
          rows={rows.length}
          rowMarkers="both"
          rowSelectionMode="multi"
        />
      </div>
    </>
  );
};

export default ViewTable;




// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
// import { getViewTable } from "../../api/viewTableApi";

// const ViewTable = () => {
//   const { viewid } = useParams();
//   let columns = [];
//   let rows = [];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getViewTable(viewid);
//         rows = response.data.data.offsetAndRows.rows;
//         const field = response.data.data.sortedObj.fields;
//         Object.entries(field).forEach(([key, value]) => {
//           const column = {
//             title: value.fieldName?.toLowerCase() || key?.toLowerCase(),
//             id: key,
//             dataType: value.fieldType?.toLowerCase(),
//             hasMenu: true,
//             metadata: value.metaData,
//             width: value.metaData?.width || 150,
//           };
//           columns.push(column);
//         });
//       } catch (error) {
//         console.error("Error fetching view table:", error);
//       }
//     };

//     fetchData();
//   }, [viewid]);

//   const getData = (cell) => {
//     const [col, row] = cell;
//     const dataRow = rows[row];
//     if (dataRow) {
//       const d = dataRow[columns[col]?.id];
//       const { dataType } = columns[col];

//       if (dataType === "autonumber") {
//         return {
//           kind: GridCellKind.Number,
//           allowOverlay: true,
//           data: d,
//           displayData: d?.toString(),
//         };
//       } else if (
//         dataType === "createdat" ||
//         dataType === "createdby" ||
//         dataType === "longtext" ||
//         dataType === "rowid"
//       ) {
//         return {
//           kind: GridCellKind.Text,
//           allowOverlay: true,
//           readonly: false,
//           displayData: d || "",
//           data: d || "",
//         };
//       } else if (dataType === "multipleselect" && d != null) {
//         return {
//           kind: GridCellKind.Bubble,
//           data: d,
//           allowOverlay: true,
//         };
//       } else if (dataType === "attachment" && d != null) {
//         return {
//           kind: GridCellKind.Image,
//           data: d,
//           allowOverlay: true,
//           allowAdd: true,
//         };
//       } else {
//         return {
//           kind: GridCellKind.Text,
//           allowOverlay: true,
//           readonly: false,
//           displayData: d || "",
//           data: d || "",
//         };
//       }
//     } else {
//       return {};
//     }
//   };

//   return (
//     <>
//       <div className="table-container">
//         <DataEditor
//           width={1300}
//           getCellContent={getData}
//           columns={columns}
//           rows={rows.length}
//           rowMarkers="both"
//           rowSelectionMode="multi"
//         />
//       </div>
//     </>
//   );
// };

// export default ViewTable;
