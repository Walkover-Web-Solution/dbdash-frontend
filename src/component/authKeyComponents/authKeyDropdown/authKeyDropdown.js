import React from 'react'
import {InputLabel,MenuItem,FormControl,Select } from '@mui/material';
import { Box } from '@mui/system';
import './authKeyDropdown.css'
import PropTypes from "prop-types";
export default function AuthKeyDropdown({scope,setScope}) {

  const handleChange = (event) => {
    setScope(event.target.value);
  }
  
  return (
    <>
       <Box>
      <FormControl className="formcontrol" >
        <InputLabel id="demo-simple-select-helper-label">Add Space</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={scope}
          label="Add Space"
          onChange={handleChange}
          className="select"
     
        >
          <MenuItem value={"Read"}>Read</MenuItem>
          <MenuItem value={"Write"}>Write</MenuItem>
        </Select>
      </FormControl>
    </Box>
    </>
  );
}

AuthKeyDropdown.propTypes = {
  scope: PropTypes.any,
  setScope:PropTypes.func
};













