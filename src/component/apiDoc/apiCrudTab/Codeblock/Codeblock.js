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

  const renderBody = () => {
    if (props.parent === "addrecord") {
      return (
        <pre className="pre-wrapper">
          <span>{"    \"records\""}</span>
          <span className="yellow">: </span>
          {" [\n"}
          {"       {\n"}
          {props.body.map((x, index) => (
            <span key={index}>
              <span contentEditable={true} className="cyan">{`"${x[0]}"`}</span>
              <span className="yellow">: </span>
              {x[1] === "number" || x[1] === "autonumber" ? (
                <span contentEditable={true} className="green">{`${dummy(x[1])}`}</span>
              ) : (
                <span contentEditable={true} className="magenta">{`"${dummy(x[1])}"`}</span>
              )}
              <span className="yellow">,</span>
              <br />
            </span>
          ))}
          {"       }\n"}
          {"    ]\n"}
        </pre>
      );
    }

    if (props.parent === "updaterecord") {
      return (
        <>
          <span>{"    \"records\""}</span>
          <span className="yellow">: </span>
          {" [\n       {\n"}
          <span>{`                   "where"`}</span>
          <span className="yellow">: </span>
          <span>{`"${props?.where}"`}</span>
          <span className="yellow">,</span>
          {"\n"}
          <span>{`                   "fields"`}</span>
          <span className="yellow">: </span>
          {"{\n"}
          {props.body.map((x, index) => (
            <span key={index}>
              <span contentEditable={true} className="cyan">{`"${x[0]}"`}</span>
              <span className="yellow">: </span>
              {x[1] === "number" || x[1] === "autonumber" ? (
                <span contentEditable={true} className="green">{`${dummy(x[1])}`}</span>
              ) : (
                <span contentEditable={true} className="magenta">{`"${dummy(x[1])}"`}</span>
              )}
              <span className="yellow">,</span>
              <br />
            </span>
          ))}
          {"         }\n"}
          {"       }\n"}
          {"     ]\n"}
        </>
      );
    }

    return (
      <>
        {props.body.map((x, index) => (
          <span key={index}>
            <span contentEditable={true} className="cyan">{`" ${x[0]} "`}</span>
            <span className="yellow">: </span>
            {x[1] === "number" || x[1] === "autonumber" ? (
              <span contentEditable={true} className="green">{` ${dummy(x[1])} `}</span>
            ) : (
              <span contentEditable={true} className="magenta">{`" ${dummy(x[1])} "`}</span>
            )}
            <span className="yellow">,</span>
            <br />
          </span>
        ))}
      </>
    );
  };

  const dummy = (type) => {
    switch (type) {
      case "number":
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
          <br />
          <code className="code">{props.code}</code>
          <br />
          <code className="yellow">{props.header?.split(",")?.map((head) => `-H ${head.trim()} \n`)}</code>
          <br />
          <br />
          <br />

          {props.body &&
            typeof props.body === "object" &&
            props.body.length > 0 && (
              <code className="white">
                {"-data{\n"}
                {renderBody()}
                {"   }"}
              </code>
            )}
        </pre>
      ) : (
        <pre className="pre-wrapper">
          <code className="code">
            {`curl -X ${props.method} '${props.code}' \\`}
            <br />
            <br />
          </code>
          <code className="yellow">{props.header?.split(",")?.map((head) => `-H '${head.trim()}' \\\n`)}</code>{" "}
          <br />

          {props.body &&
            typeof props.body === "object" &&
            props.body.length > 0 && (
              <code className="white">
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
};

export default CodeBlock;
