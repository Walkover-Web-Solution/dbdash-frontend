import React, { useEffect } from 'react'
import { getAllfields } from '../../../../api/fieldApi';
import Grid from '@mui/material/Grid';
import { PropTypes } from 'prop-types';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Typography } from '@mui/material';
import { useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import './records.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
function Records(props) {
  const [rowfieldData, setRowFieldData] = useState(null)

  const tableData = async () => {
    const data = await getAllfields(props.db, props.table)
    setRowFieldData(data?.data?.data?.fields)
  }

  useEffect(() => {
    tableData();
  }, [props.db, props.table]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography  sx={{ textAlign: 'center' }}  fontSize={Number(variables.titlesize)}  fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Name</Typography>
          {rowfieldData && Object?.entries(rowfieldData) && Object?.entries(rowfieldData).map((fields, index) => (
            <Typography  sx={{ textAlign: 'center' }} className="field-name" key={index}>{fields[1].fieldName}</Typography>
          ))}
        </Grid>
        <Grid item xs={3}>
          <Typography  sx={{ textAlign: 'center' }}  fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Id</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
            <Typography sx={{ textAlign: 'center' }} className="field-id" key={index}>{fields[0]}</Typography>
          ))}
        </Grid>
        <Grid item xs={3}>
          <Typography  sx={{ textAlign: 'center' }}  fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Type</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
            <Typography sx={{ textAlign: 'center' }} className="field-type" key={index}>{fields[1].fieldType === "checkbox" ? "boolean" : fields[1].fieldType}</Typography>
          ))}
        </Grid>
        <Grid item xs={3} >
          <Typography  sx={{ textAlign: 'center' }}  fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant} className="add-remove">Add/Remove</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
            <Typography sx={{ textAlign: 'center' }} key={index}>
              {props.arr && !props.arr.find(x => x[0] === fields[0]) ? (
                <button
                  className="add-remove-button"
                  onClick={() => { props.setArr([...props.arr, [fields[0], fields[1].fieldType]]) }}
                >
                  <CheckBoxOutlineBlankIcon fontSize="4px" />
                </button>
              ) : (
                <button
                  className="add-remove-button"
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
  table: PropTypes.string,
  setArr: PropTypes.func,
  arr: PropTypes.any
}

export default Records;
