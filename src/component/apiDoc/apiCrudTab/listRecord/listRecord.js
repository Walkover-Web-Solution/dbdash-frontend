import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './listRecord.scss'; // Import the CSS file

function ListRecord(props) {
  const[value,setValue]=useState('');
  const[age,setAge]=useState('')
 
  return (
    <>
    <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          width: "36vw",
          padding: "10px",
          height: "65vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
     <CodeBlock   code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props?.db}/${props?.table}${value!="" ? `?${value}`:``}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN `}/>
     <ResponseBox response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`} />
     </div>
     <div style={{width:'700px',height:"65vh",overflowY:"scroll",whiteSpace:"pre-wrap",padding:"2px"}}>
        <Typography style={{fontWeight: 'bold',fontSize: '24px'}}>List records</Typography>
        <Typography>
        To list records in {props.table} ,issue a GET request to the {props.table} endpoint using {props.table} ids<br/>
        You can filter, sort, and format the results with the following query parameters.
        <br/>
        <br/>
        <OptionalParameter  db={props?.db} table={props?.table}  setValue={setValue} age={age} value={value} setAge={setAge}/>
        </Typography>
        <br/>
   
   
    </div>
    </>
  )
}
ListRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default ListRecord