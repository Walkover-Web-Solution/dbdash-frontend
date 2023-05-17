import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import './Codeblock.css'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function CodeBlock(props) {
  //  console.log("hello",props.body);
  const [isCopied, setIsCopied] = useState(false);
  const [showAPI, setShowAPI] = useState(true)
  function handleCopyClick() {
    navigator.clipboard.writeText(props.code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (


    <div className="code-block" >
      <button style={{ marginLeft: "450px" }} className="copy-button" onClick={(handleCopyClick)}>
        {isCopied ? 'Copied!' : <ContentPasteIcon />}
      </button>
      <div style={{ position: "relative", bottom: 65 }} >
        <button onClick={() => { setShowAPI(true) }} style={showAPI ? { backgroundColor: "black", color: "white", margin: "2px", fontSize: "15px" } : { margin: "2px", backgroundColor: "white", color: "black", fontSize: "15px" }}>API</button>
        <button onClick={() => { setShowAPI(false) }} style={showAPI ? { backgroundColor: "white", color: "black", margin: "2px", fontSize: "15px" } : { margin: "2px", backgroundColor: "black", color: "white", fontSize: "15px" }}>CURL</button>
      </div>
      <pre style={{ position: "relative", width: "400px", whiteSpace: "pre-wrap", overflowY: "scroll" }}>
        <br />
        <code style={{ whiteSpace: "pre-wrap", maxWidth: "400px", wordWrap: "break-word" }}>
          {props.code}
        </code>
        <br />
        <br />
        <code style={{ color: "yellow" }}>
          {props.header}
        </code>
        <br />
        <br />
        <br />
        {props.body && typeof props.body === "object" && props.body.length > 0 && (
          <code style={{ color: "white" }}>
            {"-data{\n"}
            {props.body.map((x, index) => (
              <span style={{ margin: "1px" }} key={index}>{`"${x}":"`}
                <input type="text" style={{ backgroundColor: "black", color: "white", border: "none", width: "fit-content" }} />
                {`",\n`}</span>
            ))}
            {"}"}
          </code>
        )}
      </pre>

    </div>
  );
}

export default CodeBlock;

CodeBlock.propTypes = {
  code: PropTypes.any,
  header: PropTypes.any,
  body: PropTypes.any,

}