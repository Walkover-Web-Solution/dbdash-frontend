import React, { useEffect } from 'react'
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

    setRowFieldData(props?.alltabledata[props?.table]?.fields)
  }

  useEffect(() => {
    tableData();
  }, [props.db, props.table]);

  return (
    <div>
      <Grid  container spacing={2}>
        <Grid item xs={props?.CopyButton?2:3}>
          <Typography  className="center-aligned"  fontSize={Number(variables.titlesize)}  fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Name</Typography>
          {rowfieldData && Object?.entries(rowfieldData) && Object?.entries(rowfieldData).map((fields, index) => (
  props?.CopyButton ? (
    <div className="field-name-container" key={index}>
      <Typography className="center-aligned field-name" key={index}>
        {fields[1].fieldName}
      </Typography>
    </div>
  ) : (
    <Typography className="center-aligned field-name" key={index}>
      {fields[1].fieldName}
    </Typography>
  )
))}

        </Grid>
        <Grid item xs={props?.CopyButton?2:3}>
          <Typography  className="center-aligned"  fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Id</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => {
  return props?.CopyButton ? (
    <div className="field-id-container" key={index}>
      <Typography className="center-aligned field-id" key={index}>
        {fields[0]}
      </Typography>
      <div>{props.CopyButton(fields[0], index)}</div>
    </div>
  ) : (
    <Typography className="center-aligned field-id" key={index}>
      {fields[0]}
    </Typography>
  );
})}

        </Grid>
        <Grid item  xs={props?.CopyButton?2:3}>
  <Typography className="center-aligned" fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant}>Field Type</Typography>
  {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
    props?.CopyButton ? (
      <div className="field-name-container" key={index}>
        <Typography className="center-aligned field-name" key={index}>
          {fields[1].fieldType === "checkbox" ? "boolean" : fields[1].fieldType}
        </Typography>
      </div>
    ) : (
      <Typography className="center-aligned field-name" key={index}>
        {fields[1].fieldType === "checkbox" ? "boolean" : fields[1].fieldType}
      </Typography>
    )
  ))}
</Grid>

        { (!props?.parent || props?.parent!='basicstuff') && (
        <>  <Grid item xs={3} >
          <Typography  className="center-aligned  add-remove "  fontSize={Number(variables.titlesize)} fontWeight={variables.titleweight} variant={variables.titlevariant}>Add/Remove</Typography>
          {rowfieldData && Object.entries(rowfieldData).map((fields, index) => (
            <Typography className="center-aligned" key={index}>
              {props.arr && !props.arr.find(x => x[0] === fields[0]) ? (
                <button
                  className="add-remove-button"
                  disabled={ fields[1].fieldType=='rowid' || fields[1].fieldType=='autonumber' || fields[1].fieldType=='createdat' || fields[1].fieldType=='createdby' || fields[1].fieldType=='updatedat'  || fields[1].fieldType=='updatedby' }
                  onClick={() => { props.setArr([...props.arr, [fields[0], fields[1].fieldType]]) }}
                >
                  <CheckBoxOutlineBlankIcon fontSize="4px" />
                </button>
              ) : (
                <button
                  className="add-remove-button"
                  onClick={() => { const arr1 = props.arr.filter(x => x[0] !== fields[0]); props.setArr(arr1) }}
                >
                  <CheckBoxIcon  fontSize={variables.iconfontsize1} />
                </button>
              )}
            </Typography>
          ))}
        </Grid>
        </>

        )}
      </Grid>
    </div>
  )
}

Records.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  setArr: PropTypes.func,
  arr: PropTypes.any,
  parent:PropTypes.any,
  CopyButton:PropTypes.any,
  alltabledata:PropTypes.any,

}

export default Records;
