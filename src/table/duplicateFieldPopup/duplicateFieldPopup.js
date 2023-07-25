import React from "react";
import PropTypes from "prop-types";
import "./duplicateFieldPopup.scss";

export default function DuplicateFieldPopup(props) {
  const handleDuplicateField = () => {
    props?.handleDuplicate();
    props.handleClose();
  };

  const containerStyle = {
    display: props.open ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: props.open ? "blur(8px)" : "none", // Apply blur effect when open
    zIndex: 9999, // Ensure the popup is on top of other elements
  };

  return (
    <div className="duplicatefield-container" style={containerStyle}>
      <div className="duplicatefield-div2">
        <h3>Duplicate Field</h3>
        <div>
          <label htmlFor="duplicateCells">Duplicate Cells:</label>
          <input
            id="duplicateCells"
            type="checkbox"
            checked={props?.duplicateField}
            onChange={props?.handleUniqueChange}
          />
        </div>
        <div className="duplicatefield-button-box">
          <button onClick={props?.handleClose}>Cancel</button>
          <button onClick={handleDuplicateField}>Duplicate Field</button>
        </div>
      </div>
    </div>
  );
}

DuplicateFieldPopup.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDuplicate: PropTypes.func,
  isUnique: PropTypes.bool,
  handleUniqueChange: PropTypes.func,
  duplicateField: PropTypes.any,
};
