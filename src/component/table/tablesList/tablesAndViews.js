import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { bulkAddColumns } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MainTable from "../../../table/mainTable";
import { setTableLoading } from "../../../store/table/tableSlice";
import "./tablesAndViews.scss";
import   {  customUseSelector }  from "../../../store/customUseSelector";
import TableList from "./tableList";
import ViewList from "./viewList";
import TableOptions from "./tableOptions";
import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import { resetData } from "../../../store/table/tableSlice";


 function TablesAndViews({ dbData }) {
  const isTableLoading = customUseSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [minimap, setMinimap] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const tableNames = Object.keys(dbData?.db?.tables)||[];
    dispatch(setTableLoading(true));
    if (params?.tableName && !params?.filterName) {

      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
        })
      );
    }
    
    if (!params?.tableName) {
      navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`,{replace:true});  // author: rohitmirchandani, replace the current page to fix navigation
    }
  }, [params?.tableName]);

  useEffect(()=>{
    if(!params.filterName){
      setPage(1);
      dispatch(resetData());
      if (params?.tableName) {
        dispatch(
          bulkAddColumns({
            dbId : dbData?.db?._id,
            tableName: params?.tableName,
            pageNo: 1,
          })
        );
      }
    }
  }, [location])

  return (
    <>
      <div className="tableslist">  
        <TableList dbData = {dbData} setPage = {setPage} />
        <ViewList 
          dbData = {dbData} 
          filterId = {filterId}   
          setFilterId = {setFilterId} 
          anchorEl = {anchorEl} 
          setAnchorEl={setAnchorEl}
          setShareLinkOpen={setShareLinkOpen}
        />
        <TableOptions
          dbData = {dbData}
          setFilterId={setFilterId}
          setAnchorEl = {setAnchorEl}
          minimap = {minimap}
          setMinimap={ setMinimap} 
          shareLinkOpen = {shareLinkOpen}
          setShareLinkOpen = {setShareLinkOpen}
        />
      </div>
      <div style={{ marginTop: "250px" }}>
     
        {isTableLoading ? (
          <div className="table-loading"> <CircularProgress className="table-loading" /></div>
        ) : (
          <div>
            <MainTable setPage={setPage} page={page} minimap={minimap} />
          </div>
        )}
      </div>
    </>
  );
}
export default memo(TablesAndViews);
TablesAndViews.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  tables: PropTypes.any,
  dropdown: PropTypes.any,
  setSelectedTable: PropTypes.any,
  label: PropTypes.any,
  setTables: PropTypes.any,
};