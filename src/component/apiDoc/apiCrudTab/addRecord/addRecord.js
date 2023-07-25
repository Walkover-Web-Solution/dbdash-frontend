import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import Records from "../records/records";
import ResponseBox from "../responseBox";
import "./addRecord.scss"; // Import the CSS file
import variables from "../../../../assets/styling.scss";

function AddRecord(props) {
  const [arr, setArr] = useState([]);
  const { db, table, alltabledata } = props.tablePannelListData;
  const response = `
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
}`;
  return (
    <>
      <div
        className="add-record-container"
        style={{ height: `${(window?.screen?.height * 61) / 100}px` }}
      >
        <CodeBlock
          parent="addrecord"
          method="POST"
          header={`auth-key: AUTH_TOKEN,Content-Type: application/json`}
          body={arr}
          db={db}
          table={table}
        />
        <ResponseBox response={response} />
      </div>
      <div className="leftsidepartofapidoctabs">
        <div className="records-container">
          <Typography
            variant={variables.megatitlevariant}
            fontSize={Number(variables.megatitlesize)}
          >
            Add Table Records
          </Typography>
          <Typography
            fontSize={variables.textsize}
            className="addrecordfirstpara"
          >
            To create a new record, you need to make a POST request to the given
            endpoint. Generate array of fields according to your use case. to
            make a single entry, you have to use single array .
          </Typography>
          <br />
          <Typography
            fontSize={variables.textsize}
            className="addrecordfirstpara paddingtopoftitle"
          >
            Select/Deselect the checkboxes to make the request and add values in
            your table.
            <br />
            <br />
          </Typography>

          <Box>
            <Records
              db={db}
              setArr={setArr}
              arr={arr}
              table={table}
              alltabledata={alltabledata}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

AddRecord.propTypes = {
  tablePannelListData: PropTypes.any,
};

export default AddRecord;
