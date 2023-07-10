import React, { useState } from "react";
import { Button, Dialog, DialogContent, TextField, Select, MenuItem, Typography, Switch, FormGroup, FormControlLabel, Box } from "@mui/material";
// import { useSelector } from "react-redux";
// import { getAllTableInfo } from "../../store/allTable/allTableSelector";
import CheckIcon from "@mui/icons-material/Check";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FunctionsIcon from "@mui/icons-material/Functions";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import CloseIcon from '@mui/icons-material/Close';

import NotesIcon from "@mui/icons-material/Notes";
import { withStyles } from '@mui/styles';
import LinkIcon from '@mui/icons-material/Link';
// import PersonPinIcon from "@mui/icons-material/PersonPin";
// import MoreTimeIcon from "@mui/icons-material/MoreTime";
import NumbersIcon from "@mui/icons-material/Numbers";
// import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
// import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FormulaDataType from "./fieldDataType/formulaDataType";
import LinkDataType from "./fieldDataType/linkDataType";
import LoookupDataType from "./fieldDataType/lookupDataType";
import NumberDataType from "./fieldDataType/numberDataType";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Joi from "joi";
import PropTypes from "prop-types";
const styles = {
  root: {
    width: 40,
    height: 20,

    padding: 0,
  
    display: 'flex',
    backgroundColor: 'transparent',
  },
  switchBase: {
    padding: 2,
    
    '&$checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + $track': {
        opacity: 0.7,
        backgroundColor: '006400',
      },
    },
  },
  thumb: {
    width: 16,
    height: 16,
    boxShadow: 'none',
  },
  track: {
    width: '100%',
    height: 17,
    borderRadius: 10,
    borderColor: 'black',
    opacity: 0.7,
    backgroundColor: '#000',
  },
  checked: {},
};

// Create a custom Switch component with the applied styles
const CustomSwitch = withStyles(styles)(Switch);

