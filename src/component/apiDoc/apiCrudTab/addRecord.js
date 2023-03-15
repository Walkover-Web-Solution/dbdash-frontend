import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
function AddRecord(props) {
  return (
    <>
    <div>
        <h2>Add Table Records</h2>
        <p>
      To create new  Table records, use the create method.Note that table names and table ids can be used interchangeably.<br/>
      Using table ids means table name changes do not require modifications to your API request.
      </p>
    </div>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}"`}/>
      <p>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</p>
      <p>{`-H "Content-Type: application/json"` }</p>
    </Box>
    </>
  )
}
AddRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default AddRecord