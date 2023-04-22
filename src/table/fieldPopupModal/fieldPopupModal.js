import React, { useState, useEffect } from 'react';
import { Paper, Button, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Typography, Box, Switch,FormGroup,FormControlLabel } from '@mui/material';
import Joi from 'joi';
import LinkDataType from './fieldDataType/linkDatatype.js';
import Autosuggest from "react-autosuggest";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../store/allTable/allTableSelector';
import CheckIcon from '@mui/icons-material/Check';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FunctionsIcon from '@mui/icons-material/Functions';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ReadMoreOutlinedIcon from '@mui/icons-material/ReadMoreOutlined';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import NotesIcon from '@mui/icons-material/Notes';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import NumbersIcon from '@mui/icons-material/Numbers';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PropTypes from 'prop-types';
import LoookupDataType from './fieldDataType/loookupDataType.js';

export default function FieldPopupModal(props) {
 
  const [showSwitch, setShowSwitch] = useState(true);
  const [openn, setOpenn] = useState(false);
  const [userQuery,setUserQuery] = useState(false);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [showLinkField, setShowLinkField] = useState(false)
  // const [openViewDropdown,setOpenViewDropdown] = useState(false)
  const [showLookupField,setShowLookupField] = useState(false)
  const [searchValue, setsearchValue] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showNumericOptions, setShowNumericOptions] = useState(false);
  const [showDecimalOptions , setShowDecimalOptions] = useState(false);
  const [queryResult,setQueryResult] = useState(false)
  const params = useParams();

  useEffect(() => {
    if (AllTableInfo?.tables[params?.tableName] && searchValue.length == 0) {

      let data = AllTableInfo?.tables[params?.tableName]     
      setsearchValue(data)
    }
  }, [AllTableInfo])

  const schema = Joi.object({
    fieldName: Joi.string().min(1).max(15).pattern(/^\S+$/).messages({
      'string.pattern.base': 'Field name should not contain spaces',
    }).required(),
  });
  
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
    } 
   
    else {
      setErrors({});
    }
    props?.setTextValue(event.target.value);
  };

  const selectDecimalValue = (event) => {
    const data= props?.metaData;
    data.decimal = event.target.value
    props?.setDecimalSelectValue(data)
    props?.setDecimalSelectValue(event.target.value)
  }

  const handleSelectChange = (event) => {
    // setOpenViewDropdown(false)
    setShowLinkField(false)
    setShowNumericOptions(false);
    setShowDecimalOptions(false);
    setOpenn(false);
    setShowSwitch(false)
    // props?.setShowUniqueFieldsDropdown(false)
    props?.setSelectedFieldName(false)
    setShowLookupField(false)
    const data1 = props?.metaData;
     delete data1["unique"];
      props?.setMetaData(data1);
    if (event.target.value == "formula") {
      setOpenn(true)
      setShowLookupField(false);
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value == "link") {
      setShowLinkField(true)
      setShowLookupField(false);
      // props?.setShowUniqueFieldsDropdown(true);
      props?.setSelectValue(event.target.value);
      const firstTable = Object.keys(AllTableInfo.tables)[0];
      props?.setSelectedTable(firstTable);
    }
    else if(event.target.value == "lookup"){
      setShowLookupField(true)
      props?.setSelectValue(event.target.value);
      const first = Object.entries(AllTableInfo?.tables[props?.tableId].fields)
      .find(([,field]) => field?.metaData?.foreignKey?.fieldName);
      props?.setSelectedFieldName(first);
      
     
    }
    else if (event.target.value === 'numeric') {
      setShowSwitch(true);
      setShowNumericOptions(true);
      setShowLookupField(false)
    }
    else if (event.target.value === 'integer') {
      props?.setSelectValue('numeric')
      setShowSwitch(true);
      // setOpenLinkedField(false);
     
    }
    else if(event.target.value === 'id'){
      props?.setSelectValue('id')
      var data = props?.metaData;
      data.unique = "true"
      props?.setMetaData(data);
      setShowSwitch(false);
    }
    else if (event.target.value === 'decimal' && showNumericOptions) {
      props?.setSelectValue('numeric')
      setShowNumericOptions(true);
      setShowDecimalOptions(true);
      setShowLookupField(false);
    } else if (event.target.value === 'checkbox') {
      props?.setSelectValue('checkbox')
      setShowLookupField(false);
    } 
    else if(event.target.value === "singlelinetext" || event.target.value === "longtext" ){
        setShowSwitch(true);
        props?.setSelectValue(event.target.value);
    }
    else {
      // props?.setShowUniqueFieldsDropdown(false)
      props?.setSelectedFieldName(false)
      props?.setSelectValue(event.target.value);
      setShowNumericOptions(false);
      setShowDecimalOptions(false);
      setShowLinkField(false)
      setOpenn(false)
      setShowLookupField(false);
    }
  }
