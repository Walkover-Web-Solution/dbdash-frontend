import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';

import CodeSnippet from '../codeSnippet';
import { Typography } from "@mui/material";
function UpdateRecord(props) {
  return (
    <>
    
       <Typography style={{fontWeight: 'bold',fontSize: '24px'}}>Update Table Records</Typography>
        <span>
        To update {props.table} records, issue a request to the {props.table} endpoint.  A PATCH request will only update the fields
        <br/> included in the request. Fields not included in the request will be unchanged.
        </span>
    
    <br/>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}/{:id}"`}/>
      <span>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</span>
      <span>{`-H "Content-Type: application/json"` }</span>
    </Box>
    </>
  )
}
UpdateRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default UpdateRecord