import React, { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';
// import CodeSnippet from '../codeSnippet';
import { getAllfields } from '../../../api/fieldApi';
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
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
      
         <Typography style={{fontWeight: 'bold'}} >Database Id - {props.db}</Typography>
        <Typography style={{fontWeight: 'bold'}} >Table Id - {props.table}</Typography>
        <br></br>
        <Typography style={{fontWeight: 'bold'}} >fieldName    fieldId   fieldType </Typography>
    {console.log(fieldData)}
        {fieldData && Object.entries(fieldData).map((fields, index) => (
          <Box
          style={{fontWeight: 'bold'}}
            key={index}
          >
             <Typography > {fields[1].fieldName} -
              </Typography> 
           <Typography >  {fields[0]} - </Typography>  
            <Typography >  {fields[1].fieldType} </Typography>
          </Box>
        ))}
      
      {/* <CodeSnippet codeString="const myVar = 'Hello, world!';" /> */}
    </Box>
  )
}
BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
}
export default BasicStuff 