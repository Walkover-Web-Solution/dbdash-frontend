import React from "react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Button } from "@mui/material";
// import { FaCopy } from "react-icons/fa";
import PropTypes from 'prop-types';

const CodeSnippet = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative",backgroundColor: "black" }}>
      <SyntaxHighlighter language="jsx" style={githubGist}>
        {codeString}
      </SyntaxHighlighter>
      <Button
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          padding: "0.5rem",
          cursor: "pointer"
        }}
        onClick={copyToClipboard}
      >
        {isCopied ? "Copied!" : "copy"}
      </Button>
    </div>
  );
};

CodeSnippet.propTypes = {
  codeString: PropTypes.string.isRequired,
};

export default CodeSnippet;
