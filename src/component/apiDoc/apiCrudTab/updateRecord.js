import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
function UpdateRecord(props) {
  return (
    <>
    <div>
       <h2>Update Table Records</h2>
        <p>
        To update {props.table} records, issue a request to the {props.table} endpoint.  A PATCH request will only update the fields
        <br/> included in the request. Fields not included in the request will be unchanged.
        </p>
    </div>
    <br/>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}/{:id}"`}/>
      <p>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</p>
      <p>{`-H "Content-Type: application/json"` }</p>
    </Box>
    </>
  )
}
UpdateRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default UpdateRecord