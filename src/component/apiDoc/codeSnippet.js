import React,{useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Button } from "@mui/material";
import PropTypes from 'prop-types';

const CodeSnippet = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{display:'flex'}}>
      <SyntaxHighlighter language="jsx" style={{textDecoration:'none',height:'200px', width: '1000px'}} >
        {codeString}
      </SyntaxHighlighter>
      <Button
        style={{
          marginRight: 'auto',
          borderRadius:0,
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
