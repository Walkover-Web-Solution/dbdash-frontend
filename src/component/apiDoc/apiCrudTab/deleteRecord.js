import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
function DeleteRecord(props) {
  return (
    <>
    <div>
    <h2>Delete Table Records</h2>
        <p>
        To delete {props.table} records, issue a DELETE request to the Teams endpoint.
      </p>
    </div>
    <br/>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}/{:id}"`}/>
      <p>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</p>
    </Box>
    </>
  )
}
DeleteRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default DeleteRecord







