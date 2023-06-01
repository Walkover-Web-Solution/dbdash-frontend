import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import Records from "../records/records";
import ResponseBox from "../responseBox";
import "./addRecord.css"; // Import the CSS file

function AddRecord(props) {
  const [arr, setArr] = useState([]);

  return (
    <>
      <div className="add-record-container">
        <CodeBlock
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
      <div className="records-container">
        <Typography className="add-record-title">Add Table Records</Typography>
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
    </>
  );
}

AddRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
};

export default AddRecord;
