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

  return (
    <>
      <div className="add-record-container" style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}>
        <CodeBlock
        method="POST"
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}
          header={`-H auth-key: YOUR_SECRET_API_TOKEN ${(
            <br />
          )} -H Content-Type: application/json`}
          body={arr}
        />
        <ResponseBox
          response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`}
        />
      </div>
      <div style={{width:'700px',overflowX:"hidden"}}>
      
      <div className="records-container">
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Add Table Records</Typography>
        <br />
        <br />
        <Typography>
          <Box>
            <Records
              db={props?.db}
              setArr={setArr}
              arr={arr}
              table={props?.table}
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
  table: PropTypes.string,
};

export default AddRecord;
