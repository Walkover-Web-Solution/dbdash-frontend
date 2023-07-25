import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import OptionalParameter from "../optionalParameter/optionalParameter";
import ResponseBox from "../responseBox";
import "./listRecord.scss"; // Import the CSS file
import variables from "../../../../assets/styling.scss";

function ListRecord(props) {
  const [value, setValue] = useState("");
  const [age, setAge] = useState("");
  const { db, table, alltabledata } = props.tablePannelListData;
  const response = `
 {
  "success": true,
  "message": "'tbliu656v'rows retrieved successfully",
  "data": {
    "offset": null,
    "rows": [
      {
        "fldiu656vrlu": "7",
        "fldiu656vupdatedat": "1686986548"
      },
      {
        "fldiu656vrlu": "-1",
        "fldiu656vupdatedat": "1686987070"
      }
    ]
  }
}`;
  return (
    <>
      <div
        className="list-record-container verticalscroll"
        style={{ height: `${(window?.screen?.height * 61) / 100}px` }}
      >
        <CodeBlock
          method="GET"
          db={db}
          table={table}
          code={`${value != "" ? `?${value}` : ``}`}
          header={`auth-key: AUTH_TOKEN `}
        />
        <ResponseBox response={response} />
      </div>
      <div className="leftsidepartofapidoctabs">
        <div className="records-container">
          <Typography
            variant={variables.megatitlevariant}
            fontSize={Number(variables.megatitlesize)}
          >
            List/Get Records -
          </Typography>
          <Typography
            fontSize={variables.textsize}
            className="listrecordfirstpara"
          >
            {`To retrieve a list of records from the "${alltabledata[table].tableName}" table, you can initiate a GET request to the "${table}" endpoint using the "${table}" IDs. Furthermore, you have the option to filter, sort, and format the results by utilizing the provided query parameters.`}

            <br />
            {`Additionally, you have the flexibility to filter, sort, and format the results by using the available query parameters.`}
            <br />
          </Typography>
          <OptionalParameter
            alltabledata={alltabledata}
            parent="listrecord"
            db={db}
            table={table}
            setValue={setValue}
            age={age}
            value={value}
            setAge={setAge}
          />

          <br />
        </div>
      </div>
    </>
  );
}
ListRecord.propTypes = {
  tablePannelListData: PropTypes.any,
};
export default ListRecord;
