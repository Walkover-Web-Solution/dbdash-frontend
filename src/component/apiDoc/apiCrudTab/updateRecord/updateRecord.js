import React, { useState } from "react";
import { PropTypes } from "prop-types";
import OptionalParameter from "../optionalParameter/optionalParameter";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import Records from "../records/records";
import ResponseBox from "../responseBox";
import "./updateRecord.scss"; // Import the CSS file
import variables from "../../../../assets/styling.scss";

function UpdateRecord(props) {
  const response = `
  {
    "success": true,
    "message": "'tbluclzgl'row updated successfully",
    "data": {
      "flduclzglrowid": "rowgivdqa",
      "flduclzglautonumber": 3,
      "flduclzglcreatedat": "2023-06-19T09:16:21.066Z",
      "flduclzglcreatedby": "6433a9f57992c87a61237f7c",
      "flduclzglupdatedat": "1687166915",
      "flduclzglupdatedby": "6433a9f57992c87a61237f7c",
      "flduclzglt0u": "hello"
    }
  }`;
  const [value, setValue] = useState("");
  const [arr, setArr] = useState([]);
  const [age, setAge] = useState("");
  const { db, table, alltabledata } = props.tablePannelListData;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        className="updatecontainer"
        style={{ height: `${(window?.screen?.height * 61) / 100}px` }}
      >
        <CodeBlock
          method={"PATCH"}
          parent="updaterecord"
          db={db}
          table={table}
          where={value}
          header={`auth-key: AUTH_TOKEN,Content-Type: application/json `}
          body={arr}
        />
        <ResponseBox response={response} />
      </div>

      <div className="leftsidepartofapidoctabs">
        <div className="response-container">
          <Typography
            variant={variables.megatitlevariant}
            fontSize={Number(variables.megatitlesize)}
          >
            Update Records
          </Typography>
          <Typography
            fontSize={variables.textsize}
            sx={{
              width: variables.optionalparametercontentwidth,
              wordWrap: "pre-wrap",
              p: 2,
            }}
          >
            To update a new record, you need to send a PATCH request to the
            provided endpoint. However, before doing that, you must determine
            the specific row you wish to update. You can retrieve the desired
            row using a WHERE condition which can be called using
            &ldquo;filter&ldquo; parameter.
          </Typography>
          <br />

          <br />
          <OptionalParameter
            alltabledata={alltabledata}
            parent={"updaterecord"}
            db={db}
            table={table}
            setValue={setValue}
            age={age}
            value={value}
            setAge={setAge}
          />
          <br />
          <Typography
            fontWeight={variables.titleweight}
            fontSize={Number(variables.textsize)}
            variant={variables.titlevariant}
            className="paddingtopoftitle"
          >
            Fields to update
          </Typography>
          <Typography
            fontSize={variables.textsize}
            className="updaterecordfirstpara"
          >
            {`Please select the fields/columns that need to be updated.
Note: If you provide "NULL" ("FieldID1": "NULL") or leave it blank ("FieldID1": ""), the API will update the field with null or blank values. Therefore, please ensure that you only use the field names that you want to update.`}{" "}
          </Typography>
          <br />
          <Records
            db={db}
            setArr={setArr}
            arr={arr}
            table={table}
            alltabledata={alltabledata}
          />
        </div>
      </div>
    </div>
  );
}

UpdateRecord.propTypes = {
  tablePannelListData: PropTypes.any,
};

export default UpdateRecord;
