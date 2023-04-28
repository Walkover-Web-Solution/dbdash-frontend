import React from 'react'
import { PropTypes } from 'prop-types';
//import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
function AddRecord(props) {
const data = `
-data {
  "fieldId1" : "value1",
  "fieldId2" : "value2",
  "fieldId3" : "value3",
   ...
     }
`;
  return (
    <>
        <Typography style={{fontWeight: 'bold' ,fontSize: '24px' }}>Add Table Records</Typography>
        <Typography>
        <span>
        To create {props.table} new records, issue a POST request to the {props.table} endpoint.
        <br/> Your request body should include a json.These json should have field id and field value as a key value pair.
        </span>
      </Typography>
      <CodeSnippet  codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}/>
      <Typography>{`-H auth-key: YOUR_SECRET_API_TOKEN `}</Typography>
      <Typography>{`-H Content-Type: application/json` }</Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data}</Typography>
    </>
  )
}
AddRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default AddRecord