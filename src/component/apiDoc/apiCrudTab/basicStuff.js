import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { getAllfields } from "../../../api/fieldApi";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

function BasicStuff(props) {
  const [fieldData, setFieldData] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const tableData = async () => {
    const data = await getAllfields(props.db, props.table);
    setFieldData(data?.data?.data?.fields);
  };

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

    const textSize = text.length < 10 ? "16px" : "14px";
    return (
      <button
        style={{
          transition: "background-color 0.3s ease",
          backgroundColor: "transparent",
          color: "black",
          margin: "2px",
          border: "none",
          fontSize: "12px",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        <ContentPasteIcon />
        {copiedIndex === index && (
          <span
            style={{
              marginLeft: "10px",
              fontSize: textSize,
              color: "black",
            }}
          >
            Copied!
          </span>
        )}
      </button>
    );
  };

  useEffect(() => {
    tableData();
  }, [props.db, props.table]);

  return (
    <Box>
      <Typography style={{ fontWeight: "bold" }}>
        Database Id - {props.db} {CopyButton(props.db, -1)}
      </Typography>
      <Typography style={{ fontWeight: "bold" }}>
        Table Id - {props.table} {CopyButton(props.table, -2)}
      </Typography>
      <br />
      <Grid container spacing={2}>
  <Grid item xs={4}>
    <Typography style={{ fontWeight: "bold" }}>fieldName</Typography>
    {fieldData &&
      Object.entries(fieldData).map((fields, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center", 
          }}
        >
          <Typography style={{ fontSize: "20px"}}>{fields[1].fieldName}</Typography>
        </div>
      ))}
  </Grid>
  <Grid item xs={4}>
    <Typography style={{ fontWeight: "bold" }}>fieldId</Typography>
    {fieldData &&
      Object.entries(fieldData).map((fields, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center", 
            fontSize: "20px",
          }}
        >
          <Typography style={{ fontSize: "20px" }}>{fields[0]}</Typography>
          {CopyButton(fields[0], index)}
        </div>
      ))}
  </Grid>
</Grid>

    </Box>
  );
}

BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
};

export default BasicStuff;
