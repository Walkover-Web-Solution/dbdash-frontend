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
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Update Records</Typography>
        <Typography  fontSize={variables.textsize} sx={{pl:2}}>
        To update a new record, you need to send a PATCH request to the provided endpoint. However, before doing that, you must determine the specific row you wish to update. You can retrieve the desired row using a WHERE condition which can be called using &ldquo;filter&ldquo; parameter.
        </Typography>
        <br/>
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}  sx={{pl:2}}>
        Where Condition :
 </Typography>
        
        <Typography  fontSize={variables.textsize}  sx={{pl:2}}>
        Filter conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying Filter conditions, you can refine the results based on specific field values or patterns.
 </Typography>
 <br />
 <Typography fontSize={variables.textsize}  sx={{pl:2}}>
  {'To implement a filter condition in the APIs, you can include the Filter parameter in your API request. The Filter parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as AND, OR, and NOT to combine multiple conditions. Additionally, comparison operators like =, >, <, and functions like FIND(), LEN(), and IS_BEFORE() can be used to specify precise criteria for filtering.'}
</Typography>
<br/>
 <Typography  fontSize={variables.textsize}  style={{ fontWeight: "bold" }}  sx={{pl:2}}>
Note: In the given example, it will search for all occurrences of JOHN in FieldID1 If multiple records are found with this filter, it will update all of them. Therefore we suggest using Filter for only unique fields.
</Typography>
        <br />
        <div style={{ width: '50vw', height: '15vh', backgroundColor: '#F0F0F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
  <Typography sx={{ justifyContent:'center',width:'100%',pl:2}}>
    curl -X PATCH &apos;https://dbdash-backend-h7duexlbuq-el.a.run.app/<br/><span style={{color: "#028a0f"}}>YOUR_DATABASE_ID</span>/<span style={{color: "#028a0f"}}>YOUR_TABLE_ID<br/>filter=FieldID1 != `John`</span>&apos;<br/>
  </Typography>
</div>
<br/>
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
