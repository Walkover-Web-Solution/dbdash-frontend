import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import './Codeblock.css'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';


function CodeBlock(props) {
  const [isCopied, setIsCopied] = useState(false);
const[but,setbut]=useState(false);
  function handleCopyClick() {
    navigator.clipboard.writeText(props.code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <> 
   
      <div className="code-block">
      <div>
    <button className={!but ? "black":"white"} onClick={()=>setbut(false)} >API</button>
    <button className={!but ? "white":"black"} onClick={()=>setbut(true)} >Curl</button>
    </div>
      <pre>
        <br/>
        <br/>
        <code>
          {props.code}
        </code>
        <br/>
        <code style={{color:"yellow"}}>
            {props.header}
        </code>
        <br/>
        <code style={{color:"cadetblue"}}>
            {props.body}
        </code>
      </pre>
      <button className="copy-button" onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : <ContentPasteIcon/>}
      </button>
    </div>
    </>
 
  );
}

export default CodeBlock;

CodeBlock.propTypes={
    code:PropTypes.any,
    header:PropTypes.any,
    body:PropTypes.any
}