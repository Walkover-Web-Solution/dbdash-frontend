import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@mui/material";

const TextArea = ({ onMessageSubmit }) => {
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

    if (text.trim() !== "") {
      onMessageSubmit(text);
      setText("");
    }
  };

  return (
    <div style={{backgroundColor : "#dadada"}}>
      <form onSubmit={handleSubmit}>
      <div style={{ display: "flex" , width : "100vw"  , alignItems : "center" ,justifyContent : "center" }}>
        <TextField
          multiline
          rows={2}
          placeholder="Ask Something..."
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ resize: "none" ,  width : "70vw"}}
        />
        <Button variant="outlined" type="submit" onClick={handleSubmit}>
          Ask
        </Button>
      </div>
    </form>
    </div>
  );
};

TextArea.propTypes = {
  onMessageSubmit: PropTypes.func.isRequired,
};

export default TextArea;
