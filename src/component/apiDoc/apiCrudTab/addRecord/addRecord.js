import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import Records from "../records/records";
import ResponseBox from "../responseBox";
import "./addRecord.scss"; // Import the CSS file
import variables from '../../../../assets/styling.scss';

function AddRecord(props) {
  const [arr, setArr] = useState([]);
const response=`
{
  "success": true,
  "message": "'tblzpf863'row created successfully",
  "data": {
    "fldzpf863rowid": "rowghnrkd",
    "fldzpf863autonumber": 11,
    "fldzpf863createdat": "2023-06-19T08:50:38.670Z",
    "fldzpf863createdby": "6433a9f57992c87a61237f7c",
    "fldzpf863updatedby": "chirag devlani",
    "fldzpf863sow": "it is a long long text"
  }
}`
  return (
    <>
      <div className="add-record-container" style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}>
        <CodeBlock
        parent='addrecord'
        method="POST"
          header={`auth-key: AUTH_TOKEN,Content-Type: application/json`}
          body={arr}
          db={props?.db}  
          table={props?.table}
        />
        <ResponseBox
          response={response}
        />
      </div>
      <div style={{width:'63vw',overflowX:"hidden"}}>
      
      <div className="records-container">
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Add Table Records</Typography>
        <Typography fontSize={variables.textsize}  sx={{wordWrap:'pre-wrap',width:variables.optionalparametercontentwidth,p:2}}>

        To create a new record, you need to make a POST request to the given endpoint.
Generate array of fields according to your use case. to make a single entry,  you have to use single array . 
</Typography>
<br/>
<Typography fontSize={variables.textsize}  sx={{wordWrap:'pre-wrap',width:variables.optionalparametercontentwidth,pl:2,pb:'4px'}}>

        Select/Deselect the checkboxes to make the request and add values in your table.
        <br/><br/>
        </Typography>

          <Box>
            

            <Records
              db={props?.db}
              setArr={setArr}
              arr={arr}
              table={props?.table}
        alltabledata={props?.alltabledata}

            />
          </Box>
      </div>
      </div>
    </>
  );
}

AddRecord.propTypes = {
  db: PropTypes.string,
  alltabledata:PropTypes.any,

  table: PropTypes.string,
};

export default AddRecord;
