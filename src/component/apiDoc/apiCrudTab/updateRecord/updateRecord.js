import React, { useState } from 'react'
import { PropTypes } from 'prop-types';
import OptionalParameter from '../optionalParameter/optionalParameter';
import { Typography } from "@mui/material";
import CodeBlock from '../Codeblock/Codeblock';
import Records from '../records/records';
import ResponseBox from '../responseBox';
import './updateRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';

function UpdateRecord(props) {
  const response=`
  {
    "success": true,
    "message": "'tbluclzgl'row updated successfully",
    "data": {
      "flduclzglrowid": "rowgivdqa",
      "flduclzglautonumber": 3,
      "flduclzglcreatedat": "2023-06-19T09:16:21.066Z",
      "flduclzglcreatedby": "6433a9f57992c87a61237f7c",
      "flduclzglupdatedat": "1687166915",
      "flduclzglupdatedby": "6433a9f57992c87a61237f7c",
      "flduclzglt0u": "hello"
    }
  }`;
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);
  const [age, setAge] = useState('');

  return (
    <div style={{display:'flex',justifyContent:'space-between'}}>
      <div className="container" style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}>
        <CodeBlock  method={'PATCH'} parent='updaterecord' code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`} where={value} header={`auth-key: AUTH_TOKEN,Content-Type: application/json `} body={arr} />
        <ResponseBox response={response} />
      </div>

<div style={{width:'55vw',overflowX:'hidden'}}>
      <div className="response-container"  >
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >To Update records in the</Typography>
        <Typography  fontSize={variables.textsize} >
        Please provide the fields for which you would like to update the data, and you can replace the existing values with their desired information.</Typography>
        <br />
        <Records db={props?.db} setArr={setArr} arr={arr} table={props?.table} alltabledata={props?.alltabledata}
        />
        <br />
        <OptionalParameter alltabledata={props?.alltabledata} parent={'updaterecord'} db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
      </div>
      </div>
    </div>
  )
}

UpdateRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  alltabledata:PropTypes.any,

}

export default UpdateRecord;
