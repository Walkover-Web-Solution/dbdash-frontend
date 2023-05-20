import React from 'react'
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';
export default function AuthKeyHeader(props) {
  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Link to={`/apiDoc/db/${props?.id}`} style={{textDecoration:'none'}}>
          <Button variant="outlined" color="primary" sx={{mr:1}}><CloseIcon/></Button>
        </Link>
       
      </Box>
    </>
  )
}
AuthKeyHeader.propTypes = {
  id: PropTypes.string
}