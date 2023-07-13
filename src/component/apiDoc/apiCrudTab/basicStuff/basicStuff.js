import React, {  useState } from 'react';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import './basicStuff.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
import Records from '../records/records';
import CodeBlock from '../Codeblock/Codeblock';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
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
        <ContentCopyOutlinedIcon className="color-black"/>
        {copiedIndex === index && <span className="copied-text">Copied!</span>}
      </span>
    );
  };

  return (
    <>
    <div
      className="list-record-container"
      style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}
      >
         <CodeBlock method="GET"  db={props?.db} table={props?.table} header={`auth-key: AUTH_TOKEN `}/>
    
      </div>

    <Box className="basic-stuff-container">
      
    <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)}   >
    Basic Authentication
</Typography>
<Typography sx={{wordWrap:'pre-wrap',width:'50vw ',pl:2}}>
DB-Dash supports basic authentication at the database level.
 Each database has one authentication key that can be used to
  authenticate multiple tables within that database. Multiple
    <span style={{color:'#016FA4',cursor:'pointer'}} onClick={()=>{props?.setShowComponent('authkey')}}> authentication keys</span> can be generated, each with its own 
   set of read/write permissions for different tables.
</Typography>
    <Typography variant={variables.megatitlevariant} sx={{pt:2}} fontSize={Number(variables.megatitlesize)}   >
    Table Details
</Typography>

      <Typography variant={variables.megatitlevariant}  fontSize={Number(variables.titlesize)}   >
       <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}><span> Database Id - {props.db}</span> <span >{CopyButton(props.db, -1)}</span></div>
      </Typography>
      <Typography variant={'h3'} fontSize={Number(variables.titlesize)} >
      <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}> <span>Table Id - {props.table}</span> <span>{CopyButton(props.table, -2)}</span></div>   
      </Typography>
      <br />
      <div style={{ width: '50vw', height: '15vh', backgroundColor: variables.codeblockbgcolor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography sx={{ justifyContent:'center',width:'100%',pl:2}}>
    curl -X GET &apos;https://dbdash-backend-h7duexlbuq-el.a.run.app/<br/><span style={{color: "#028a0f"}}>YOUR_DATABASE_ID</span>/<span style={{color: "#028a0f"}}>YOUR_TABLE_ID</span>&apos;<br/>
    -H &apos; <span  style={{color: variables.deletecolor}}>auth-key: AUTH_TOKEN</span>&apos;
  </Typography>
</div>
 <Typography variant={variables.megatitlevariant} sx={{pt:2}} fontSize={Number(variables.megatitlesize)}   >
    Field/Column Details
</Typography>
<Typography sx={{wordWrap:'pre-wrap',width:'50vw ',pl:2,pb:2}}>

Every field/column has a *unique Field ID* that will be used in the APIs.

Note: The column or field names are provided solely for reference purposes. Please remember that you cannot employ the column or field name directly in the APIs, you have to use Field ID.
</Typography>


      <Records
        db={props?.db}
        parent='basicstuff'
        CopyButton={CopyButton}
        table={props?.table}
        alltabledata={props?.alltabledata}
        />
    </Box>
    </>

  );
}

BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  alltabledata:PropTypes.any,
  setShowComponent:PropTypes.any
};

export default BasicStuff;