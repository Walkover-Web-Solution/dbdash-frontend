import { PropTypes } from "prop-types";
import React, { useState } from "react";
import "./Codeblock.scss";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import variables from "../../../../assets/styling.scss";
function CodeBlock(props) {
  const [isCopied, setIsCopied] = useState(false);
  const [showAPI, setShowAPI] = useState(true);
  function handleCopyClick() {
    const codeElement = document.querySelector(".code-block pre ");
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }
  const headers = props?.header.split(",");
const body = () => {
  if( props?.parent=='addrecord')
  {return (
    <pre className="pre-wrapper">

    <span >{`"records"`}</span>
    <span className="yellow">: </span>
    {"[\n"}
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
    {"}\n"}
    {" ]\n"}
  </pre>
  );}
  if(props?.parent=='updaterecord')
  {
    return(
    <>
      
      <span >{`"records"`}</span>
    <span className="yellow">: </span>
    {"[\n{\n"}
    <span >{`"where"`}</span>
    <span className="yellow">: </span>
    <span >{`"${props?.where}"`}</span>
    <span className="yellow">,</span>
{"\n"}
<span >{`"fields"`}</span>
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
    {"}\n"}
    {"}\n"}
    {" ]\n"}

      </>
    )
  }
  else return(
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
  return (
    <div className="code-block">
      <div className="codeblock-header">
        {" "}
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
          onClick={() => {
            setShowAPI(true);
          }}
          className={showAPI ? "button-api " : "button-curl active "}
        >
          API
        </button>
        <button
          onClick={() => {
            setShowAPI(false);
          }}
          className={showAPI ? "button-curl active" : "button-api "}
        >
          CURL
        </button>
      </div>
      {showAPI ? (
        <pre className="pre-wrapper">
          <br />
          <code className="code">{props.code}</code>
          <br />
          <code className="yellow">
            {headers.map((header) => `${header}\n`)}
          </code>
          <br />
          <br />
          <br />
       
          {props.body &&
            typeof props.body === "object" &&
            props.body.length > 0 && (
              <code className="white">
                {"-data{\n"}
               {body()}
                {"}"}
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
          <code className="yellow">
            {headers.map((header) => `${header} \\\n`)}
          </code>{" "}
          <br />
        
          {props.body &&
            typeof props.body === "object" &&
            props.body.length > 0 && (
              <code className="white">
                {" -d '{\n"}
                {body()}
               
                {"}' "}\
              </code>
            )}
        </pre>
      )}
    </div>
  );
}

export default CodeBlock;

CodeBlock.propTypes = {
  code: PropTypes.any,
  header: PropTypes.any,
  method: PropTypes.any,
  body: PropTypes.any,
  parent:PropTypes.any,
  where:PropTypes.any,
};

// import { PropTypes } from 'prop-types';
// import React, { useState } from 'react';
// import './Codeblock.scss'
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
// import variables from '../../../../assets/styling.scss';

// function CodeBlock(props) {
//   const [isCopied, setIsCopied] = useState(false);
//   const [showAPI, setShowAPI] = useState(true);

//   function handleCopyClick() {
//     navigator.clipboard.writeText(props.code);
//     setIsCopied(true);

//     setTimeout(() => {
//       setIsCopied(false);
//     }, 2000);
//   }
// const dummy=(type)=>{
//   switch(type){
//     case "number":
//       return 124553;
//       case "rowid":
//         return "row34";
//         case "createdat":
//           return new Date().toISOString();
//           case "longtext":
//             return "it is a long long text";
//             case "autonumber":
//               return 4564443;
//               case "createdby":
//                  return "chirag devlani";
//                  case "checkbox":
//                   return true;
//                   case "updatedat":
//                     return new Date().toISOString();
//                     case "updatedby":
//                       return "chirag devlani";
//             default :
//             return "hello";
//   }
// }

//   const getCodeToDisplay = () => {
//     if (showAPI) {
//       return (
//         <>
//           <code style={{ whiteSpace: "pre-wrap", maxWidth: "400px", wordWrap: "break-word" }}>
//             {props.code}
//           </code>
//           <br />
//           <br />
//           <code style={{ color: "yellow" }}>
//             {props.header}
//           </code>
//           <br />
//           <br />
//           <br />
//           {props.body && typeof props.body === "object" && props.body.length > 0 && (
//             <code style={{ color: "white" }}>
//               {"-data{\n"}
//               {props.body.map((x, index) => (
//                 <span key={index}>
//                   <span style={{ color: "cyan", margin: "1px" }}>{`" ${x[0]} "`}</span>
//                   <span style={{ color: "yellow", margin: "1px" }}>:  </span>
//                   {x[1] === "number" || x[1] === "autonumber" ? (
//                     <span style={{ color: "green", margin: "1px" }}>{` ${dummy(x[1])} `}</span>
//                   ) : (
//                     <span style={{ color: "magenta", margin: "1px" }}>{`" ${dummy(x[1])} "`}</span>
//                   )}
//                   <span style={{ color: "yellow", margin: "1px" }}>,</span>
//                   <br />
//                 </span>
//               ))}
//               {"}"}
//             </code>
//           )}
//         </>
//       );
//     } else {
//       // Generate cURL command
//       const apiUrl = 'https://dbdash-backend-h7duexlbuq-el.a.run.app/64881476e0427562bf2ef2ab/tbl7jafdh';
//       const authKey = 'AUTH_TOKEN';
//       const rowId = ':rowId';
//       const data = {
//         // cURL request body data
//       };
//       const headers = {
//         'H auth-key': authKey,
//       };

//       const curlCommand = `curl -X POST ${apiUrl}/${rowId} -H ${JSON.stringify(headers)} -d ${JSON.stringify(data)}`;

//       return (
//         <>
//           <code style={{ whiteSpace: "pre-wrap", maxWidth: "400px", wordWrap: "break-word" }}>
//             {curlCommand}
//           </code>
//         </>
//       );
//     }
//   };

//   return (
//     <div className="code-block">
//       <div className="codeblock-header">
//         <button className="copy-button" onClick={handleCopyClick}>
//           {isCopied ? (
//             <span style={{ fontSize: variables.codeblockcopybuttonsize }}>Copied!</span>
//           ) : (
//             <ContentPasteIcon />
//           )}
//         </button>
//       </div>

//       <div className="button">
//         <button onClick={() => setShowAPI(true)} className={showAPI ? "button-api" : "button-curl"}>
//           API
//         </button>
//         <button onClick={() => setShowAPI(false)} className={showAPI ? "button-curl" : "button-api"}>
//           cURL
//         </button>
//       </div>

//       <pre style={{ position: "relative", width: "400px", whiteSpace: "pre-wrap" }}>
//         <br />
//         {getCodeToDisplay()}
//       </pre>
//     </div>
//   );
// }

// export default CodeBlock;

// CodeBlock.propTypes = {
//   code: PropTypes.any,
//   header: PropTypes.any,
//   body: PropTypes.any,
// };
