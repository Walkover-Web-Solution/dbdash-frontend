import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box} from "@mui/material";
import { useParams} from "react-router-dom";
import TablesList from "../component/table/tablesList";
import MainNavbar from "../component/mainNavbar";
import { getDbById } from "../api/dbApi";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";
import { resetData } from "../store/table/tableSlice";

function DbDetails() {
    var {dbId} = useParams();
    const dispatch = useDispatch()
    const [tables, setTables] = useState(0);
    const [dbData, setDbData] = useState(null);
    useEffect(() => {
        if(dbId)
            getAllTableName(dbId);
    }, [dbId]);

    useEffect(() => {
        return ()=> dispatch (resetData())
    }, []);
    const getAllTableName = async (dbId) => {

        var object = {}
        const data = await getDbById(dbId)
        object.db=data.data.data
        dispatch(setAllTablesData(
            { 
                "dbId":dbId,
                "tables" :data.data.data.tables
            }
        ))
        setDbData(object);
      }
    return (
        <>

        <Box sx ={{ overflow: 'hidden'}}>
      <MainNavbar dbData={dbData}/>
    </Box>
           
            <Box align="center" style={{height: "calc(100vh - 96px)"}} >
            { dbData && <TablesList dbData={dbData} tables={tables} setTables={setTables} />}
            </Box> 
        </>
    );  
}

export default DbDetails;
DbDetails.propTypes = {
    dbData: PropTypes.any,
    location: PropTypes.shape({
        state: PropTypes.object
    })
};