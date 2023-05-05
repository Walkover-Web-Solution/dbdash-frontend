import React, { memo } from "react";
import "./style.css";
import Table from "./table";
import {  useDispatch ,useSelector } from "react-redux";
import { useParams} from 'react-router-dom';
import { bulkAddColumns } from "../store/table/tableThunk";
import PropTypes from "prop-types";

const  MainTable = memo ( ({page,setPage}) =>  {
  
  const columns=useSelector((state)=>state.table.columns);
  const data=useSelector((state)=>state.table.data);
  const dbId=useSelector((state)=>state.table.dbId);
  const tableId=useSelector((state)=>state.table.tableId);
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const dispatchs = useDispatch();
 const params =  useParams();
  const fetchMoreData = () => {
    // dispatchs(setTableLoading(true));
    dispatchs(bulkAddColumns({
      "dbId": dbId,
      "tableName": tableId,
      "pageNo": page+1,
      "filter": AllTableInfo[params?.tableName]?.filters[params?.filterName]?.query,
    }));
    setPage((page) => page + 1);
  };


  return (
    <div
      style={{
        width: "fitcontent",
        
        // overflowX: "scroll",
        // Calculate the height of tab and button and replace with 130px
        // height:"calc(100% - 130px)",
        overflowX:"hidden",
        overflowY:"hidden",
        marginTop: 20
      }}
      // id="scrollableDiv"
    >
      <div style={{  display: "flex", width: "100vw", height:"100%"}}>
        <div
          style={{
            padding: "6px 0px",
            marginLeft: "4px"
            
          }}
        >
          {columns?.length > 0 && 
          <Table
           update={fetchMoreData}
           hasMore={true}
            columns={columns}
            data={data|| []}
            dispatch={dispatchs}
            page = {page}
            // skipReset={tableInfo.skipReset}
          /> }
        </div>
        
      </div>
      {/* <div
        style={{
          // height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}  
      >
           
      </div> */}

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

