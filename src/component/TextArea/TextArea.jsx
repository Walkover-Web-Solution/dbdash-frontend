import React, { useState } from "react";
import PropTypes from "prop-types";
import {  Button } from "@mui/material";
import CustomTextField from "../../muiStyles/customTextfield";

const TextArea = ({ onMessageSubmit, isLoading }) => {
  const [text, setText] = useState("");

  const handleInputChange = (event) => {
  setText(event.target.value);
  };
  
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (text.trim() !== "" && !isLoading) { // Disable form submission when isLoading is true
      onMessageSubmit(text);
      setText("");
    }
  };

  return (
    <div style={{ backgroundColor: "#dadada", padding: "16px" }}>
  <form onSubmit={handleSubmit}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      <CustomTextField
        multiline
        rows={2}
        placeholder="Ask Something..."
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          resize: "none",
          width: "70vw",
          marginRight: "16px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          padding: "8px",
        }}
      />
      <Button
        variant="contained"
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#888888" : "#0066ff",
          color: "#fff",
          cursor : isLoading ? "not-allowed" : "pointer"
        }}
      >
        Ask
      </Button>
    </div>
  </form>
</div>

  
  );
};

TextArea.propTypes = {
  onMessageSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default TextArea;
