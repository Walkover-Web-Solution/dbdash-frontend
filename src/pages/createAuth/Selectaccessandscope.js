import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { PropTypes } from "prop-types";

function Selectaccessandscope(props) {
  const { scope, setScope } = props;
  const isSelected = (key, value) => {
    return scope[key] && scope[key] == value;
  };
  const handleRemoveChecked = (key, value) => {
    if (scope[key] == value) {
      let obj = { ...scope };
      obj[key] = "";
      setScope(obj);
    }
  };
  const handleScopeChange = (event, key) => {
    const value = event.target.value;
    let updatedScope = { ...scope };

    if (updatedScope[key] == value) return;
    updatedScope["schema"] = "";
    updatedScope["alltables"] = "";
    updatedScope[key] = value;

    setScope(updatedScope);
  };
  return (
    <div>
      <Box className="create-auth-key-row">
        <Typography className="create-auth-key-label">Scope</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", width: "300px" }}>
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
                  Schema
                </Typography>
              </div>
              <div>
                <RadioGroup
                  row
                  value={scope["schema"]}
                  onChange={(e) => {
                    let obj = { ...scope };
                    obj["schema"] = e.target.value;

                    setScope(obj);
                  }}
                >
                  <FormControlLabel
                    value="Read"
                    control={
                      <Radio
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                      />
                    }
                    label="Read"
                    labelPlacement="end"
                    checked={isSelected("schema", "Read")}
                    onClick={(e) => {
                      handleRemoveChecked(`schema`, e.target.value);
                    }}
                  />
                  <FormControlLabel
                    value="Write"
                    control={
                      <Radio
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                      />
                    }
                    label="Write"
                    checked={isSelected("schema", "Write")}
                    onClick={(e) => {
                      handleRemoveChecked(`schema`, e.target.value);
                    }}
                    labelPlacement="end"
                  />
                </RadioGroup>
              </div>
            </Box>
          </Box>
          {(!scope["schema"] || scope["schema"] == "") && (
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
                  <RadioGroup
                    row
                    value={scope["alltables"]}
                    onChange={(e) => {
                      let obj = { ...scope };
                      obj["alltables"] = e.target.value;

                      setScope(obj);
                    }}
                  >
                    <FormControlLabel
                      value="Read"
                      control={
                        <Radio
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                        />
                      }
                      label="Read"
                      checked={isSelected("alltables", "Read")}
                      onClick={(e) => {
                        handleRemoveChecked(`alltables`, e.target.value);
                      }}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Write"
                      control={
                        <Radio
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                        />
                      }
                      label="Write"
                      checked={isSelected("alltables", "Write")}
                      onClick={(e) => {
                        handleRemoveChecked(`alltables`, e.target.value);
                      }}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </div>
              </Box>
            </Box>
          )}
          {(!scope["schema"] || scope["schema"] == "") &&
            (!scope["alltables"] || scope["alltables"] == "") && (
              <Box
                sx={{
                  maxHeight: "350px",
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
                          <RadioGroup
                            row
                            value={scope[key]}
                            onChange={(e) => handleScopeChange(e, key)}
                          >
                            <FormControlLabel
                              value={`Read`}
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
                              checked={isSelected(key, "Read")}
                              onClick={(e) => {
                                handleRemoveChecked(key, e.target.value);
                              }}
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value={`Write`}
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
                              checked={isSelected(key, "Write")}
                              onClick={(e) => {
                                handleRemoveChecked(key, e.target.value);
                              }}
                              labelPlacement="end"
                            />
                          </RadioGroup>
                        </div>
                      </Box>
                    </React.Fragment>
                  ))}
              </Box>
            )}
        </Box>
      </Box>
    </div>
  );
}

export default Selectaccessandscope;
Selectaccessandscope.propTypes = {
  scope: PropTypes.any,
  setScope: PropTypes.any,
  alltabledata: PropTypes.any,
};
