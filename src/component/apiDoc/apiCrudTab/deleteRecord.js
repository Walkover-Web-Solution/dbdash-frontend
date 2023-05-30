import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "./Codeblock";
import React, { useState } from "react";
import Records from "./records";
import OptionalParameter from "./optionalParameter";
import ResponseBox from "./responseBox";


function DeleteRecord(props) {
  const [age, setAge] = useState('')
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          width: "36vw",
          padding: "10px",
          height: "65vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
        <CodeBlock
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}${value != "" ? `?${value}` : ``}`}
          header={`-H auth-key: AUTH_TOKEN `}
          body={arr}


        />  <ResponseBox response={`{
          "employee": {
          "name": "sonoo",
          "salary": 56000,
          "married": true.
          }
          }`} />
      </div>


      <div style={{ width: '700px', height: "65vh", overflowY: "scroll", whiteSpace: "pre-wrap", padding: "2px" }}>

        <Box>
          <Typography style={{ fontWeight: "bold", fontSize: "24px" }}>
            Delete Table Records
          </Typography>
          <Typography>
            <Box>

              <br />

              <Records db={props.db} table={props.table} setArr={setArr} arr={arr} />
              <br />
              <OptionalParameter  db={props.db} table={props.table}  setValue={setValue} age={age} value={value} setAge={setAge} />

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
