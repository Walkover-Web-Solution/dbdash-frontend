import { Box, Typography } from "@mui/material";
import React from "react";
// import { insertRow } from "../../../api/rowApi";
import PropTypes from "prop-types";

import './curl.css'


export default function Curl() {


  return (
    <Box
    className="firstbox" 
      
    >
      <Box className="secondbox" >EXAMPLE REQUEST
          <Typography><pre>{
           "curl https://localhost:5000/dbId/tablename" 
           }</pre>
          </Typography>
      </Box>
      <Box sclassName="secondbox">EXAMPLE RESPONSE</Box>
    </Box>
  );
}
Curl.propTypes= {
  dbs: PropTypes.array,
  dbData: PropTypes.any,
  


}
