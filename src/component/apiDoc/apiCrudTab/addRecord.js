import React ,{useState} from "react";
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import CodeBlock from './Codeblock';

import Records from "./records";


function AddRecord(props) {
  const[arr,setArr]=useState([]);

  return (
    <>
      <CodeBlock code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN ${<br/>} -H Content-Type: application/json`} body={arr}/>
    
        <Typography style={{fontWeight: 'bold' ,fontSize: '24px' }}>Add Table Records</Typography>

        <Typography>
        <Box>


<Records db={props?.db} setArr={setArr} arr={arr} table={props?.table}/>
</Box>
        </Typography>

    </>
  )
}
AddRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default AddRecord