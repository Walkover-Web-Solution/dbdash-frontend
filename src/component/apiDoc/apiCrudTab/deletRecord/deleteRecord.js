import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { FormControl, Typography } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import React, { useState } from 'react';
// import Records from '../records/records';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './deleteRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';

function DeleteRecord(props) {
  const [age, setAge] = useState('');
  const [value, setValue] = useState('');
// console.log(props,"props?.table")
  
const response=`
{
  "success": true,
  "message": "'tbluclzgl'row delete successfully",
  "data": null
}`;
  return (
    <>
      <div className="delete-record-container" style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}>
        <CodeBlock
        method="PATCH"
        
          code={`/delete${value!="" ? `?${value}`:``}`}
          db={props?.db}
          table={props?.table}
          header="auth-key: AUTH_TOKEN"
          
        />
        <ResponseBox response={response} />
      </div>

      <div style={{width:'55vw',overflowX:"hidden"}}>
        <Box className="records-container">
          <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Delete Records</Typography>
        <Typography fontSize={variables.textsize}>
        {`To delete a record, you need to send a PATCH request to the provided endpoint. However, before doing that, you must determine the specific row you wish to update. You can retrieve the desired row using a WHERE condition which can be called using "filter" parameter.
        `} 
        </Typography>
         <Typography>
            <Box>
              {/* <br />
              <Records db={props?.db} table={props?.table} setArr={setArr} arr={arr} /> */}
             
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              {/* <input
                id="demo-simple-select-helper"
                style={{ height: '50px', width: '100px',borderRadius:0 ,paddingLeft:'10px '}}
                type="number"
               onKeyPress={handlekeypress}
               onChange={(e)=>{
                if(e.target.value<=0)
                {
                  e.preventDefault();
                  e.target.value='';
                }
               }}
                placeholder="Type"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.target.value;
                    e.target.value='';
                    if (!isNaN(value) && !rows.includes(value)) {
                       // Check if the value is a valid number
                      setRows([...rows, value]);
              
                    }
                  }
                }}
              /> */}
            </FormControl>
              
            <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Where Condition :
 </Typography>
 <Typography fontSize={variables.textsize}>
  {"'filter' conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying 'filter' conditions, you can refine the results based on specific field values or patterns. "}
  {"To implement a filter condition in the APIs, you can include the 'filter' parameter in your API request. The 'filter' parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as 'AND,' 'OR,' and 'NOT' to combine multiple conditions. Additionally, comparison operators like '=', '>', '<,' and functions like 'FIND()', 'LEN()', and 'IS_BEFORE()' can be used to specify precise criteria for filtering."}
</Typography>

 <br />
 <Typography fontSize={variables.textsize}>
  {'To implement a filter condition in the APIs, you can include the Filter parameter in your API request. The Filter parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as AND, OR, and NOT to combine multiple conditions. Additionally, comparison operators like =, >, <, and functions like FIND(), LEN(), and IS_BEFORE() can be used to specify precise criteria for filtering.'}
</Typography>
<br/>
 <Typography  fontSize={variables.textsize}  sx={{wordWrap:'pre-wrap',width:'50vw ',pl:2}}>
 Note: In the given example, it will search for all occurrences of &quot;John&quot; in FieldID1. If multiple records are found with this filter, it will delete all rows. Therefore we suggest using &quot;filter&quot; for only unique fields.
</Typography>
        <br />
        <div style={{ width: '50vw', height: '15vh', backgroundColor: '#F0F0F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography sx={{ justifyContent:'center',width:'100%',pl:2}}>
    curl -X PATCH &apos;https://dbdash-backend-h7duexlbuq-el.a.run.app/<br/><span style={{color: "#028a0f"}}>YOUR_DATABASE_ID</span>/<span style={{color: "#028a0f"}}>YOUR_TABLE_ID<br/>filter=FieldID1 != `John`</span>&apos;<br/>
  </Typography>
</div>

              <OptionalParameter   alltabledata={props?.alltabledata}  parent={'delete'} db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
            </Box>
          </Typography>
        </Box>
      </div>
    </>
  );
}

DeleteRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  alltabledata:PropTypes.any
};

export default DeleteRecord;
