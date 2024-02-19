import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import "./Codeblock.scss";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

import variables from "../../../../assets/styling.scss";

function CodeBlock(props) {
  const [isCopied, setIsCopied] = useState(false);
  const [showAPI, setShowAPI] = useState(true);
  const style = {marginLeft : 30};
  
  const handleCopyClick = () => {
    const codeElement = document.querySelector(".pre-wrapper");
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent.replace("...",""));
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  const records = () => {
    return (
      <span>
        {"{\n"}
        {props.body.map((x, index) => (
          <span key={index}>
            &nbsp;&nbsp;&nbsp;&nbsp;&quot;
            <span contentEditable={true} className="blue">
              {x[0]}
            </span>
            &quot;:
            {x[1] === "numeric" || x[1] === "autonumber" ? (
              <span contentEditable={true} className="numbercolor">{`${dummy(
                x[1]
              )}`}</span>
            ) : (
              <span contentEditable={true} className="stringcolor">{`"${dummy(
                x[1]
              )}"`}</span>
            )}
            {index == props.body.length-1 ? "" : ","}<br />
          </span>
        ))}
        {"}"}
      </span>
    );
  };

  const renderBody = () => {
    if (props.parent === "addrecord") {
      return (
        <pre className="pre-wrapper">
          <span>{'"records"'}</span>
          <span>: </span>
          {" [\n"}
          <div style={style}>{records()},</div>
          {"\n"}
          <div style = {style}>{records()}</div>
          {"       ...\n"}
          {" ]\n"}
        </pre>
      );
    }

    if (props.parent === "updaterecord") {
      return (
        <div>
          <span>{'    "records"'}</span>
          <span>: </span>
          {" [\n       {\n"}
          <span>{`          "where"`}</span>
          <span>: </span>
          <span style={{ color: "#ab4b52" }}>
            &quot;{`${props?.where}`}&quot;
          </span>
          <span>,</span>
          {"\n"}
          <span>{`          "fields"`}</span>
          <span>: </span>
          {"{\n"}
          <div style={{marginLeft:"80px"}}>
            {props?.body?.map((x, index) => (
            <span key={index}>
              <span contentEditable={true} className="blue">
                {'"' + x[0] + '"'}
              </span>
              <span>: </span>
              {x[1] === "numeric" || x[1] === "autonumber" ? (
                <span contentEditable={true} className="numbercolor">{`${dummy(
                  x[1]
                )}`}</span>
              ) : (
                <span contentEditable={true} className="stringcolor">
                  {'"' + dummy(x[1]) + '"'}
                </span>
              )}
              <span>{index === props.body.length -1 ? "" : ","}</span>
              <br />
            </span>
          ))}
          </div>  
          {"           }\n"}
          {"        }\n"}
          {"     ]\n"}
        </div>
      );
    }

    return (
      <>
        {props.body.map((x, index) => (
          <span key={index}>
            <span contentEditable={true} className="blue">
              {'"' + x[0] + '"'}
            </span>
            <span>: </span>
            {x[1] === "numeric" || x[1] === "autonumber" ? (
              <span contentEditable={true} className="numbercolor">{`${dummy(
                x[1]
              )}`}</span>
            ) : (
              <span contentEditable={true} className="stringcolor">
                {'"' + dummy(x[1]) + '"'}
              </span>
            )}
            <span>,</span>
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
            <ContentCopyOutlinedIcon />
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
        <div className="pre-wrapper">
          <code className="code">
            {`https://dbdash-backend-h7duexlbuq-el.a.run.app/`}
            <span className={"valuescolor"}>{props?.db}</span>/
            <span className={"valuescolor"}>{props?.table}</span>
            {props?.code ? props?.code : ""}
          </code>
          <br />
          <br />

          <code>
            {props.header?.split(",")?.map((head) => (
              <React.Fragment key={head}>
                -H <span className="errorcolor"> {`${head.trim()}`}</span>
                <br />
              </React.Fragment>
            ))}
          </code>
          <br />

          {((props.body && typeof props.body === "object") || props.where) &&
            (props.where || props.body.length > 0) && (
              <code>
                {"-data {\n"}
                {renderBody()}
                {"}"}
              </code>
            )}
        </div>
      ) : (
        <div className="pre-wrapper">
          <code className="code">
            {`curl -X ${props.method} 'https://dbdash-backend-h7duexlbuq-el.a.run.app/`}
            <span className={"valuescolor"}>{props?.db}</span>/
            {<span className={"valuescolor"}>{`${props?.table}`}</span>}
            {props?.code ? props?.code + "'" : "'"} \
            <br />
            <br />
          </code>
          <code>
            {props.header?.split(",")?.map((head) => (
              <React.Fragment key={head}>
                -H <span className="errorcolor"> {`'${head.trim()}'`}</span> \
                <br />
              </React.Fragment>
            ))}
          </code>{" "}
          <br />
          {((props.body && typeof props.body === "object") || props.where) &&
            (props.where || props.body.length > 0) && (
              <code>
                {" -d '{\n"}
                {renderBody()}
                {"   }' "}
              </code>
            )}
        </div>
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
  db: PropTypes.any,
  table: PropTypes.any,
};

export default memo(CodeBlock);
