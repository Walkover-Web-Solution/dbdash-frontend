import React, { useEffect } from "react";
import "./style.css";
import Table from "./table";
// import { grey } from "./colors";
import {  useDispatch ,useSelector } from "react-redux";
import { getTableInfo } from "../store/table/tableSelector";

function 
MainTable() {

  useEffect(() => {
},[]);
  const tableInfo=useSelector((state)=>getTableInfo(state));

  const dispatchs = useDispatch();
 
  return (
    <div
      style={{
        width: "98vw",
        height: "100vh",
        overflowX: "hidden"
      }}
    >
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          type:"checkbox",
        }}
      >
      </div>
      <div style={{ overflow: "auto", display: "flex", width: "100vw"}}>
        <div
          style={{
            padding: "1rem",
            marginLeft: "15px",
            marginRight: "30px",
            backgroundColor:'#fff',
          }}
        >
          {tableInfo?.columns?.length>0 && <Table
            columns={tableInfo.columns}
            data={tableInfo.data}
            dispatch={dispatchs}
            skipReset={tableInfo.skipReset}
          />}
        </div>
      </div>
      <div
        style={{
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}  
      >
      </div>
    </div>
  );
}

export default MainTable;
