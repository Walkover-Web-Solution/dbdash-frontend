import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Container ,Divider} from "@mui/material";
import { useParams} from "react-router-dom";
import TablesList from "../../component/table/tablesList/tablesList";
import { Link } from 'react-router-dom'
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import { getDbById } from "../../api/dbApi";
// import {  getTable1 } from '../store/allTable/allTableThunk';
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import { resetData } from "../../store/table/tableSlice";
import './dbDetail.css'
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
        <Box  className="nav" style={{overflow:"hidden"}} >
      <MainNavbar/>
    </Box>
            <Container className="h40" >
                {dbData ? (
                    <>
                    <Typography variant="body1" align="center" fontWeight={600} color="#333" >
                        {dbData?.db.name}
                    </Typography>
                    <div className="apidiv">
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
            <Box align="center" className="dbData"  >
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