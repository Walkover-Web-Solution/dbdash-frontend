import React from 'react'
import { PropTypes } from 'prop-types';
import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
function AddRecord(props) {
  return (
    <>
    
        <Typography style={{fontWeight: 'bold' ,fontSize: '24px' }}>Add Table Records</Typography>
        <Typography>
      To create new  Table records, use the create method.Note that table names and table ids can be used interchangeably.<br/>
      Using table ids means table name changes do not require modifications to your API request.
      </Typography>
    
    
      <CodeSnippet  codeString={`https://localhost:5000/${props.db}/${props.table}`}/>
      <Typography>{`-H Authorization: Bearer YOUR_SECRET_API_TOKEN `}</Typography>
      <Typography>{`-H Content-Type: application/json` }</Typography>
    
    </>
  )
}
AddRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default AddRecord