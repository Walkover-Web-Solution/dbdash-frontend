import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Container ,Divider} from "@mui/material";
import { useParams} from "react-router-dom";
import TablesList from "../component/table/tablesList";
import { Link } from 'react-router-dom'
import MainNavbar from "../component/mainNavbar";
import { getDbById } from "../api/dbApi";
// import {  getTable1 } from '../store/allTable/allTableThunk';
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";
import { resetData } from "../store/table/tableSlice";
function DbDetails() {
    var {dbId} = useParams();
    const dispatch = useDispatch()
    // const location = useLocation();
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
      <MainNavbar/>
    </Box>
            <Container sx={{height:'40px'}}>
                {dbData ? (
                    <>
                    <Typography variant="body1" align="center" fontWeight={600} color="#333" >
                        {dbData?.db.name}
                    </Typography>
                    <div style={{width: "60px",  right: "20px",   position: "absolute",top:"59px"}}>
                      <Link to={{ pathname: `/apiDoc/db/${dbId}` }} style={{ textDecoration: "none" }}>
                          <Button variant="contained" color="primary" size="small">APIs</Button>
                  </Link>
                  </div>
                  </>
                ) : (
                    <Typography variant="body1" align="center">
                        No data to display.
                    </Typography>
                )}
            </Container>
            <Divider color="black" variant="fullwidth" />
            <Box align="center" style={{height: "calc(100vh - 96px)"}} >
            { dbData &&    <TablesList dbData={dbData} tables={tables} setTables={setTables} />}
            </Box>
        </>
    );
}
export default DbDetails;
DbDetails.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.object
    })
};