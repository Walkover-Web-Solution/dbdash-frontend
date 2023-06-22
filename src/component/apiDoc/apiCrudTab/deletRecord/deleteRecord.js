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
          <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Delete Table Records</Typography>
        <Typography fontSize={variables.textsize}>
          In order to expunge records from the table, kindly furnish the conditions pertaining to the respective rows.
          </Typography>
          <Typography>
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
              


              <OptionalParameter  db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
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
