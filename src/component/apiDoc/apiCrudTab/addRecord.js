import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "./Codeblock";


import Records from "./records";
import ResponseBox from "./responseBox";

function AddRecord(props) {
  const [arr, setArr] = useState([]);

  return (
    <>
      <div
    
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
       
          right: 0,
          width: "36vw",
          padding: "10px",
         
          height: "65vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
        <CodeBlock
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table[0]}`}
          header={`-H auth-key: YOUR_SECRET_API_TOKEN ${(
            <br />
          )} -H Content-Type: application/json`}
          body={arr}
        />
        <ResponseBox response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`} />
      </div>
      <div
        style={{
          width: "700px",
          height: "65vh",
          overflowY: "scroll",
      
          whiteSpace: "pre-wrap",
          padding: "2px",
        }}
      >
        <Typography style={{ fontWeight: "bold", fontSize: "24px" }}>
          Add Table Records
        </Typography>
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
  table: PropTypes.any,
};
export default AddRecord;