console.log(6);
  const handleClose = () => {
    setShowSwitch(true);
    setShowLookupField(false);
    setShowLinkField(false);
    props?.setOpen(false);
    setOpenn(false);
    setShowLinkField(false)
    setUserQuery(false)
    // props?.setShowUniqueFieldsDropdown(false)
    props?.setSelectedFieldName(false)
    props?.setSelectValue("longtext");
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
    setUserQuery(newValue)
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
    placeholder: "ask a query to ai ",
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
          onKeyDown={(e) => {
            if(e.target.value.length >= 1 && e.target.value.length <= 15){
              if (e.key === 'Enter') {
                props.submitData(false);
                // handleClose();
              }
            }               
          }}
          sx={{width:'92%',mr:2,ml:2}}
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
            value={props?.selectValue}
            onChange={handleSelectChange}
            defaultValue = "longtext"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            <MenuItem value="attachment"><AttachFileIcon fontSize="2px" sx={{mr : 1}}/>Attachment</MenuItem>
            <MenuItem value="checkbox"><CheckIcon fontSize="2px" sx={{mr : 1}}/>Checkbox</MenuItem>
            <MenuItem value="createdat"><MoreTimeIcon fontSize="2px" sx={{mr : 1}}/>Created at</MenuItem>
            <MenuItem value="createdby"><PersonPinIcon fontSize="2px" sx={{mr : 1}}/>Created by</MenuItem>
            <MenuItem value="datetime"><DateRangeIcon fontSize="2px" sx={{mr : 1}}/>Datetime</MenuItem>
            <MenuItem value="formula"><FunctionsIcon fontSize="2px" sx={{mr : 1}}/>Formula</MenuItem>
            <MenuItem value="link"><ReadMoreOutlinedIcon fontSize="2px" sx={{mr : 1}}/>Link</MenuItem>
            <MenuItem value="longtext" defaultValue="longtext"><NotesIcon fontSize="2px" sx={{mr : 1}}/>Long text</MenuItem>
            <MenuItem value="lookup"><ManageSearchOutlinedIcon fontSize="2px" sx={{mr : 1}}/>Lookup</MenuItem>
            <MenuItem value="numeric"><NumbersIcon fontSize="2px" sx={{mr : 1}}/>Number</MenuItem>
            <MenuItem value="id"><FormatListNumberedIcon fontSize="2px" sx={{mr : 1}}/>Row id</MenuItem>
            <MenuItem value="singlelinetext"><TextFormatIcon fontSize="2px" sx={{mr : 1}}/>Single line text</MenuItem>
 
          </Select>

          {showNumericOptions && (
              <Select
                labelId="numeric-select-label"
                id="numeric-select"
                value={props.selectValue}
                onChange={(e)=>handleSelectChange(e)}
                defaultValue="value"
                displayEmpty
                sx={{ margin: 1, minWidth: 120 }}
              >
                <MenuItem value="value">Select Type</MenuItem>
                <MenuItem value="integer">integer</MenuItem>
                <MenuItem value="decimal">decimal</MenuItem>
              </Select>
            )}
      {showDecimalOptions && (
        <Select
          labelId="decimal-select-label"
          id="decimal-select"
          value={props.decimalSelectValue}
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


          {openn &&
            (
              <Box>
                <Box>write query in human friendly way to manupulate the column and resultant query will be give to you !!!  and vie versa</Box>
                <Autosuggest
                  autoFocus
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                  renderSuggestionsContainer={renderSuggestionsContainer}
                />
                <Button onClick={() => { props?.submitData(userQuery) }} color="primary" >Ask AI</Button>

                 {props?.queryByAi && <TextField
                  autoFocus
                  margin="dense"
                  id="text-field"
                  label="Query by Ai"
                  type="text"
                  readOnly="readonly"
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


{ showLinkField  && <LinkDataType selectedFieldName = {props?.selectedFieldName}  setSelectedFieldName = {props?.setSelectedFieldName}  setSelectedTable = {props.setSelectedTable} selectedTable={props.selectedTable}/>}
  
 {showLookupField && <LoookupDataType linkedValueName={props?.linkedValueName} setLinkedValueName={props?.setLinkedValueName} selectedFieldName = {props?.selectedFieldName}  setSelectedFieldName = {props?.setSelectedFieldName} setSelectedTable = {props.setSelectedTable} selectedTable={props.selectedTable} tableId={props.tableId}/>}

          {showSwitch && <FormGroup>
            <FormControlLabel control={<Switch checked={props?.metaData?.unique} onClick={(e) => { handleSwitchChange(e) }} />} label="Unique" />
          </FormGroup>}
        </DialogContent>
        <Button onClick={() => { props?.submitData(false) }} color="primary" disabled={errors.fieldName || props?.textValue?.length < 1 ||
          props?.textValue?.length > 20} >Submit</Button>
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
  // setShowUniqueFieldsDropdown:PropTypes.func,
  // showUniqueFieldsDropdown:PropTypes.any,
  setSelectedTable:PropTypes.any,
  selectedTable:PropTypes.any,
  selectedFieldName:PropTypes.any,
  setSelectedFieldName:PropTypes.func,
  setDecimalSelectValue:PropTypes.func,
  decimalSelectValue:PropTypes.any,
  tableId:PropTypes.any,
  linkedValueName:PropTypes.any,
  setLinkedValueName:PropTypes.func
}

