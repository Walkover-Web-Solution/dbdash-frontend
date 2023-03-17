import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
function DeleteRecord(props) {
  return (
    <>
    <Box>
    <Typography style={{fontWeight: 'bold', fontSize: '24px' }}>Delete Table Records</Typography>
        <span>
        To delete {props.table} records, issue a DELETE request to the Teams endpoint.
      </span>
    </Box>
    <br/>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}/{:id}"`}/>
      <span>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</span>
    </Box>
    </>
  )
}
DeleteRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default DeleteRecord