export default function FieldPopupModal(props) {
  // const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [showSwitch, setShowSwitch] = useState(false);
  const [showFormulaField, setShowFormulaField] = useState(false);
  const [showLookupField, setShowLookupField] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNumericOptions, setShowNumericOptions] = useState(false);
  const [showDecimalOptions, setShowDecimalOptions] = useState(false);


  const schema = Joi.object({
    fieldName: Joi.string().min(1).max(30).pattern(/^[^\s]+$/).required()
    .messages({
      "string.min": `$ Column is required`,
      "string.pattern.base": ` column must not contain spaces`,
    }),
  });

  const handleSwitchChange = (event) => {
    var data = props?.metaData;
    data.unique = event.target.checked;
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
    setShowLinkField(false)
    setShowNumericOptions(false);
    setShowDecimalOptions(false);
    setShowFormulaField(false);
    setShowSwitch(false)
    props?.setSelectedFieldName(false)
    setShowLookupField(false)
    const data1 = props?.metaData;
    delete data1["unique"];
    props?.setMetaData(data1);

    if (event.target.value == "formula") {
      setShowFormulaField(true)
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value == "email") {
      setShowSwitch(true);
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value == "link") {
      setShowLinkField(true)
      props?.setSelectValue(event.target.value);
      // const firstTable = Object.keys(AllTableInfo.tables)[0];
      // props?.setSelectedTable(firstTable);
    }
    else if (event.target.value == "lookup") {
      setShowLookupField(true)
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value === 'numeric') {
      setShowSwitch(true);
      props?.setSelectValue('numeric');

      setShowNumericOptions(true);
    }
  
    else if (event.target.value === 'id') {
      props?.setSelectValue('id')
      var data = props?.metaData;
      data.unique = "true"
      props?.setMetaData(data);
    }
    else if (event.target.value === 'decimal' && showNumericOptions) {
      props?.setSelectValue('decimal')
      setShowNumericOptions(true);
      setShowDecimalOptions(true);
      setShowSwitch(true);
    } else if (event.target.value === 'checkbox') {
      props?.setSelectValue('checkbox')
    }
    else if (event.target.value === "singlelinetext") {
      setShowSwitch(true);

      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value === "email" || event.target.value === "phone") {
      setShowSwitch(true);
      props?.setSelectValue(event.target.value);
    }
    // else if (event.target.value === "singleselect" || event.target.value === "multipleselect") {
    //   props?.setSelectValue(event.target.value);
    // }
    else {
      props?.setSelectedFieldName(false)
      props?.setSelectValue(event.target.value);
      setShowNumericOptions(false);
      setShowDecimalOptions(false);
      setShowLinkField(false)
      setShowFormulaField(false)
      setShowLookupField(false);
    }
  }

  const handleClose = () => {
    setShowLinkField(false);
    setShowLookupField(false);
    props?.setOpen(false);
    setShowFormulaField(false);
    setShowLinkField(false);
    setShowNumericOptions(false);
    setShowDecimalOptions(false);
    setShowSwitch(false);
    props?.setSelectedFieldName(false);
    props?.setSelectValue("longtext");
    props?.setTextValue("");
    props?.setMetaData({});
    props?.setQueryByAi(false);
  };

  return (
    <div style={{borderRadius:0}}>
      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
         <div className="popupheader" style={{marginBottom:'5%'}}>    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
            create column
          </Typography><CloseIcon sx={{'&:hover': { cursor: 'pointer' }}} onClick={handleClose}/></div>

        <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Field Name"
          type="text"
          value={props?.textValue}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.target.value.length >= 1 && e.target.value.length <= 30 && !e.target.value.includes(" ")  ){
              if (e.key === "Enter") {

                handleClose();
                e.stopPropagation();
                e.preventDefault();
                props?.submitData(false);
              }
            }
          }}
          sx={{ width: "92%", mr: 2, ml: 2 }}
        />

        {errors.fieldName && (
          <Typography variant="body2" color="error" fontSize={12}>
            {errors.fieldName}
          </Typography>
        )}

        <DialogContent
          sx={{
            width: 400,
            p:2,
            pt:0
          }}
        >
          <Select
            labelId="select-label"
            id="select"
            value={props?.selectValue}
            onChange={handleSelectChange}
            defaultValue="longtext"
            displayEmpty
            sx={{
              margin: 2,
              ml:0,
              minWidth: 120,
            }}
          >
            <MenuItem value="attachment"><InsertDriveFileIcon fontSize="2px" sx={{ mr: 1 }} /> Attachment</MenuItem>
            <MenuItem value="checkbox"> <CheckIcon fontSize="2px" sx={{ mr: 1 }} />Checkbox</MenuItem>
            {/* <MenuItem value="createdat"> <MoreTimeIcon fontSize="2px" sx={{ mr: 1 }} />Created at</MenuItem>
            <MenuItem value="createdby"><PersonPinIcon fontSize="2px" sx={{ mr: 1 }} />Created by </MenuItem> */}
            <MenuItem value="datetime"><DateRangeIcon fontSize="2px" sx={{ mr: 1 }} /> Datetime </MenuItem>
            <MenuItem value="email"><EmailIcon fontSize="2px" sx={{ mr: 1 }} />Email</MenuItem>
            <MenuItem value="formula"><FunctionsIcon fontSize="2px" sx={{ mr: 1 }} />Formula  </MenuItem>
            <MenuItem value="link"><ArrowForwardIcon fontSize="2px" sx={{ mr: 1 }} /> Link </MenuItem>
            <MenuItem value="longtext" defaultValue="longtext"><NotesIcon fontSize="2px" sx={{ mr: 1 }} /> Long text </MenuItem>
            <MenuItem value="lookup"><ManageSearchOutlinedIcon fontSize="2px" sx={{ mr: 1 }} />Lookup</MenuItem>
            <MenuItem value="multipleselect"><DoneAllIcon fontSize="2px" sx={{ mr: 1 }} />Multiple select</MenuItem>
            <MenuItem value="numeric"><NumbersIcon fontSize="2px" sx={{ mr: 1 }} /> Number</MenuItem>
            <MenuItem value="phone"><LocalPhoneIcon fontSize="2px" sx={{ mr: 1 }} />Phone number</MenuItem>
            <MenuItem value="singlelinetext"><TextFormatIcon fontSize="2px" sx={{ mr: 1 }} />Single line text</MenuItem>
            <MenuItem value="singleselect"><ArrowDropDownCircleIcon fontSize="2px" sx={{ mr: 1 }} />Single select</MenuItem>
            <MenuItem value="Url"><LinkIcon fontSize="2px" sx={{ mr: 1 }} /> URL</MenuItem> 

          </Select>

          <NumberDataType selectValue={props?.selectValue} handleSelectChange={handleSelectChange} metaData={props?.metaData} showNumericOptions={showNumericOptions} showDecimalOptions={showDecimalOptions} />

          {showFormulaField && <FormulaDataType setQueryByAi={props?.setQueryByAi} queryByAi={props?.queryByAi} submitData={props?.submitData}
          />}

          {showLinkField && <LinkDataType selectedFieldName={props?.selectedFieldName} setSelectedFieldName={props?.setSelectedFieldName} setSelectedTable={props?.setSelectedTable} selectedTable={props?.selectedTable} />}

          {showLookupField && <LoookupDataType linkedValueName={props?.linkedValueName} setLinkedValueName={props?.setLinkedValueName} selectedFieldName={props?.selectedFieldName} setSelectedFieldName={props?.setSelectedFieldName} setSelectedTable={props?.setSelectedTable} selectedTable={props?.selectedTable} key={props.selectedTable} tableId={props?.tableId} />}

          {showSwitch && (
          <FormGroup sx={{ml:2}}>
          <FormControlLabel
            control={
              <CustomSwitch
              
                checked={props?.metaData?.unique}
                onClick={(e) => {
                  handleSwitchChange(e);
                }}
              />
            }
            label="Unique"
          />
        </FormGroup>
        
          )}
        </DialogContent>
        <Box sx={{ display: "flex", m:2,justifyContent: "space-between" }}>
            <Box >
        {props?.selectValue !== "formula" || props?.queryByAi ? (
          <Button
            sx={{ textTransform: "none" }}
            className="mui-button"
          
            disabled={
              errors.fieldName ||
              props?.textValue?.length < 1 ||
              props?.textValue?.length > 30 ||
              props?.textValue?.includes(" ")

            }
            onClick={() => {
              handleClose();
              props?.submitData(false);
            }}
          >
            Create Column
          </Button>
        ) : null}
        </Box>
        </Box>
      </Dialog>
    </div>
  );
}

FieldPopupModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  textValue: PropTypes.any,
  selectValue: PropTypes.any,
  setTextValue: PropTypes.func,
  setSelectValue: PropTypes.func,
  submitData: PropTypes.func,
  queryByAi: PropTypes.any,
  setQueryByAi: PropTypes.func,
  setMetaData: PropTypes.func,
  metaData: PropTypes.any,
  setSelectedTable: PropTypes.func,
  selectedTable: PropTypes.any,
  selectedFieldName: PropTypes.any,
  setSelectedFieldName: PropTypes.func,
  tableId: PropTypes.any,
  linkedValueName: PropTypes.any,
  setLinkedValueName: PropTypes.func,
};