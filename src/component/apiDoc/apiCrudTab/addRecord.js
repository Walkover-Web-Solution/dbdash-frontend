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
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          width: "44vw",
          padding: "10px",
          height: "65vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
        <CodeBlock
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}
          header={`-H auth-key: YOUR_SECRET_API_TOKEN ${(
            <br />
          )} -H Content-Type: application/json`}
          body={arr}
        />
        <ResponseBox response={`lorem1000`} />
      </div>
      <div style={{width:'700px',height:"65vh",overflowY:"scroll",backgroundColor:"white",whiteSpace:"pre-wrap",padding:"2px"}}>
    
      <Typography style={{ fontWeight: "bold", fontSize: "24px" }}>
        Add Table Records
      </Typography>

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
