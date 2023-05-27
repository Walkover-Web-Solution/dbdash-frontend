import React, { useEffect } from 'react'
// import { getAllfields } from '../../../api/fieldApi';
import Grid from '@mui/material/Grid';
import { PropTypes } from 'prop-types';
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Typography } from '@mui/material';
import { useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function Records(props) {
const [rowfieldData, setRowFieldData] = useState(props.table[1].fields)
const tableData = async () => {
  // const data = await getAllfields(props.db, props.table)
  setRowFieldData(props.table[1].fields)
}
useEffect(() => {
  tableData();
}, [props.db, props.table[0]]);
  return (
    <div>
        <Grid container spacing={2}>
  <Grid item xs={3.2}>
    <Typography style={{ fontWeight: 'bold' }}>fieldName</Typography>
  {rowfieldData && Object?.entries(rowfieldData) && Object?.entries(rowfieldData).map((fields, index) => 
    (
    
    <Typography style={{fontSize:"18px"}} key={index}>{fields[1].fieldName}</Typography>
  ))}
  </Grid>
  <Grid item xs={3.2}>
    <Typography style={{ fontWeight: 'bold' }}>fieldId</Typography>
    {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
      <Typography style={{fontSize:"18px"}} key={index}>{fields[0]}</Typography>
    ))}
  </Grid>
  <Grid item xs={3.2}>
          <Typography style={{ fontWeight: 'bold' }}>fieldType</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
            <Typography style={{fontSize:"18px"}} key={index}>{fields[1].fieldType=="checkbox" ? "boolean":fields[1].fieldType}</Typography>
          ))}
        </Grid>

  <Grid item xs={2}>
  <Typography style={{ fontWeight: 'bold',paddingBottom:"7px" }}>Add/Remove</Typography>
  
  {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
    <Typography style={{ fontSize:"18px"}}key={index}>
      {props.arr && !props.arr.find(x => x[0] === fields[0]) ? (
        <button

          style={{fontSize:"18px", backgroundColor: "transparent", border: "none", display: "inline-block" }}
          onClick={() => { props.setArr([...props.arr, [fields[0],fields[1].fieldType]]) }}
        >
          <CheckBoxOutlineBlankIcon fontSize="2px" />
        </button>
      ) : (
        <button
          style={{ fontSize:"18px",backgroundColor: "transparent", border: "none", display: "inline-block" }}
          onClick={() => { const arr1 = props.arr.filter(x => x[0] !== fields[0]); props.setArr(arr1) }}
        >
          <CheckBoxIcon fontSize="2px" />
        </button>
      )}
      
    </Typography>
  ))}
  
</Grid>

 
</Grid>

    </div>
  )
}


Records.propTypes = {
    db: PropTypes.string,
    table:PropTypes.string,
    setArr:PropTypes.func,
    arr:PropTypes.any

  }
export default Records