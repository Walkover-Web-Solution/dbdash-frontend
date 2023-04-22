import React, { memo } from "react";
import { grey } from "./colors";
import PropTypes from "prop-types";

const Relationship = ({ value, backgroundColor }) => (
  <span
    style={{
      boxSizing: "border-box",
      backgroundColor: backgroundColor,
      color: grey(800),
      fontWeight: 400,
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize",
      display: "inline-block",
    }}
  >
    {value}
  </span>
);

Relationship.propTypes = {
  value: PropTypes.any,
  backgroundColor: PropTypes.any,
};
export default memo(Relationship);
