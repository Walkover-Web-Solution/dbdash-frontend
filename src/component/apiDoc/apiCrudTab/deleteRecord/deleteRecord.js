import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../../codeSnippet/codeSnippet';
import { Typography } from '@mui/material';
import './deleteRecord.css'
function DeleteRecord(props) {
  return (
    <>
    <Box>
    <Typography className="bold24px" >Delete Table Records</Typography>
        <span>
        To delete {props.table} records, issue a DELETE request to the  {props.table} endpoint.
      </span>
    </Box>
    <br/>
    <Box>
      <CodeSnippet  codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:id}`}/>
      <span>{`-H Authorization: Bearer YOUR_SECRET_API_TOKEN `}</span>
    </Box>
    </>
  )
}
DeleteRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default DeleteRecord