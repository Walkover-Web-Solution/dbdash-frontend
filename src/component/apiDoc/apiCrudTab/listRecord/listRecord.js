import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './listRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';


function ListRecord(props) {
  const[value,setValue]=useState('');
  const[age,setAge]=useState('')
 const response=`
 {
  "success": true,
  "message": "'tbliu656v'rows retrieved successfully",
  "data": {
    "offset": null,
    "rows": [
      {
        "fldiu656vrlu": "7",
        "fldiu656vupdatedat": "1686986548"
      },
      {
        "fldiu656vrlu": "-1",
        "fldiu656vupdatedat": "1686987070"
      }
    ]
  }
}`;
  return (
    <>
    <div
      className="list-record-container"
      style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}
      >
     <CodeBlock method="GET"  db={props?.db} table={props?.table} code={`${value!="" ? `?${value}`:``}`} header={`auth-key: AUTH_TOKEN `}/>
     <ResponseBox response={response} />
     </div>
     <div style={{width:'63vw',overflowX:"hidden"}}>

     <div className='records-container'>
   
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >List/Get Records -</Typography>
        <Typography fontSize={variables.textsize}  sx={{wordWrap:'pre-wrap',width:'60vw ',p:2}}>

  {`To retrieve a list of records from the "${props?.alltabledata[props.table].tableName}" table, you can initiate a GET request to the "${props.table}" endpoint using the "${props.table}" IDs. Furthermore, you have the option to filter, sort, and format the results by utilizing the provided query parameters.`}

  <br />
  {`Additionally, you have the flexibility to filter, sort, and format the results by using the available query parameters.`}
  <br />
</Typography>
<OptionalParameter alltabledata={props?.alltabledata} parent="listrecord" db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />


        <br/>
   </div>
   
    </div>
    </>
  )
}
ListRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string,
  alltabledata:PropTypes.any
}
export default ListRecord