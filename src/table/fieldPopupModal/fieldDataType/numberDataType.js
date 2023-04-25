import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function NumberDataType(props) {

    const [decimalSelectValue,setDecimalSelectValue] = useState(1)
    const selectDecimalValue = (event) => {
        const data= props?.metaData;
        data.decimal = event.target.value
        setDecimalSelectValue(data)
        setDecimalSelectValue(event.target.value)
      }

  return (
    <>
     {props?.showNumericOptions && (
              <Select
                labelId="numeric-select-label"
                id="numeric-select"
                value={props?.selectValue}
                onChange={(e)=>props?.handleSelectChange(e)}
                defaultValue="value"
                displayEmpty
                sx={{ margin: 1, minWidth: 120 }}
              >
                <MenuItem value="value">Select Type</MenuItem>
                <MenuItem value="integer">integer</MenuItem>
                <MenuItem value="decimal">decimal</MenuItem>
              </Select>
            )}
      {props?.showDecimalOptions && (
        <Select
          labelId="decimal-select-label"
          id="decimal-select"
          value={decimalSelectValue}
          onChange={(e)=>{selectDecimalValue(e)}}
          defaultValue="1"
          displayEmpty
          sx={{ margin: 1, minWidth: 120 }}
        >
          <MenuItem value="Select">select decimal value </MenuItem>

          <MenuItem value="1">1.0</MenuItem>
          <MenuItem value="2">1.00</MenuItem>
          <MenuItem value="3">1.000</MenuItem>
          <MenuItem value="4">1.0000</MenuItem>
          <MenuItem value="5">1.00000</MenuItem>
          <MenuItem value="6">1.000000</MenuItem>
          <MenuItem value="7">1.0000000</MenuItem>
        </Select>
      )}
    </>
  )
}

NumberDataType.propTypes = {
    showNumericOptions: PropTypes.any,
    showDecimalOptions:PropTypes.any,
    metaData: PropTypes.any,
    selectValue:PropTypes.any,
    handleSelectChange:PropTypes.func
  }