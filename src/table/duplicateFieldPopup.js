import React from "react";
import PropTypes from "prop-types";

export default function DuplicateFieldPopup(props) {
  const handleDuplicateField = () => {
    props?.handleDuplicate();
    props.handleClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "0px",
          width: "400px",
        }}
      >
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
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <button onClick={props?.handleClose}>Cancel</button>
          <button onClick={handleDuplicateField
         }>Duplicate Field</button>
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
