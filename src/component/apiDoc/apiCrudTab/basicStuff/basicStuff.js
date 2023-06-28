import React, {  useState } from 'react';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import '../basicStuff/basicStuff.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
import Records from '../records/records';

function BasicStuff(props) {
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  return (
    <Box className="basic-stuff-container">
      
      <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)}   >
       <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><span> Database Id - {props.db}</span> <span >{CopyButton(props.db, -1)}</span></div>
      </Typography>
      <Typography variant={'h3'} fontSize={Number(variables.megatitlesize)} >
      <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}> <span>Table Id - {props.table}</span> <span>{CopyButton(props.table, -2)}</span></div>   
      </Typography>
      <br />
     
      <Records
        db={props?.db}
        parent='basicstuff'
        CopyButton={CopyButton}
        table={props?.table}
        alltabledata={props?.alltabledata}
        />
    </Box>
  );
}

BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  alltabledata:PropTypes.any,

};

export default BasicStuff;