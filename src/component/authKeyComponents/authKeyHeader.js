import React from 'react'
import { Link } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@mui/material";
import PropTypes from "prop-types";
export default function AuthKeyHeader(props) {
  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "right"}}>
    <ButtonGroup  color="primary" style={{borderRadius:0}}>
      
      
      <Link
       to={`/apiDoc/db/${props?.id}`}
        style={{ textDecoration: 'none' }}
      >
  
        <Button     className="mui-button-outlined"  variant="outlined" >{'API Documentation'}</Button>
        </Link>
        <Button variant="contained"  className="mui-button" sx={{
        pointerEvents: 'none',
        // opacity: 0.5,
        // Additional custom styles
      }}>{'Auth Key'}</Button>

    </ButtonGroup>
       
      </Box>
    </>
  )
}
AuthKeyHeader.propTypes = {
  id: PropTypes.string
}