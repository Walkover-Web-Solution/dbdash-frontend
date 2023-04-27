import React,{useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Button } from "@mui/material";
import PropTypes from 'prop-types';
import './codeSnippet.css';
const CodeSnippet = ({ codeString }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex">
      <SyntaxHighlighter language="jsx" className="codeString"  >
        {codeString}
      </SyntaxHighlighter>
      <Button
      className="button"
        
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
