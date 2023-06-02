import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { getAllfields } from '../../../../api/fieldApi';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import './basicStuff.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';

function BasicStuff(props) {
  const [fieldData, setFieldData] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
 
  const tableData = async () => {
    const data = await getAllfields(props.db, props.table);
    setFieldData(data?.data?.data?.fields);
  };

  const CopyButton = (text, index) => {
    const handleMouseDown = (e) => {
      e.target.style.backgroundColor = 'gray';
    };

    const handleMouseUp = (e) => {
      e.target.style.backgroundColor = 'transparent';
    };

    const handleClick = () => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    };
    console.log(variables);

    return (
      <span
      
      className="copy-button1"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        <ContentPasteIcon className="color-black"/>
        {copiedIndex === index && <span className="copied-text">Copied!</span>}
      </span>
    );
  };

  useEffect(() => {
    tableData();
  }, [props.db, props.table]);

  return (
    <Box className="basic-stuff-container">
      <Typography variant={'h3'} fontSize={Number(variables.megatitlesize)} className="bold-text">
        Database Id - {props.db} {CopyButton(props.db, -1)}
      </Typography>
      <Typography variant={'h3'} fontSize={Number(variables.megatitlesize)} className="bold-text">
        Table Id - {props.table} {CopyButton(props.table, -2)}
      </Typography>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography  className="bold-text">fieldName</Typography>
          {fieldData &&
            Object.entries(fieldData).map((fields, index) => (
              <div className="field-name-container" key={index}>
                <Typography className="field-name">{fields[1].fieldName}</Typography>
              </div>
            ))}
        </Grid>
        <Grid item xs={2}>

         
          <Typography  className="bold-text">fieldId</Typography>
          {fieldData &&
            Object.entries(fieldData).map((fields, index) => (
              <div className="field-id-container" key={index}>
                <Typography>{fields[0]}</Typography>
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
  table: PropTypes.string,
};

export default BasicStuff;