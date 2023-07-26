import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import variables from "../../../../../assets/styling.scss";
import CustomAutoSuggest from "../../../../customAutoSuggest/customAutoSuggest";
import PropTypes from "prop-types";
import { getAllTableInfo } from "../../../../../store/allTable/allTableSelector";
import { filterQueryByAi } from "../../../../../api/filterApi";
import CircularProgress from "@mui/material/CircularProgress";
import "./Aifilter.scss";
import { customUseSelector } from "../../../../../store/customUseSelector";
export default function AiFilter({
  tableName,
  handleUse,
  querymade,
  setQuerymade,
  textfieldref,
  changeQueryMade,
  parent,
  dbId,
}) {
  const [text, setText] = useState("");
  const editableDivRef = useRef();
  const textFieldRef = useRef(null);
  const [showAnsfield, setShowAnsfield] = useState(true);
  const [textAfterWhere, setTextAfterWhere] = useState();
  const [fields, setFields] = useState([]);
  const AllTableInfo = customUseSelector((state) => getAllTableInfo(state));

  const handleTextChange = (text) => {
    setText(text.trim());
  };

  useEffect(() => {
    tableData();
  }, [tableName]);

  const tableData = async () => {
    const myObj = AllTableInfo?.tables?.[tableName]?.fields;
    const arr = Object.entries(myObj).map(([key, value]) => ({
      name: value.fieldName,
      content: key,
    }));
    setFields(arr);
  };

  const customAutosuggestfunction = (fields) => {
    return (
      <CustomAutoSuggest
        id="customautosuggest"
        getInputValueWithContext={handleTextChange}
        editableDivRef={editableDivRef}
        suggestion={fields}
        setText={setText}
        defaultValue=""
        symbolForSearching={" "}
        groupByGroupName={false}
        ref={textFieldRef}
      />
    );
  };

  const handleQuery = async () => {
    setShowAnsfield(false);
    let textquery = text.trim();
    const data = {
      query: textquery,
    };

    const applyFilter = await filterQueryByAi(dbId, data);

    if (parent !== "updaterecord") {
      setTextAfterWhere("filter=" + applyFilter?.data?.data);
      setQuerymade("filter=" + applyFilter?.data?.data);
    } else {
      setTextAfterWhere(applyFilter?.data?.data);
      setQuerymade(applyFilter?.data?.data);
    }
    setShowAnsfield(true);
  };

  return (
    <div className="aiFilterStyle">
      <div
        style={{ backgroundColor: variables.codeblockbgcolor, padding: "10px" }}
      >
        Filter
      </div>
      <div className="contentStyle">
        <div className="buttonContainerStyle">
          <Box className={`ai-divv ${text === "" ? "row" : "column"}`}>
            <div className={text === "" ? "div76" : "div98"}>
              {customAutosuggestfunction(fields)}
            </div>
            <div
              className={`ai-Autosugg-Function ${
                text === "" ? "div24" : "div100"
              }`}
            >
              <Button
                variant="outlined"
                className="mui-button-outlined generatebutton"
                sx={{ width: text === "" ? "90%" : "30%" }}
                onClick={handleQuery}
              >
                Generate Query by AI
              </Button>
            </div>
          </Box>
        </div>
        <br />
        {showAnsfield ? (
          <textarea
            ref={textfieldref}
            value={querymade || textAfterWhere}
            id={"querytextarea"}
            onChange={(e) => {
              changeQueryMade(e);
              setTextAfterWhere(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleUse();
              }
            }}
            className="ansfield"
          />
        ) : (
          <div className="ai-div">
            <CircularProgress />
          </div>
        )}
        <Box className="ai-box">
          {showAnsfield && (
            <Button
              className="mui-button"
              onClick={handleUse}
              variant="contained"
            >
              Use
            </Button>
          )}
        </Box>
      </div>
    </div>
  );
}

AiFilter.propTypes = {
  tableName: PropTypes.any,
  handleUse: PropTypes.any,
  querymade: PropTypes.any,
  setQuerymade: PropTypes.any,
  textfieldref: PropTypes.any,
  changeQueryMade: PropTypes.any,
  parent: PropTypes.any,
  dbId: PropTypes.any,
};
