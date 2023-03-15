import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Container } from "@mui/material";
import { useParams} from "react-router-dom";
import TablesList from "../component/table/tablesList";
import { Link } from 'react-router-dom'
import { Divider } from "@mui/material";
import MainNavbar from "../component/mainNavbar";
import { getDbById } from "../api/dbApi";
function DbDetails() {
    var {dbId} = useParams();
    // const location = useLocation();
    const [tables, setTables] = useState(0);
    const [dbData, setDbData] = useState(null);
    useEffect(() => {
        // if (location?.state) {
        //     setDbData(location?.state);
        // } else {
            getAllTableName(dbId);
            // handle case where no data was passed
        // }
    }, [dbId]);
    const getAllTableName = async (dbId) => {
        var object = {}
        const data = await getDbById(dbId)
        object.db=data.data.data
        setDbData(object);
      }
    return (
        <>
        <Box>
      <MainNavbar/>
    </Box>
            <Container sx={{height:'40px'}}>
                {dbData ? (
                    <>
                    <Typography variant="body1" align="center">
                        {dbData?.db.name}
                    </Typography>
                    <div style={{width: "60px",  right: "20px",   position: "absolute",top:"60px"}}>
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
            <Divider color="black" variant="fullwidth" sx={{ mb: 2}}  />
            <Box align="center">
                <TablesList dbData={dbData} tables={tables} setTables={setTables} />
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