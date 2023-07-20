import { Box, Typography } from "@mui/material";
import React from "react";
// import { insertRow } from "../../../api/rowApi";
import PropTypes from "prop-types";
import "./curl.scss"
export default function Curl() {


  return (
    <Box className="curl-box"
      sx={{
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <Box className="curl-box1">EXAMPLE REQUEST
          <Typography><pre>{
           "curl https://localhost:5000/dbId/tablename" 
           }</pre>
          </Typography>
      </Box>
      <Box  className="curl-box1">EXAMPLE RESPONSE</Box>
    </Box>
  );
}
Curl.propTypes= {
  dbs: PropTypes.array,
  dbData: PropTypes.any,
  


}
