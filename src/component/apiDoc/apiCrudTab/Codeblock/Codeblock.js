import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Codeblock.scss";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import variables from "../../../../assets/styling.scss";

function CodeBlock(props) {
  const [isCopied, setIsCopied] = useState(false);
  const [showAPI, setShowAPI] = useState(true);

  const handleCopyClick = () => {
    const codeElement = document.querySelector(".code-block pre");
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
const records=()=>{
  return(
    <>
    {"       {\n"}
    {props.body.map((x, index) => (
      <span key={index}>
        &quot;<span contentEditable={true} className="blue" >{x[0]}</span>&quot;
        <span >: </span>
        {x[1] === "numeric" || x[1] === "autonumber" ? (
          <span contentEditable={true} style={{color:'#013220 '}}>{`${dummy(x[1])}`}</span>
        ) : (
          <span contentEditable={true} style={{color:'#7a2048'}} >{`"${dummy(x[1])}"`}</span>
        )}
        <span >,</span>
        <br />
      </span>
    ))}
    {"       }\n"}
    </>
  )
}
  const renderBody = () => {
    if (props.parent === "addrecord") {
      return (
        <pre className="pre-wrapper">
          <span>{"    \"records\""}</span>
          <span >: </span>
          {" [\n"}
          {/* {"       {\n"} */}
          {records()}
          {`\n,\n`}
          {records()}

          {/* {"       }\n"} */}
          {"    ]\n"}
        </pre>
      );
    }

    if (props.parent === "updaterecord") {
      return (
        <div >
          <span>{"    \"records\""}</span>
          <span >: </span>
          {" [\n       {\n"}
          <span>{`                   "where"`}</span>
          <span >: </span>
         &quot; <span style={{color:'#ab4b52'}}>{`${props?.where}`}</span>&quot;
          <span >,</span>
          {"\n"}
          <span>{`                   "fields"`}</span>
          <span >: </span>
          {"{\n"}
          {props?.body?.map((x, index) => (
            <span key={index}>
              <span contentEditable={true} className="blue" >{`"${x[0]}"`}</span>
              <span >: </span>
              {x[1] === "numeric" || x[1] === "autonumber" ? (
                <span contentEditable={true} style={{color:'#013220 '}} >{`${dummy(x[1])}`}</span>
              ) : (
                <span contentEditable={true}  style={{color:'#7a2048'}} >{`"${dummy(x[1])}"`}</span>
              )}
              <span >,</span>
              <br />
            </span>
          ))}
          {"         }\n"}
          {"       }\n"}
          {"     ]\n"}
        </div>
      );
    }

    return (
      <>
        {props.body.map((x, index) => (
          <span key={index}>
            <span contentEditable={true} className="blue"  >{`" ${x[0]} "`}</span>
            <span >: </span>
            {x[1] === "numeric" || x[1] === "autonumber" ? (
              <span contentEditable={true} style={{color:'#013220 '}} >{` ${dummy(x[1])} `}</span>
            ) : (
              <span contentEditable={true}  style={{color:'#7a2048'}}>{`" ${dummy(x[1])} "`}</span>
            )}
            <span >,</span>
            <br />
          </span>
        ))}
      </>
    );
  };

  const dummy = (type) => {
    switch (type) {
      case "numeric":
        return 124553;
      case "rowid":
        return "row34";
      case "createdat":
        return new Date().toISOString();
      case "longtext":
        return "it is a long long text";
      case "autonumber":
        return 4564443;
      case "createdby":
        return "chirag devlani";
      case "checkbox":
        return true;
      case "updatedat":
        return new Date().toISOString();
      case "updatedby":
        return "chirag devlani";
      default:
        return "hello";
    }
  };

  const handleShowAPIClick = () => {
    setShowAPI(true);
  };

  const handleShowCURLClick = () => {
    setShowAPI(false);
  };

  return (
    <div className="code-block">
      <div className="codeblock-header">
        <button className="copy-button" onClick={handleCopyClick}>
          {isCopied ? (
            <span style={{ fontSize: variables.codeblockcopybuttonsize }}>
              Copied!
            </span>
          ) : (
            <ContentPasteIcon />
          )}
        </button>
      </div>

      <div className="button">
        <button
          onClick={handleShowAPIClick}
          className={showAPI ? "button-api" : "button-curl active"}
        >
          API
        </button>
        <button
          onClick={handleShowCURLClick}
          className={showAPI ? "button-curl active" : "button-api"}
        >
          CURL
        </button>
      </div>

      {showAPI ? (
        <pre className="pre-wrapper">
          <code className="code">https://dbdash-backend-h7duexlbuq-el.a.run.app/<span className={"valuescolor"}>{props?.db}</span>/<span className={"valuescolor"}>{props?.table}</span>{props?.code?props?.code:''}</code>
          <br />
          <br />

          <code>
  {props.header?.split(",")?.map((head) => (
    <React.Fragment key={head}>
      -H <span style={{ color: variables.deletecolor }}> {`${head.trim()}`}</span>
      
      <br />
    </React.Fragment>
  ))}
</code>
          <br />

          {((props.body &&
            typeof props.body === "object") || (props.where))  && 
           ( props.where || props.body.length > 0) && (
              <code >
            {"-data{\n"}
                {renderBody()}
                {"   }"}
           
              </code>
            )}
        </pre>
      ) : (
        <pre className="pre-wrapper">
          <code className="code">
            {`curl -X ${props.method} 'https://dbdash-backend-h7duexlbuq-el.a.run.app/`}
            <span className={"valuescolor"}>{props?.db}</span>/
            {<span className={"valuescolor"}>{`${props?.table}`}</span>}
            {props?.code?props?.code+"'":"'"} \
            <br />
            <br />
          </code>
          <code>
  {props.header?.split(",")?.map((head) => (
    <React.Fragment key={head}>
      -H <span style={{ color: variables.deletecolor }}> {`'${head.trim()}'`}</span> \
      
      <br />
    </React.Fragment>
  ))}
</code>

          
          {" "}
          <br />

          {props.body &&
            typeof props.body === "object" &&
            props.body.length > 0 && (
              <code >
              {" -d '{\n"}
                {renderBody()}
                {"   }' "}
              </code>
            )}
        </pre>
      )}
    </div>
  );
}

CodeBlock.propTypes = {
  code: PropTypes.any,
  header: PropTypes.any,
  method: PropTypes.any,
  body: PropTypes.any,
  parent: PropTypes.any,
  where: PropTypes.any,
  db:PropTypes.any,
  table:PropTypes.any
};

export default CodeBlock;
