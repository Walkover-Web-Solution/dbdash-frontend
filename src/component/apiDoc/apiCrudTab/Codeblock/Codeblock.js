import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import './Codeblock.scss'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function CodeBlock(props) {
  
  const [isCopied, setIsCopied] = useState(false);
  const [showAPI, setShowAPI] = useState(true)
  function handleCopyClick() {
    navigator.clipboard.writeText(props.code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }
const dummy=(type)=>{
  switch(type){
    case "number":
      return 123;
      case "rowid":
        return "row34";
        case "createdat":
          return new Date().toISOString();
          case "longtext":
            return "it is a long long text";
            case "autonumber":
              return 4563;
              case "createdby":
                 return "chirag devlani";
                 case "checkbox":
                  return true;
            default :
            return "hello";
  }
}
  return (


    <div className="code-block" >
      <div className="codeblock-header">     <button className="copy-button" onClick={(handleCopyClick)}>
        {isCopied ? <span style={{fontSize:"20px"}}>Copied!</span> : <ContentPasteIcon />}
      </button>
      </div>
 
      <div style={{ position: "relative", bottom: 65 }} >
        <button onClick={() => { setShowAPI(true) }} style={showAPI ? { backgroundColor: "black", color: "white",  fontSize: "15px" } : {  backgroundColor: "white", color: "black", fontSize: "15px" }}>API</button>
        <button onClick={() => { setShowAPI(false) }} style={showAPI ? { backgroundColor: "white", color: "black", fontSize: "15px" } : {  backgroundColor: "black", color: "white", fontSize: "15px" }}>CURL</button>
      </div>
      <pre style={{ position: "relative", width: "400px", whiteSpace: "pre-wrap" }}>
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
           <span key={index}>
             <span style={{ color: "cyan", margin: "1px" }}>{`"${x[0]}"`}</span>
             <span style={{ color: "yellow", margin: "1px" }}>:</span>
             {x[1] === "number" || x[1] === "autonumber" ? (
               <span style={{ color: "green", margin: "1px" }}>{`${dummy(x[1])}`}</span>
             ) : (
               <span style={{ color: "magenta", margin: "1px" }}>{`"${dummy(x[1])}"`}</span>
             )}
             <span style={{ color: "yellow", margin: "1px" }}>,</span>
             <br />
           </span>
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