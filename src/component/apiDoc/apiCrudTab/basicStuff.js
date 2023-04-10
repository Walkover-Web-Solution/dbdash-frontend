import React, { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';
// import CodeSnippet from '../codeSnippet';
import { getAllfields } from '../../../api/fieldApi';
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
function BasicStuff(props) {
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
            <Typography key={index}>{fields[0]}</Typography>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography style={{ fontWeight: 'bold' }}>fieldType</Typography>
          {fieldData && Object.entries(fieldData).map((fields, index) => (
            <Typography key={index}>{fields[1].fieldType}</Typography>
          ))}
        </Grid>
      </Grid>
      <br></br>
      {/* <CodeSnippet codeString="const myVar = 'Hello, world!';" /> */}
    </Box>
  )
}
BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
}
export default BasicStuff