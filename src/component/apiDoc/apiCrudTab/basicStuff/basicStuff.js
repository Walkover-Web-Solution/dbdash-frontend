import React, { useState,memo } from "react";
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import "./basicStuff.scss";
import variables from "../../../../assets/styling.scss";
import Records from "../records/records";
import CodeBlock from "../Codeblock/Codeblock";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
function BasicStuff(props) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const { db, table, alltabledata } = props.tablePannelListData;

  const CopyButton = (text, index) => {
    const handleMouseDown = (e) => {
      e.target.style.backgroundColor = "gray";
    };

    const handleMouseUp = (e) => {
      e.target.style.backgroundColor = "transparent";
    };

    const handleClick = () => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    };
    return (
      <span
        className="copy-button1"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        <ContentCopyOutlinedIcon className="color-black" />
        {copiedIndex === index && <span className="copied-text">Copied!</span>}
      </span>
    );
  };

  return (
    <>
      <div className="list-record-container horizontalscroll">
        <CodeBlock
          method="GET"
          db={db}
          table={table}
          header={`auth-key: AUTH_TOKEN `}
        />
      </div>

      <Box className="basic-stuff-container">
        <Typography
          variant={variables.megatitlevariant}
          fontSize={Number(variables.megatitlesize)}
        >
          Basic Authentication
        </Typography>
        <Typography className="basicstuffpara1">
          DB-Dash supports basic authentication at the database level. Each
          database has one authentication key that can be used to authenticate
          multiple tables within that database. Multiple
          <span
            style={{ color: "#016FA4", cursor: "pointer" }}
            onClick={() => {
              props?.setShowComponent("authkey");
            }}
          >
            {" "}
            authentication keys
          </span>{" "}
          can be generated, each with its own set of read/write permissions for
          different tables.
        </Typography>
        <div className="basicstufftitle2"></div>
        <Typography
          variant={variables.megatitlevariant}
          className="paddingtopoftitle"
          fontSize={Number(variables.megatitlesize)}
        >
          Table Details
        </Typography>
        <br />
        <Typography
          variant={variables.megatitlevariant}
          fontSize={Number(variables.titlesize)}
        >
          <div className="basicstuffIdsOnTop">
            <span> Database Id - </span>
            <span className="ids"> {db}</span> <span>{CopyButton(db, -1)}</span>
          </div>
        </Typography>
        <Typography variant={"h3"} fontSize={Number(variables.titlesize)}>
          <div className="basicstuffIdsOnTop">
            {" "}
            <span>Table Id - </span>
            <span className="ids">{table}</span>{" "}
            <span>{CopyButton(table, -2)}</span>
          </div>
        </Typography>
        <br />
        <div className="basicstuffdiv1">
          <div className="divofapidoccodetypeforurl">
            <Typography className="typographyinsidecodestyle">
              curl -X GET &apos;https://dbdash-backend-h7duexlbuq-el.a.run.app/
              <br />
              <span className="valuescolor">YOUR_DATABASE_ID</span>/
              <span className="valuescolor">YOUR_TABLE_ID</span>&apos;
              <br />
              -H &apos; <span className="errorcolor">auth-key: AUTH_TOKEN</span>
              &apos;
            </Typography>
          </div>
        </div>
        <Typography
          variant={variables.megatitlevariant}
          className="paddingtopoftitle"
          fontSize={Number(variables.megatitlesize)}
        >
          Field/Column Details
        </Typography>
        <Typography className="basicstuffrecordstypography">
          Every field/column has a *unique Field ID* that will be used in the
          APIs. Note: The column or field names are provided solely for
          reference purposes. Please remember that you cannot employ the column
          or field name directly in the APIs, you have to use Field ID.
        </Typography>

        <Records
          db={db}
          parent="basicstuff"
          CopyButton={CopyButton}
          table={table}
          alltabledata={alltabledata}
        />
      </Box>
    </>
  );
}

BasicStuff.propTypes = {
  setShowComponent: PropTypes.any,
  tablePannelListData: PropTypes.any,
};

export default memo(BasicStuff);
