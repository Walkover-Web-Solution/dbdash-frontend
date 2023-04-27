import React from 'react'
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import './authKeyHeader.css'
export default function AuthKeyHeader(props) {
  return (
    <>
    <Box  className="box">
        <Link to={`/apiDoc/db/${props?.id}`} className='dontdecorate' >
          <Button className='button' variant="contained" color="primary" > APIs Documentation</Button>
        </Link>
        <Button  className="button" variant="contained" color="primary" disabled>Auth Key</Button>
      </Box>
    </>
  )
}
AuthKeyHeader.propTypes = {
  id: PropTypes.string
}