import React, {  useState } from 'react';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Link, Typography } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import './basicStuff.scss'; // Import the CSS file
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
      
      <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Basic Authentication -</Typography>
      <Typography  fontSize={variables.textsize} >
      DB-Dash supports basic authentication at the database level. Each database has one authentication key that can be used to authenticate multiple tables within that database. Multiple authentication keys can be generated, each with its own set of read/write permissions for different tables.
 </Typography>
 <br/>
 <Typography   style={{  fontSize:24}}>
        Table Detail -
 </Typography>
      <Typography  style={{  fontSize:24}}   >
       
       <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><span> Database Id - {props.db}</span> <span >{CopyButton(props.db, -1)}</span></div>
      </Typography>
      <Typography  style={{  fontSize:24}} >
      <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}> <span>Table Id - {props.table}</span> <span>{CopyButton(props.table, -2)}</span></div>   
      </Typography>
      <br />

      <br />

 <Typography  sx={{backgroundColor:"#E6E6E6"}} >
 curl-X GET <Link style={{textDecoration: "underline"}}>https://dbdash-backend-h7duexlbuq-el.a.run.app/<span style={{}}>Your_DataBase_ID/Your_Table_ID</span></Link><br/>
 .H<Link> auth-key:AUTH_TOKEN</Link>
 </Typography>
 <br />
 <br/>
 <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
 Field/Column details
 </Typography>
        
        <Typography  fontSize={variables.textsize} >
        Every field/column has a unique Field ID that will be used in the APIs.
 </Typography>
 <br/>
 <Typography  fontSize={variables.textsize}  style={{ fontWeight: "bold" }}>
Note: In the given example, it will search for all occurrences of JOHN in FieldID1 If multiple records are found with this filter, it will update all of them. Therefore we suggest using Filter for only unique fields.
</Typography>
<br/>
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