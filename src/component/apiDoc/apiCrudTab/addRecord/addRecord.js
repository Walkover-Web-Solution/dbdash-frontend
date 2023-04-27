import React from 'react'
import { PropTypes } from 'prop-types';
//import { Box } from '@mui/system';
import CodeSnippet from '../../codeSnippet/codeSnippet';
import { Typography } from '@mui/material';
import './addRecord.css'
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
        <Typography className="addtablerecords" >Add Table Records</Typography>
        <Typography>
        <span>
        To create {props.table} new records, issue a POST request to the {props.table} endpoint.
        <br/> Your request body should include a json.These json should have field id and field value as a key value pair.
        </span>
      </Typography>
      <CodeSnippet  codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}/>
      <Typography>{`-H Authorization: Bearer YOUR_SECRET_API_TOKEN `}</Typography>
      <Typography>{`-H Content-Type: application/json` }</Typography>
      <Typography className="data">{data}</Typography>
    </>
  )
}
AddRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default AddRecord