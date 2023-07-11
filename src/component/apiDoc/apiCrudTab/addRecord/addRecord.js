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
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}
          header={`auth-key: AUTH_TOKEN,Content-Type: application/json`}
          body={arr}
        />
        <ResponseBox
          response={response}
        />
      </div>
      <div style={{width:'55vw',overflowX:"hidden"}}>
      
      <div className="records-container">
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Add Table Records</Typography>
        <Typography  fontSize={variables.textsize} >
        Please provide the fields you would like to fill with data, and you can replace the dummy values with your desired information.
</Typography>
<br/>

        <Typography>
       

          <Box>
            

            <Records
              db={props?.db}
              setArr={setArr}
              arr={arr}
              table={props?.table}
        alltabledata={props?.alltabledata}

            />
          </Box>
        </Typography>
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
