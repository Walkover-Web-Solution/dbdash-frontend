import React, { useState } from 'react'
import { PropTypes } from 'prop-types';
// import { Box } from '@mui/system';
import OptionalParameter from './optionalParameter';
import { Typography } from "@mui/material";
import CodeBlock from './Codeblock';
import Records from './records';
import ResponseBox from './responseBox';
function UpdateRecord(props) {
  const[value,setValue]=useState('');
  const[arr,setArr]=useState([]);
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
      <CodeBlock code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}${value!="" ? `?${value}`:``}`} header={`-H auth-key: AUTH-TOKEN -H Content-Type: application/json `} body={arr}/>
      <ResponseBox response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`}/>
      </div>   
       <div style={{width:'700px',height:"65vh",overflowY:"scroll",whiteSpace:"pre-wrap",padding:"2px"}}>
       <Typography style={{fontWeight: 'bold',fontSize: '20px'}}>To Update records in the</Typography>
       <br/>
<Records db={props?.db} setArr={setArr} arr={arr} table={props?.table}/>
<br/>
<OptionalParameter setValue={setValue} age={age} value={value} setAge={setAge}/>
</div>
    
    </>
  )
}
UpdateRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default UpdateRecord