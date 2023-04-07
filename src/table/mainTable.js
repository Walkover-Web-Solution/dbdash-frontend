import React, { useEffect } from "react";
import "./style.css";
import Table from "./table";
// import { grey } from "./colors";
import {  useDispatch ,useSelector } from "react-redux";
import { getTableInfo } from "../store/table/tableSelector";
import { useState } from "react";
import { bulkAddColumns } from "../store/table/tableThunk";
// import { useRef } from "react";
// import { useDispatch } from "react-redux";
function
MainTable() {
  const dispatch = useDispatch();
  const [page,setPage] = useState(1);
  const [tableData,setTableData] = useState([]);
    console.log(page,tableData)
//   useEffect(() => {
// },[]);
// const tableRef = useRef(null);
  const tableInfo=useSelector((state)=>getTableInfo(state));
  const handelInfinitescroll = async ()=>{
    const s = document.getElementById("get_data")
    // const myDivHeight = s.clientHeight;
    // const myDivWidth = s.clientWidth;
    console.log("s",s)
    // console.log("full height",s.scrollHeight)
    // console.log("view height",s.clientHeight)
    // console.log("scroll height",s.scrollTop)
    try {
      if(s.clientHeight + s.scrollTop + 1 >= s.scrollHeight ){
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    document.getElementById("get_data").addEventListener("scroll",handelInfinitescroll);
    return ()=> document.getElementById("get_data").removeEventListener("scroll",handelInfinitescroll)
  },[]);
  useEffect(() => {
    if (tableInfo.dbId,tableInfo.tableId) {
      // const tableNames = Object.keys(dbData.db.tables);
      dispatch(bulkAddColumns({
        "dbId":tableInfo.dbId,
        "tableName": tableInfo.tableId,
        "page":page
      }));
    }
    // setTableData((prev)=>[...prev,tableInfo.data])
    setTableData(tableInfo.data)
  }, [page])
  // useEffect(() => {
  //   const tableElement = tableRef.current;
  //   const handleInfiniteScroll = () => {
  //     console.log("full height", tableElement.scrollHeight);
  //     console.log("view height", tableElement.clientHeight);
  //     console.log("scroll height", tableElement.scrollTop);
  //     try {
  //       if (
  //         tableElement.scrollTop + tableElement.clientHeight >=
  //         tableElement.scrollHeight
  //       ) {
  //         setPage((prev) => prev + 1);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   tableElement.addEventListener("scroll", handleInfiniteScroll);
  //   return () => tableElement.removeEventListener("scroll", handleInfiniteScroll);
  // }, []);
// }
  const dispatchs = useDispatch();
  return (
    <div id="get_data"
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
      <div style={{ overflow: "auto", display: "flex", width: "100vw"}} >
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
            // data={tableInfo.data|| []}
            data={tableData || []}
            dispatch={dispatchs}
            skipReset={tableInfo.skipReset}
            // ref={tableRef}
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