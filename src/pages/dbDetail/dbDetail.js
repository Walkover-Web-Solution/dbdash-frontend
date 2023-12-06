import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import TablesList from "../../component/table/tablesList/tablesAndViews";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import { getDbById } from "../../api/dbApi";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import { resetData } from "../../store/table/tableSlice";
import "./dbDetail.scss";
function DbDetails() {
  const { dbId } = useParams();
  const dispatch = useDispatch();
  const [dbData, setDbData] = useState(null);
  useEffect(() => {
    if (dbId) getAllTableName(dbId);
  }, [dbId]);

  useEffect(() => {
    return () => dispatch(resetData());
  }, []);
  const getAllTableName = async (dbId) => {
    const data = await getDbById(dbId);
    const object = { db: data.data.data };
    dispatch(
      setAllTablesData({
        dbId: dbId,
        tables: data.data.data.tables,
        orgId: data.data.data?.org_id,
        userAcess: data.data.data?.users,
        userDetail: data.data.data?.usersMapping,
      })
    );
    setDbData(object);
  };
  return (
    <>
      <Box className="db-detail-navbar-box">
        <MainNavbar dbData={dbData} />
      </Box>
      <Box className="db-detail-table-list-box">
        {dbData && <TablesList dbData={dbData} />}
      </Box>
    </>
  );
}

export default DbDetails;
