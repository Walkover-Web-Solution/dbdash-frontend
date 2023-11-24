import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { bulkAddColumns } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MainTable from "../../../table/mainTable";
import { setTableLoading } from "../../../store/table/tableSlice";
import "./TableAndViewList.scss";
import   {  customUseSelector }  from "../../../store/customUseSelector";
import TableList from "../TableList/tableList";
import TableOptions from "../TableOptions/TableOptions";
import ViewList from "../viewList/viewList";
import { CircularProgress } from "@mui/material";

 function TableAndViewList({ dbData }) {
  const isTableLoading = customUseSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [minimap, setMinimap] = useState(false);  

  
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

  return (
    <>
      <div className="tableslist">
        <TableList dbData = {dbData} setPage = {setPage}/>
        <ViewList dbData = {dbData}/> 
        <TableOptions dbData = {dbData} minimap = {minimap} setMinimap={setMinimap}/>
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
export default memo(TableAndViewList);
TableAndViewList.propTypes = {
  dbData: PropTypes.any,
};