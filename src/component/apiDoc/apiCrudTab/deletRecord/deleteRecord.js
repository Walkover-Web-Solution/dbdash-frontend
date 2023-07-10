import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { FormControl, Typography ,Link} from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import React, { useState } from 'react';
// import Records from '../records/records';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './deleteRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
import FilterConditionTable from '../filterConditionTable';
import AiFilter from '../aiFilter';

function DeleteRecord(props) {
  const [age, setAge] = useState('');
  const [value, setValue] = useState('');
  
  
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
        
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props?.db}/${props?.table}/delete${value!="" ? `?${value}`:``}`}
          header="auth-key: AUTH_TOKEN"
          
        />
        <ResponseBox response={response} />
      </div>

      <div style={{width:'700px',overflowX:"hidden"}}>
        <Box className="records-container">
          <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Delete Records</Typography>
        <Typography fontSize={variables.textsize}>
        To delete a record, you need to send a PATCH request to the provided endpoint. However, before doing that, you must determine the specific row you wish to update. You can retrieve the desired row using a WHERE condition which can be called using Filter parameter.
          </Typography>
          <Typography>
          <br />
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Where Condition :
 </Typography>
        
        <Typography  fontSize={variables.textsize} >
        Filter conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying Filter conditions, you can refine the results based on specific field values or patterns.

To implement a filter condition in the APIs, you can include the Filter parameter in your API request. The Filter parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions: You can utilize logical operators such as AND ,OR, and NOT to combine multiple conditions. Additionally, comparison operators like =&gt; and functions like FIND,LEN, and IS_BEFORE can be used to specify precise criteria for filtering

 </Typography>
 <br />
 <Typography  fontSize={variables.textsize}  style={{ fontWeight: "bold" }}>
 Note: In the given example, it will search for all occurrences of John in FieldID1.If multiple records are found with this filter, it will delete all rows. Therefore wesuggest using Filter for only unique fields.
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
            <Box>
              {/* <br />
              <Records db={props?.db} table={props?.table} setArr={setArr} arr={arr} /> */}
              <br />
             
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
              


              <OptionalParameter  parent={'delete'} db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
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
};

export default DeleteRecord;
