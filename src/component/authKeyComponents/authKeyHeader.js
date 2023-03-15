import React from 'react'
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";
export default function AuthKeyHeader(props) {
  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
        <Link to={`/apiDoc/db/${props?.id}`} style={{textDecoration:'none'}}>
          <Button variant="contained" color="primary" sx={{mr:1}}> APIs Documentation</Button>
        </Link>
        <Button variant="contained" color="primary" disabled>Auth Key</Button>
      </Box>
    </>
  )
}
AuthKeyHeader.propTypes = {
  id: PropTypes.string
}