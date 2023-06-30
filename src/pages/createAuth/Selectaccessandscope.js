import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react'
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { PropTypes } from "prop-types";

function Selectaccessandscope(props) {
  const {scope,setScope}=props;

  
  const isSelected = (value) => Array.isArray(scope) && scope.includes(value);
  const handleScopeChange = (event,key) => {
    const value = event.target.value;
    let updatedScope = [];
  
    if (typeof scope === "string") {
       
      updatedScope.push(value);
    } else {
      updatedScope = [...scope];
  
      if (value === `${key}_read`) {
        if (!scope.includes(value)) {
          updatedScope.push(value);
          const writeIndex = updatedScope.indexOf(`${key}_write`);
          if (writeIndex !== -1) {
            updatedScope.splice(writeIndex, 1);
          }
        } else {
          updatedScope.splice(updatedScope.indexOf(value), 1);
        }
      } else if (value === `${key}_write`) {
        if (!scope.includes(value)) {
          updatedScope.push(value);
          const readIndex = updatedScope.indexOf(`${key}_read`);
          if (readIndex !== -1) {
            updatedScope.splice(readIndex, 1);
          }
        } else {
          updatedScope.splice(updatedScope.indexOf(value), 1);
        }
      }
    }
  
    setScope(updatedScope);
  };
  
  return (
    <div>
    <Box className="create-auth-key-row">
      <Typography className="create-auth-key-label">Scope</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", width: "300px" }} >
      <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" ,paddingRight:'5px'}}>
            <div>
              <Typography className="create-auth-key-label">
                Schema
              </Typography>
            </div>
            <div>
            <RadioGroup row value={scope} onChange={(e) => setScope(e.target.value)}>
  <FormControlLabel
    value="schema_read"
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Read"
    labelPlacement="end"
    onClick={(e)=>{if(scope==e.target.value) {setScope('')}}}

  />
  <FormControlLabel
    value="schema_write"
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Write"
    onClick={(e)=>{if(scope==e.target.value) {setScope('')}}}

    labelPlacement="end"
  />
</RadioGroup>

            </div>
          </Box>
        </Box>
      {!scope.includes('schema') && <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "5px",
            }}
          >
            <div>
              <Typography className="create-auth-key-label">
                All Tables
              </Typography>
            </div>
            <div>
            <RadioGroup row value={scope} onChange={(e) => setScope(e.target.value !== scope ? e.target.value : "")}>
  <FormControlLabel
    value="alltables_read"
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Read"
    onClick={(e)=>{if(scope==e.target.value) {setScope('')}}}
    labelPlacement="end"
  />
  <FormControlLabel
    value="alltables_write"
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Write"
    onClick={(e)=>{if(scope==e.target.value) {setScope('')}}}

    labelPlacement="end"
  />
</RadioGroup>

            </div>
          </Box>
        </Box>}
       {(Array.isArray(scope) || scope=='') && <Box
          sx={{
            maxHeight: "350px",
            overflowY: "auto",
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid black",
            my: 1,
            paddingRight:'5px'
          }}
        >
          {props?.alltabledata &&
            Object.entries(props?.alltabledata).map(([key, value]) => (
              <React.Fragment key={key}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    

                  }}
                >
                  <div>
                    <Typography className="create-auth-key-label">
                      {value.tableName}
                    </Typography>
                  </div>
                  <div>
<RadioGroup row value={scope} onChange={(e) => handleScopeChange(e,key)}>
  <FormControlLabel
    value={`${key}_read`}
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Read"
    checked={isSelected(`${key}_read`)}
    onClick={(e) => {
        if (scope.includes(e.target.value)) {
          let updatedscope = [...scope];
          updatedscope.splice(scope.indexOf(e.target.value), 1);
          setScope(updatedscope);
        }
      }}
      
    labelPlacement="end"
  />
  <FormControlLabel
    value={`${key}_write`}
    control={<Radio icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
    label="Write"
    onClick={(e) => {
        if (scope.includes(e.target.value)) {
          let updatedscope = [...scope];
          updatedscope.splice(scope.indexOf(e.target.value), 1);
          setScope(updatedscope);
        }
      }}
      
    checked={isSelected(`${key}_write`)}
    labelPlacement="end"
  />
</RadioGroup>
                  </div>
                </Box>
              </React.Fragment>
            ))}
        </Box>}
        
      </Box>
    </Box></div>
  )
}

export default Selectaccessandscope
Selectaccessandscope.propTypes={
    scope:PropTypes.any,
    setScope:PropTypes.any,
  alltabledata: PropTypes.any,

}