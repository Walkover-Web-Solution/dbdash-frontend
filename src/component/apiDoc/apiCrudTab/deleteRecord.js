import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
// import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
import CodeBlock from './Codeblock';
function DeleteRecord(props) {
  return (
    <>
       <CodeBlock code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN `}/>
   
    <Box>
    <Typography style={{fontWeight: 'bold', fontSize: '24px' }}>Delete Table Records</Typography>
        <span>
        To delete {props.table} records, issue a DELETE request to the  {props.table} endpoint.
      </span>
    </Box>
    <br/>
    <Box >
      {/* <CodeSnippet  style={{backgroundColor:"black"}} codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}`}/>
    */}
    {/* <span>{`-H auth-key: YOUR_SECRET_API_TOKEN `}</span> */}
    </Box>
    </>
  )
}
DeleteRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default DeleteRecord