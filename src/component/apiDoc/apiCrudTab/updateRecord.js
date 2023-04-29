import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import CodeSnippet from '../codeSnippet';
import { Typography } from "@mui/material";
function UpdateRecord(props) {
  const data = `
-data {
  "fieldId1" : "value1"
     }
`;
  return (
    <>
       <Typography style={{fontWeight: 'bold',fontSize: '24px'}}>Update Table Records</Typography>
        <span>
        To update {props.table} records, issue a request to the {props.table} endpoint.  A PATCH request will only update the fields
        <br/> included in the request. Fields not included in the request will be unchanged.
        <br/> Your request body should include a json.These json should have field id and field value as a key value pair.
        </span>
    <br/>
    <br/>
    <Box>
      <CodeSnippet  codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}`}/>
      <Typography>{`-H auth-key: YOUR_SECRET_API_TOKEN `}</Typography>
      <Typography>{`-H Content-Type: application/json` }</Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data}</Typography>
    </Box>
    </>
  )
}
UpdateRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default UpdateRecord