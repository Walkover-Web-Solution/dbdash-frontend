import React,{useState,useCallback} from "react";
// import "./style.css";
// import Table from "./table";
// import {useDispatch } from "react-redux";
import {DataEditor,
  GridCellKind
} from "@glideapps/glide-data-grid";
// import { bulkAddColumns } from "../store/table/tableThunk";
// import PropTypes from "prop-types";
// import { useParams } from "react-router-dom";
import "@glideapps/glide-data-grid/dist/index.css";
import "../../src/App.css"

export default function MainTable() {
  
  const columns = [
    { title: "First Name" },
    { title: "Last Name"}
];
const data = [
    {
      "firstName": " Fowler",
      "lastName": "BUZZNESS",
    },
     {
      "firstName": "Hines Fowler",
      "lastName": "BUZZNESS",
     
    },
     {
      "firstName": "ddfr",
      "lastName": "BUZZNESS",
     
    },
]
const [rowData, setRowData] = useState(data);
const getData=useCallback((cell)=>{
  console.log("cell",cell)
  const [col, row] = cell;
    const dataRow = rowData[row];
    const indexes = ["firstName", "lastName"];
    const d = dataRow[indexes[col]]
    return {
      kind: GridCellKind.Text,
      allowOverlay: false,
      displayData: d,
      data: d,
  };
},[rowData])

const reorderRows = useCallback((from, to) => {
  console.log(from,to,12432);
          setRowData(cv => {
            const d = [...cv];
            const removed = d.splice(from, 1);
            d.splice(to, 0, ...removed);
            return d;
        });
     }, []);



  return (
        <DataEditor
        getCellContent={getData}
        columns={columns}
        rows={data?.length}
        rowMarkers={"both"}
        onRowMoved={reorderRows}
      />
)
  }

