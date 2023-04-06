import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from "react-autosuggest";
import { Paper, Button, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Typography, Box, Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getAllTableInfo } from '../store/allTable/allTableSelector';
import Joi from 'joi';
import { useParams } from 'react-router';

export default function FieldPopupModal(props) {
  const [openn, setOpenn] = useState(false);
  const [userQuery,setUserQuery] = useState(false);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [lookupField, setLookupField] = useState(false)
  const [searchValue, setsearchValue] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const params = useParams();

  useEffect(() => {
    if (AllTableInfo?.tables[params?.tableName] && searchValue.length == 0) {

      let data = AllTableInfo?.tables[params?.tableName]     
      setsearchValue(data)
    }
  }, [AllTableInfo])

  const schema = Joi.object({
    fieldName: Joi.string().min(3).max(15).required(),
  });
  
  const [queryResult,setQueryResult] = useState(false)
  useEffect(()=>{
    var query  = props?.queryByAi
    try {
      query = JSON.parse(query)?.add_column?.new_column_name?.generated?.expression
    } catch (err) {
      query = "enter valid query"
    }
    setQueryResult(query);

  },[props?.queryByAi])

  const handleSwitchChange = (event) => {
    var data = props?.metaData;
    data.unique = event.target.checked
    props?.setMetaData(data);
  };

  const handleTextChange = (event) => {
    const { error } = schema.validate({ fieldName: event.target.value });
    if (error) {
      setErrors({ fieldName: error.details[0].message });
    } else {
      setErrors({});
    }
    props?.setTextValue(event.target.value);
  };

  const handleSelectChange = (event) => {
    
    if (event.target.value == "generatedcolumn") {
      setOpenn(true)
      setLookupField(false)
      props?.setShowFieldsDropdown(false)
      props?.setSelectedFieldName(false)
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value == "lookup") {
      setLookupField(true)
      setOpenn(false)
      props?.setSelectValue(event.target.value);
    }
    else {
      props?.setShowFieldsDropdown(false)
      props?.setSelectedFieldName(false)
      props?.setSelectValue(event.target.value);
      setLookupField(false)
      setOpenn(false)
    }
  };

  const handleClose = () => {
    props?.setOpen(false);
    setOpenn(false);
    setLookupField(false)
    setUserQuery(false)
    props?.setShowFieldsDropdown(false)
    props?.setSelectedFieldName(false)
    props?.setSelectValue("Text");
    props?.setTextValue("");
    props?.setMetaData({});
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value) => {
    const inputValues = value?.trim()?.toLowerCase()?.split(" ");
    const inputLength = inputValues.length;
    const searchTerm = inputValues[inputLength - 1];
   
    let response = [];
    if( searchTerm.length !== 0){
     response = Object.entries(searchValue.fields).filter((lang) => lang[1]?.fieldName?.toLowerCase()?.startsWith(searchTerm))
    }
      return response
  };

  const getSuggestionValue = (suggestion) => {

    const newVal = value?.split(" ");
    let newdata = "";
    for (let i = 0; i < newVal.length - 1; i++) {
      newdata += newVal[i] + " ";
    }
    newdata = newdata ? newdata + suggestion[1].fieldName : suggestion[1]?.fieldName;
    return newdata;
  };

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion) => <MenuItem>{suggestion[1].fieldName}</MenuItem>;

  const onChange = (event, { newValue }) => {
    let addVal = newValue;
    setValue(addVal);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type a programming language",
    value,
    onChange,
    style: { width: "360px", height: "50px", border: '1px solid black', borderRadius: "5px", marginTop: 10 }
  };


  const renderSuggestionsContainer = (options) => {
    const { containerProps, children } = options;
    return (
      <Paper {...containerProps} square style={{ maxHeight: "100px", overflowY: "auto" }}>
        {children}
      </Paper>
    );
  };


  return (
    <div>

      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DialogTitle id="form-dialog-title">Create Column</DialogTitle>
        <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Field Name"
          type="text"
          value={props.textValue}
          onChange={handleTextChange}
        />

        {errors.fieldName && (
          <Typography variant="body2" color="error" fontSize={12}>
            {errors.fieldName}
          </Typography>)}

        <DialogContent sx={{
          width: 400,
          padding: 2
        }}>

          <Select
            labelId="select-label"
            id="select"
            value={props.selectValue}
            onChange={handleSelectChange}
            defaultValue	 ="Text"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            <MenuItem value="Text" >text</MenuItem>
            <MenuItem value="varchar">varchar</MenuItem>
            <MenuItem value="numeric">number</MenuItem>
            <MenuItem value="checkbox">checkbox</MenuItem>
            <MenuItem value="datetime">datetime</MenuItem>
            <MenuItem value="createdby">created By</MenuItem>
            <MenuItem value="createdat">created At</MenuItem>
            <MenuItem value="generatedcolumn">generated column</MenuItem>
            <MenuItem value="attachment">attachment</MenuItem>
            <MenuItem value="lookup">lookup</MenuItem>
          </Select>

          {openn &&
            (
              <Box>
                <Box>write query in human friendly way to manupulate the column and resultant query will be give to you !!!  and vie versa</Box>
                {/* <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Enter the query"
            type="text"
            // value={props?.textValue}
            placeholder={"multiply column speed and distance"}
           onChange={(e)=>{
            setUserQuery(e.target.value)
           }}
            fullWidth
          /> */}

                <Autosuggest
                  autoFocus
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                  renderSuggestionsContainer={renderSuggestionsContainer}
                  onChange={(e)=>{
                    setUserQuery(e.target.value)
                   }}
                />
                <Button onClick={() => { props?.submitData(userQuery) }} color="primary" >next</Button>

                 {props?.queryByAi && <TextField
                  autoFocus
                  margin="dense"
                  id="text-field"
                  label="Query by Ai"
                  type="text"
                  // onChange={(e) => {
                  //   props?.setQueryByAi(e.target.value)
                  // }}
                  placeholder={"resultant query"}
                  value={queryResult}
                  fullWidth
                />} 
              </Box>

            )
          }
          {lookupField && <Select
            labelId="select-label"
            id="select"
            value={props?.selectedTable}
            onChange={(event) => {
              console.log("SDFSDFSD", event.target.value)
              props?.setSelectedTable(event.target.value);
              props?.setShowFieldsDropdown(true)
            }}
            defaultValue={props?.selectedTable}
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            {AllTableInfo?.tables && Object.entries(AllTableInfo?.tables).map((table, index) => (
              <MenuItem key={index} value={table[0]}>{table[1]?.tableName}</MenuItem>
            ))}
          </Select>}
          {props?.showFieldsDropdown && (<Select
            labelId="select-label"
            id="select"
            value={props?.selectedFieldName}
            defaultValue="fields"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
            onChange={(e) => props?.setSelectedFieldName(e.target.value)}
          >
            {
              Object.entries(AllTableInfo.tables[props?.selectedTable]?.fields)?.filter((fields) => {
                if (fields[1]?.metaData?.unique) {
                  return fields;
                }
              })
                .map((fields) =>
                (
                  <MenuItem key={fields[0]} value={fields[0]}>
                    {fields[1]?.fieldName}
                  </MenuItem>
                ))
            }
          </Select>
          )}

          <FormGroup>
            <FormControlLabel control={<Switch checked={props?.metaData?.unique} onClick={(e) => { handleSwitchChange(e) }} />} label="Unique" />
          </FormGroup>
        </DialogContent>
        <Button onClick={() => { props?.submitData(false) }} color="primary" disabled={errors.fieldName || props?.textValue?.length < 3 ||
          props?.textValue?.length > 15} >Submit</Button>
      </Dialog>
    </div>
  );
}

FieldPopupModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  setOpenPopup: PropTypes.func,
  openPopup: PropTypes.bool,
  textValue: PropTypes.any,
  selectValue: PropTypes.any,
  setTextValue: PropTypes.func,
  setSelectValue: PropTypes.func,
  submitData: PropTypes.func,
  queryByAi: PropTypes.any,
  setQueryByAi: PropTypes.func,
  setMetaData: PropTypes.func,
  metaData: PropTypes.any,
  setShowFieldsDropdown:PropTypes.func,
  showFieldsDropdown:PropTypes.any,
  setSelectedTable:PropTypes.func,
  selectedTable:PropTypes.any,
  selectedFieldName:PropTypes.any,
  setSelectedFieldName:PropTypes.func
}

