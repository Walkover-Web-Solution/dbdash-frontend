import React, { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';
// import CodeSnippet from '../codeSnippet';
import { getAllfields } from '../../../api/fieldApi';
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';


function BasicStuff(props) {
  console.log("props",props)
  const [fieldData, setFieldData] = useState(null)
  const tableData = async () => {
    const data = await getAllfields(props.db, props.table)
    setFieldData(data?.data?.data?.fields)
  }
  useEffect(() => {
    tableData();
  }, [props.db, props.table]);
  return (
    <Box>

      <Typography style={{ fontWeight: 'bold' }} >Database Id - {props.db}</Typography>
      <Typography style={{ fontWeight: 'bold' }} >Table Id - {props.table}</Typography>
      <br></br>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography style={{ fontWeight: 'bold' }}>fieldName</Typography>
          {fieldData && Object.entries(fieldData).map((fields, index) => (
            <Typography key={index}>{fields[1].fieldName}</Typography>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography style={{ fontWeight: 'bold' }}>fieldId</Typography>
          {fieldData && Object.entries(fieldData).map((fields, index) => (
            <div key={index} style={{display:"flex",flexDirection:"row"}}>
            <Typography key={index}>{fields[0]}</Typography>
            <button style={{transition: "background-color 0.3s ease",backgroundColor:"transparent",color:"black",margin:"2px",border:"none"}} onMouseDown={(e) => {
    e.target.style.backgroundColor = "gray";
  }}
  onMouseUp={(e) => {
    e.target.style.backgroundColor = "transparent";
  }}onClick={()=>{
               navigator.clipboard.writeText(fields[0]);   

            }}>
       <ContentPasteIcon/>
      </button>
      </div>

          ))}
          
        </Grid>
       
      </Grid>

    </Box>
  )
}
BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
}
export default BasicStuff 