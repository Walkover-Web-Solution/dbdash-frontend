import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodeBlock from "../Codeblock/Codeblock";
import React, { useState } from "react";
import OptionalParameter from "../optionalParameter/optionalParameter";
import ResponseBox from "../responseBox";
import "./deleteRecord.scss";
import variables from "../../../../assets/styling.scss";

function DeleteRecord(props) {
  const [age, setAge] = useState("");
  const [value, setValue] = useState("");
  const { db, table, alltabledata } = props.tablePannelListData;

  const response = `
{
  "success": true,
  "message": "'tbluclzgl'row delete successfully",
  "data": null
}`;
  return (
    <>
      <div
        className="delete-record-container"
        style={{ height: `${(window?.screen?.height * 61) / 100}px` }}
      >
        <CodeBlock
          method="PATCH"
          code={`/delete${value != "" ? `?${value}` : ``}`}
          db={db}
          table={table}
          header="auth-key: AUTH_TOKEN"
        />
        <ResponseBox response={response} />
      </div>

      <div className="leftsidepartofapidoctabs">
        <Box className="records-container">
          <Typography
            variant={variables.megatitlevariant}
            fontSize={Number(variables.megatitlesize)}
          >
            Delete Table Records
          </Typography>
          <Typography
            fontSize={variables.textsize}
            className="updaterecordfirstpara"
          >
            {`To delete a record, you need to send a PATCH request to the provided endpoint. However, before doing that, you must determine the specific row you wish to update. You can retrieve the desired row using a WHERE condition which can be called using "filter" parameter.
        `}
          </Typography>
          <Box>
            <OptionalParameter
              alltabledata={alltabledata}
              parent={"delete"}
              db={db}
              table={table}
              setValue={setValue}
              age={age}
              value={value}
              setAge={setAge}
            />
          </Box>
        </Box>
      </div>
    </>
  );
}

DeleteRecord.propTypes = {
  tablePannelListData: PropTypes.any,
};

export default DeleteRecord;
