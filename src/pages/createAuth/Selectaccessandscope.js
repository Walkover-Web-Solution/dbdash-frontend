import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react'
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { PropTypes } from "prop-types";

function Selectaccessandscope(props) {
  const {scope,setScope}=props;

    
  return (
    <div>
    <Box className="create-auth-key-row">
      <Typography className="create-auth-key-label">Scope</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", width: "300px" }} >
        <Box>
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
              <RadioGroup row>
                <FormControlLabel
                  value="alltables_read"
                  control={
                    <Radio
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                    />
                  }
                  label="Read"
                  checked={scope == "alltables_read"}
                  onClick={(e) => {
                    if (
                      typeof scope != "string" ||
                      scope != e.target.value
                    ) {
                      setScope(e.target.value);
                    } else setScope("");
                  }}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="alltables_write"
                  control={
                    <Radio
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                    />
                  }
                  label="Write" 
                  checked={scope == "alltables_write"}
                  onClick={(e) => {
                    if (
                      typeof scope != "string" ||
                      scope != e.target.value
                    ) {
                      setScope(e.target.value);
                    } else setScope("");
                  }}
                  labelPlacement="end"
                />
              </RadioGroup>
            </div>
          </Box>
        </Box>
        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid black",
            my: 1,
            paddingRight: "5px",
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
                    <RadioGroup row>
                      <FormControlLabel
                        value={`${key}_read`}
                        control={
                          <Radio
                            icon={
                              <CheckBoxOutlineBlankIcon fontSize="small" />
                            }
                            checkedIcon={
                              <CheckBoxIcon fontSize="small" />
                            }
                          />
                        }
                        label="Read"
                        checked={
                          Array.isArray(scope) &&
                          scope.includes(`${key}_read`)
                        }
                        onClick={(e) => {
                          console.log("heellff");
                          let arr = [];
                          if (typeof scope == "string") {
                            arr.push(e.target.value);
                            setScope([...arr]);

                            return;
                          }
                          arr = scope;

                          if (
                            e.target.value == `${key}_read` &&
                            Array.isArray(scope) &&
                            !scope.includes(e.target.value)
                          ) {
                            arr.push(e.target.value);
                            let index = arr.indexOf(`${key}_write`);
                            if (index != -1) arr.splice(index, 1);
                          } else if (scope.includes(e.target.value)) {
                            arr.splice(arr.indexOf(e.target.value), 1);
                          }

                          setScope([...arr]);
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value={`${key}_write`}
                        control={
                          <Radio
                            icon={
                              <CheckBoxOutlineBlankIcon fontSize="small" />
                            }
                            checkedIcon={
                              <CheckBoxIcon fontSize="small" />
                            }
                          />
                        }
                        label="Write"
                        checked={
                          Array.isArray(scope) &&
                          scope.includes(`${key}_write`)
                        }
                        onClick={(e) => {
                          console.log("heellff");
                          let arr = [];
                          if (typeof scope == "string") {
                            arr.push(e.target.value);
                            setScope([...arr]);

                            return;
                          }
                          arr = scope;

                          if (
                            e.target.value == `${key}_write` &&
                            Array.isArray(scope) &&
                            !scope.includes(e.target.value)
                          ) {
                            arr.push(e.target.value);
                            let index = arr.indexOf(`${key}_read`);
                            if (index != -1) {
                              arr.splice(index, 1);
                            }
                          } else if (scope.includes(e.target.value)) {
                            arr.splice(arr.indexOf(e.target.value), 1);
                          }
                          setScope([...arr]);
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </React.Fragment>
            ))}
        </Box>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography className="create-auth-key-label">
                Schema
              </Typography>
            </div>
            <div>
              <RadioGroup row>
                <FormControlLabel
                  value="schema_read"
                  control={
                    <Radio
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                    />
                  }
                  checked={scope == "schema_read"}
                  label="Read"
                  onClick={(e) => {
                    if (
                      typeof scope != "string" ||
                      scope != e.target.value
                    ) {
                      setScope(e.target.value);
                    } else setScope("");
                  }}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="schema_write"
                  control={
                    <Radio
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                    />
                  }
                  checked={scope == "schema_write"}
                  label="Write"
                  onClick={(e) => {
                    if (
                      typeof scope != "string" ||
                      scope != e.target.value
                    ) {
                      setScope(e.target.value);
                    } else setScope("");
                  }}
                  labelPlacement="end"
                />
              </RadioGroup>
            </div>
          </Box>
        </Box>
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