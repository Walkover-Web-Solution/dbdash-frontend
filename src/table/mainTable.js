import React, { memo } from "react";
import "./style.css";
import Table from "./table";
// import { grey } from "./colors";
import {  useDispatch ,useSelector } from "react-redux";
// import { getTableInfo } from "../store/table/tableSelector";
import { bulkAddColumns } from "../store/table/tableThunk";
import PropTypes from "prop-types";
const  MainTable = memo ( ({page,setPage}) =>  {
  
  const columns=useSelector((state)=>state.table.columns);
  const data=useSelector((state)=>state.table.data);
  const dbId=useSelector((state)=>state.table.dbId);
  const tableId=useSelector((state)=>state.table.tableId);
  // const [page,setPage] = useState(2);
  const dispatchs = useDispatch();
  const fetchMoreData = () => {
    dispatchs(bulkAddColumns({
      "dbId": dbId,
      "tableName": tableId,
      "pageNo":page+1
    }));
    setPage((page) => page + 1);
  };
 
  return (
    <div
      style={{
        width: "fitcontent",
        
        overflowX: "scroll",
        height:"65vh",
        overflowY:"hidden",
    
      }}
      // id="scrollableDiv"
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
      <div style={{  display: "flex", width: "100vw"}}>
        <div
          style={{
            padding: "1rem",
            marginLeft: "15px",
            marginRight: "30px",
            backgroundColor:'#fff',
          }}
        >
          {columns?.length > 0 && <Table
          update={fetchMoreData}
          hasMore={true}
            columns={columns}
            data={data|| []}
            dispatch={dispatchs}
            // skipReset={tableInfo.skipReset}
          /> }
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
)
MainTable.displayName = 'MainTable';
export default  MainTable;
MainTable.propTypes = {
  page: PropTypes.any,
  setPage: PropTypes.any
};

