import React, { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import {
  Typography,
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  Box,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import "./optionalParameter.scss"; // Import the CSS file
import { makeStyles } from "@mui/styles";

import variables from "../../../../assets/styling.scss";
import FilterConditionTable from "./filterConditionTable";
import AiFilter from "./AiFilter/Aifilter";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

function OptionalParameter(props) {
  const [fields, setFields] = useState([]);
  const { setValue, parent, db, table, alltabledata, age, setAge } = props;

  const [fieldtosort, setFieldtosort] = useState("");
  const [offset, setOffset] = useState("");
  const textfieldref = useRef();
  const [descending, setDescending] = useState("asc");
  const [selectedFields, setSelectedFields] = useState(["all"]);
  const [selectedRows, setSelectedRows] = useState("");
  const [querymade, setQuerymade] = useState("");
  const handleUse = () => {
    setValue(querymade);
  };

  const useStyles = makeStyles(() => ({
    formControl: {
      "& .MuiInputLabel-root": {
        color: `${variables.basictextcolor}`, // Change the label color here
      },
      "& .MuiSelect-icon": {
        color: `${variables.basictextcolor}`, // Change the icon color here
      },
      "& .MuiSelect-root": {
        borderColor: `${variables.basictextcolor}`, // Change the border color here
        borderRadius: 0,
        height: "36px",
        color: `${variables.basictextcolor}`,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "black", // Change the border color here
        },
      },
    },
    selectEmpty: {
      marginTop: 2,
    },
  }));

  const classes = useStyles();
  useEffect(() => {
    parent != "delete" && tableData();
  }, [db, table]);

  useEffect(() => {
    let queryParams = querymade;

    if (selectedRows.length > 0 && parent == "updaterecord") {
      queryParams += `${queryParams ? " AND " : ""}${selectedRows}`;
    } else if (selectedRows.length > 0) {
      queryParams += `${queryParams ? "&" : ""}filter=${selectedRows}`;
    }
    if (!selectedFields.includes("all")) {
      queryParams += `${queryParams ? "&" : ""}fields=${selectedFields.join(
        ","
      )}`;
    }
    if (fieldtosort) {
      queryParams += `${
        queryParams ? "&" : ""
      }sort=${fieldtosort}='${descending}'`;
    }

    if (age) {
      if (queryParams.includes("limit=")) {
        queryParams = queryParams.replace(/limit=\d+/, `limit=${age}`);
      } else {
        queryParams += `${queryParams ? "&" : ""}limit=${age}`;
      }
    }

    if (offset) {
      if (queryParams.includes("offset=")) {
        queryParams = queryParams.replace(/offset=\d+/, `offset=${offset}`);
      } else queryParams += `${queryParams ? "&" : ""}offset=${offset}`;
    }

    setQuerymade(queryParams);
  }, [fieldtosort, descending, age, offset, selectedFields, selectedRows]);

  const tableData = async () => {
    const myObj = alltabledata[table]?.fields;
    const arr = Object.keys(myObj).map((key) => ({
      name: myObj[key].fieldName,
      content: key,
    }));
    setFields(arr);
  };

  const handleSortChange = (e) => {
    setFieldtosort(e.target.value);
  };

  const handleChange = (e) => {
    const selectedAge = e.target.value;
    if (e.target.value >= 0 && e.target.value <= 2000) {
      setAge(selectedAge.trim());
    }
  };

  const handleChangeOffset = (e) => {
    const off = e.target.value;
    if (e.target.value >= 0 && e.target.value <= 2000) {
      setOffset(off.trim());
    }
  };

  const handleSelectFields = (event) => {
    const { value } = event.target;
    if (value.includes("select_all")) {
      setSelectedFields(["all"]);
    } else {
      const selectedItems = value.filter(
        (item) => item !== "select_all" && item !== "all"
      );
      setSelectedFields(selectedItems);
    }
  };
  const changeQueryMade = (event) => {
    setQuerymade(event.target.value);
  };
  return (
    <div>
      <Box component="div" className="optional-parameter-container">
        {parent === "listrecord" && (
          <Typography
            variant={variables.megatitlevariant}
            fontSize={Number(variables.megatitlesize)}
          >
            Optional parameters
          </Typography>
        )}
        <Typography
          fontWeight={variables.titleweight}
          fontSize={Number(variables.textsize)}
          variant={variables.titlevariant}
          className="titlepaddingtop"
        >
          Where
        </Typography>

        <Typography className="optionalparameterpara">
          {
            '"filter" conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying "filter" conditions, you can refine the results based on specific field values or patterns.\nTo implement a filter condition in the APIs, you can include the "filter" parameter in your API request. The "filter" parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as "AND," "OR," and "NOT" to combine multiple conditions. Additionally, comparison operators like "=", ">", "<," and functions like "FIND()," "LEN()," and "IS_BEFORE()" can be used to specify precise criteria for filtering.'
          }
        </Typography>

        <Typography
          fontWeight={variables.titleweight}
          fontSize={Number(variables.textsize)}
          variant={variables.titlevariant}
          className="titlepaddingtop"
        >
          Examples for where conditions:
        </Typography>
        <div className="aifilterbox">
          <div className="divofapidoccodetypeforurl">
            <Typography className="typographyinsidecodestyle">
              GET `https://dbdash-backend-h7duexlbuq-el.a.run.app/
              <span className="valuescolor">Your_DataBase_ID</span>/
              <span className="valuescolor">Your_Table_ID</span>?{" "}
              <span style={{ color: "#028a0f" }}>
                filter=FieldID1 != `John`
              </span>
              `
            </Typography>
          </div>
        </div>

        <Typography
          className="titlepaddingtop"
          variant={variables.somebiggertextvariant}
        >
          Select the column name and click on the CheckBox to generate API on
          the right side.
        </Typography>
        <div className="aifilterbox">
          <FilterConditionTable
            textfieldref={textfieldref}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            alltabledata={alltabledata}
            table={table}
            db={db}
          />
        </div>

        <Typography
          className="titlepaddingtop"
          variant={variables.somebiggertextvariant}
        >
          Still need help? Ask AI to generate your Filter condition
        </Typography>
        <div className="aifilterbox">
          <AiFilter
            parent={parent}
            textfieldref={textfieldref}
            handleUse={handleUse}
            changeQueryMade={changeQueryMade}
            querymade={querymade}
            setQuerymade={setQuerymade}
            tableName={table}
            dbId={db}
          />
        </div>

        {parent === "listrecord" && (
          <Box>
            <Typography
              fontWeight={variables.titleweight}
              fontSize={Number(variables.textsize)}
              className="titlepaddingtop"
            >
              Fields to show
            </Typography>
            <Typography className="optionalparameterpara">
              {
                'The "Fields to show" parameter in the List Record API enables you to precisely define which fields you wish to receive in the response.\nTo utilize the "Fields to show" parameter, simply include it as a query parameter in your API request. Specify the desired field names or field IDs as a comma-separated list. The API response will only contain the specified fields, excluding all others.\nHere\'s an example of utilizing the "Fields to show" parameter in the API.'
              }
            </Typography>
            <div className="flexandcenter">
              <div className="divofapidoccodetypeforurl">
                <Typography className="typographyinsidecodestyle">
                  GET `https://dbdash-backend-h7duexlbuq-el.a.run.app/
                  <span className="valuescolor">Your_DataBase_ID</span>/
                  <span className="valuescolor">Your_Table_ID</span>?{" "}
                  <span style={{ color: "#028a0f" }}>
                    fields=field1,field2,field3
                  </span>
                  `
                  <br />
                  <span className="errorcolor">-H </span>&apos;{" "}
                  <span className="errorcolor">auth-key: AUTH_TOKEN</span>&apos;
                </Typography>
              </div>
            </div>

            <FormControl
              className={` ${classes.formControl} marginandminwidth`}
            >
              <Select
                labelId="mutiple-select-label"
                multiple
                value={selectedFields}
                MenuProps={MenuProps}
                className="selectbox"
                onChange={handleSelectFields}
                renderValue={(selected) =>
                  selected.includes("all") ? "All Fields" : selected.join(", ")
                }
              >
                <MenuItem value="select_all" className="menu-item-1">
                  <ListItemText>All Fields</ListItemText>
                  <ListItemIcon>
                    <Checkbox checked={selectedFields.includes("all")} />
                  </ListItemIcon>
                </MenuItem>
                {fields.map((field) => (
                  <MenuItem
                    key={field.content}
                    value={field.content}
                    className="blackcolor"
                  >
                    <ListItemText>{field.name}</ListItemText>
                    <ListItemIcon>
                      <Checkbox
                        checked={selectedFields.includes(field.content)}
                      />
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              fontWeight={variables.titleweight}
              fontSize={Number(variables.textsize)}
              className="titlepaddingtop"
            >
              Sort by, Limit and Offset
            </Typography>
            <Typography className="optionalparameterpara">
              {
                'The API provides a list of sort objects to define the order in which records will be arranged. Each sort object should include a field key that indicates the field name for sorting. Additionally, you can optionally include a direction key with a value of either "asc" (ascending) or "desc" (descending) to specify the sorting direction. By default, the sorting direction is set to "asc".\n\nBy default, the limit of records is set to 100. If there are additional records beyond this limit, the response will include an OFFSET value. To retrieve the next page of records, include the offset value as a parameter in your subsequent request. The pagination process will continue until you have reached the end of your table.'
              }
            </Typography>

            <Box className="flexandcenter">
              <FormControl
                className={` ${classes.formControl} marginandminwidth`}
              >
                <InputLabel id="demo-simple-select-helper-label">
                  Sort by
                </InputLabel>
                <Select
                  id="demo-simple-select-helper"
                  value={fieldtosort}
                  label="sort by col"
                  onChange={handleSortChange}
                  className="select-2"
                  MenuProps={MenuProps}
                >
                  <MenuItem key={1} value="" className="menu-item-2">
                    --none--
                  </MenuItem>
                  {fields.map((field) => (
                    <MenuItem
                      key={field.content}
                      value={field.content}
                      sx={{ color: `${variables.basictextcolor}` }}
                    >
                      {field.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {fieldtosort !== "" && (
                <FormControl className={` ${classes.formControl} margin1`}>
                  <Select
                    value={descending}
                    onChange={(e) => setDescending(e.target.value)}
                    className="select-3 "
                  >
                    <MenuItem
                      sx={{ color: `${variables.basictextcolor}` }}
                      value="asc"
                    >
                      Asc
                    </MenuItem>
                    <MenuItem
                      sx={{ color: `${variables.basictextcolor}` }}
                      value="desc"
                    >
                      Desc
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box>
              <FormControl
                className={` ${classes.formControl} marginandminwidth mt0`}
              >
                <TextField
                  id="demo-simple-select-helper"
                  value={age}
                  label="Limit"
                  onChange={handleChange}
                  className="text-field-1"
                  type="number"
                  inputProps={{ pattern: "[0-9]*" }}
                  placeholder="none"
                />
              </FormControl>
            </Box>

            <FormControl
              className={` ${classes.formControl} marginandminwidth `}
            >
              <TextField
                id="demo-simple-select-helper"
                value={offset}
                label="Offset"
                onChange={handleChangeOffset}
                className="text-field-1"
                type="number"
                inputProps={{ pattern: "[0-9]*" }}
                placeholder="none"
              />
            </FormControl>
          </Box>
        )}
      </Box>
    </div>
  );
}

OptionalParameter.propTypes = {
  age: PropTypes.any,
  setAge: PropTypes.func,
  value: PropTypes.any,
  parent: PropTypes.any,
  setValue: PropTypes.func,
  db: PropTypes.any,
  table: PropTypes.any,
  alltabledata: PropTypes.any,
};

export default OptionalParameter;
