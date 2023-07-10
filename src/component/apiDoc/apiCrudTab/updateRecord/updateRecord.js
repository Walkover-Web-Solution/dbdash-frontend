import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import OptionalParameter from '../optionalParameter/optionalParameter';
import {Typography,Link} from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import Records from '../records/records';
import ResponseBox from '../responseBox';
import './updateRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
import FilterConditionTable from '../filterConditionTable';
import AiFilter from '../aiFilter';

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
    <>
      <div className="container" style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll",paddingRight:""}}>
        <CodeBlock  method={'PATCH'} parent='updaterecord' code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`} where={value} header={`auth-key: AUTH_TOKEN,Content-Type: application/json `} body={arr} />
        <ResponseBox response={response} />
      </div>

      <div className="response-container"  style={{width:'700px',overflowX:"hidden"}}>
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Update records</Typography>
        <Typography  fontSize={variables.textsize} >
        To update a new record, you need to send a PATCH request to the provided endpoint. However, before doing that, you must determine the specific row you wish to update. You can retrieve the desired row using a WHERE condition which can be called using Filter parameter.
</Typography>
        <br />
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Where Condition :
 </Typography>
        
        <Typography  fontSize={variables.textsize} >
        Filter conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying Filter conditions, you can refine the results based on specific field values or patterns.
 </Typography>
 <br />
 {/* <Typography fontSize={variables.textsize}>
  To implement a filter condition in the APIs, you can include the Filter parameter in your API request. The Filter parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as AND, OR, and NOT to combine multiple conditions. Additionally, comparison operators like =, >, <, and functions like FIND(), LEN(), and IS_BEFORE() can be used to specify precise criteria for filtering.
</Typography> */}
<Typography  fontSize={variables.textsize}  style={{ fontWeight: "bold" }}>
Note: In the given example, it will search for all occurrences of JOHN in FieldID1 If multiple records are found with this filter, it will update all of them. Therefore we suggest using Filter for only unique fields.
</Typography>
 <br />

 <Typography  sx={{backgroundColor:"#E6E6E6"}} >
 PATCH <span style={{textDecoration: "underline"}}>https://dbdash-backend-h7duexlbuq-el.a.run.app/Your_DataBase_ID/Your_Table_ID ?filter=FieldID1!=John</span>
 </Typography>
 <br />
 <br/>
 <Typography style={{fontSize:15 ,p:5}}>
  Select Column name and click on the CheckBox to generate API on the right side
 </Typography>

 <FilterConditionTable/>
 <Link href="#" style={{ fontSize: `${variables.linksizeoptionalparameter}px` }}>
          More....
        </Link>
 <br />
 <br />
 <br />
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Still need help?Ask AI to generate your Filter condition
 </Typography>
 <br />
 <AiFilter/>
 <br />
 <br />
 <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
 Fields to be updated:
 </Typography>
 <Typography  fontSize={variables.textsize} >
 Please select the fields/columns that need to be updated.

Note: If you provide NULL (FleldID1: NULL) or leave It blank (FieldID1: ), the API will update the field with null or blank values. Therefore, please ensure that you only use the field names that you want to update.</Typography>
        <br />
    <Records db={props?.db} setArr={setArr} arr={arr} table={props?.table} alltabledata={props?.alltabledata}
        />
        <br />
        <OptionalParameter alltabledata={props?.alltabledata} parent={'updaterecord'} db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
      </div>
    </>
  )
}

UpdateRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  alltabledata:PropTypes.any,

}

export default UpdateRecord;
