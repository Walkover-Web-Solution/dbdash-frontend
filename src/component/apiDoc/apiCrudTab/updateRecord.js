import React, { useState } from 'react'

import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
//import CodeSnippet from '../codeSnippet';

import { Typography ,Link,TextField,} from "@mui/material";
import CodeBlock from './Codeblock';
import Records from './records';
function UpdateRecord(props) {
  const[value,setValue]=useState('');
  const[arr,setArr]=useState([]);
  return (
    <>
      <CodeBlock code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}${value!="" ? `?${value}`:``}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN -H Content-Type: application/json `} body={arr}/>
    
      <Typography style={{fontWeight: 'bold',fontSize: '20px'}}>To Update records in the</Typography>
       <br/>
       <Typography style={{fontWeight: 'bold',fontSize: '17px'}}>WHERE</Typography>
       <Typography>
        To filter record based on certain
        </Typography>
        <TextField style={{ height: 10, width: 450 }} value={value} onChange={(e)=>{setValue(e.target.value)}} />
        <br/>
        <br/>
        <br/>
        <Link href="#" style={{fontSize: '15px'}}>Learn more about the where clause</Link>
        <br />
        <br />
       <Typography style={{fontWeight: 'bold',fontSize: '17px'}}>WHAT TO UPDATE</Typography>
       <Typography>
        To filter record based on certain
        </Typography>
    <br/>
    <br/>

<Records db={props?.db} setArr={setArr} arr={arr} table={props?.table}/>
    <Box>
    
    </Box>
    </>
  )
}
UpdateRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default UpdateRecord