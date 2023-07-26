import React from "react";
import "../apiCrudTab/Codeblock/Codeblock";
import { PropTypes } from "prop-types";
import variables from "../../../assets/styling.scss";
function ResponseBox(props) {
  return (
    <div className="response-box">
      <div
        className="response-header"
        style={{ fontSize: variables.codeblockcopybuttonsize }}
      >
        {" "}
        dummy response
      </div>
      <div className="response-body">{props?.response}</div>
    </div>
  );
}
ResponseBox.propTypes = {
  response: PropTypes.any,
};
export default ResponseBox;
