import React, { useState } from "react";
import { Button, Dialog, DialogContent, Select, MenuItem, Typography, FormGroup, FormControlLabel, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FunctionsIcon from "@mui/icons-material/Functions";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import variables from '../../assets/styling.scss';
import CloseIcon from '@mui/icons-material/Close';
import './fieldPopupModal.scss'
import NotesIcon from "@mui/icons-material/Notes";
import LinkIcon from '@mui/icons-material/Link';
import NumbersIcon from "@mui/icons-material/Numbers";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FormulaDataType from "./fieldDataType/formulaDataType/formulaDataType";
import LinkDataType from "./fieldDataType/linkDataType/linkDataType";
import LoookupDataType from "./fieldDataType/lookupDataType/lookupDataType";
import NumberDataType from "./fieldDataType/numberDataType/numberDataType";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Joi from "joi";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addColumnrightandleft } from "../../store/table/tableThunk";
import { addColumn } from "../addRow";
import { CustomSwitch } from "../../muiStyles/muiStyles";
import CustomTextField from "../../muiStyles/customTextfield";

export default function FieldPopupModal(props) {
  const params = useParams();
  const [showSwitch, setShowSwitch] = useState(false);
  const [showFormulaField, setShowFormulaField] = useState(false);
  const [showLookupField, setShowLookupField] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNumericOptions, setShowNumericOptions] = useState(false);
  const [showDecimalOptions, setShowDecimalOptions] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [selectValue, setSelectValue] = useState("longtext"); 
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("");
  const [queryByAi, setQueryByAi] = useState(false);


  
  const dispatch = useDispatch();

  const schema = Joi.object({
    fieldName: Joi.string().min(1).max(30).regex(/^[A-Za-z0-9_\s]+$/).custom((value, helpers) => {
      if (parseInt(value, 10) === 0 || parseInt(value, 10) || value === '0') {
        return helpers.error('Field name can not start with integer');
      }
      return value;
    })
    .required()

    .messages({
      "string.min": `$ Column is required`,
      "string.pattern.base": ` column must not contain special characters`,
    }),
  });
  const createLeftorRightColumn = () => {
    if(params?.templateId) return;
    if (
      props?.directionAndId.direction == "left" ||
      props?.directionAndId.direction == "right"
    ) {
      props?.setOpen(false);
      dispatch(
        addColumnrightandleft({
          filterId: params?.filterName,
          fieldName: textValue,
          dbId: params?.dbId,
          tableId: params?.tableName,
          fieldType: selectValue,
          direction: props?.directionAndId.direction,
          position: props?.directionAndId.position,
          metaData: props?.metaData,
          selectedTable,
          selectedFieldName: selectedFieldName,
          linkedValueName,
        })
      );
      setSelectValue("longtext");
      props?.setDirectionAndId({});
    } else {
      var data1 = props?.metaData;
      if (selectValue == "link") {
        data1.foreignKey = {
          fieldId: selectedFieldName,
          tableId: selectedTable,
        };
      }
      if (selectValue == "formula") {
        var queryToSend =
          JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.data_type +
          ` GENERATED ALWAYS AS (${JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.generated?.expression
          }) STORED;`;
      }
      props?.setOpen(false);
      addColumn(
        dispatch,
        params,
        selectValue,
        props?.metaData,
        textValue,
        selectedTable,
        selectedFieldName,
        linkedValueName,
        queryToSend,
        queryByAi.userQuery
      );
      setSelectValue("longtext");
    }
  };
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
    setTextValue(event.target.value.replace(/\s/g,'_'));
  };
  const handleSelectChange = (event) => {
    setShowLinkField(false)
    setShowNumericOptions(false);
    setShowDecimalOptions(false);
    setShowFormulaField(false);
    setShowSwitch(false)
    setSelectedFieldName(false)
    setShowLookupField(false)
    const data1 = props?.metaData;
    delete data1["unique"];
    props?.setMetaData(data1);
    if (event.target.value == "formula") {
      setShowFormulaField(true)
      setSelectValue(event.target.value);
    }
    else if (event.target.value == "email") {
      setShowSwitch(true);
      setSelectValue(event.target.value);
    }
    else if (event.target.value == "link") {
      setShowLinkField(true)
      setSelectValue(event.target.value);
      
    }
    else if (event.target.value == "lookup") {
      setShowLookupField(true)
      setSelectValue(event.target.value);
    }
    else if (event.target.value === 'numeric') {
      setShowSwitch(true);
      setSelectValue('numeric');
      setShowNumericOptions(true);
    }
  
    else if (event.target.value === 'id') {
      setSelectValue('id')
      var data = props?.metaData;
      data.unique = "true"
      props?.setMetaData(data);
    }
    else if (event.target.value === 'decimal' && showNumericOptions) {
     setSelectValue('decimal')
      setShowNumericOptions(true);
      setShowDecimalOptions(true);
      setShowSwitch(true);
    } else if (event.target.value === 'checkbox') {
     setSelectValue('checkbox')
    }
    else if (event.target.value === "singlelinetext") {
      setShowSwitch(true);
     setSelectValue(event.target.value);
    }
    else if (event.target.value === "email" || event.target.value === "phone") {
      setShowSwitch(true);
     setSelectValue(event.target.value);
    }
    else {
      setSelectedFieldName(false)
     setSelectValue(event.target.value);
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
    setSelectedFieldName(false);
    setSelectValue("longtext");
    setTextValue("");
    props?.setMetaData({});
    setQueryByAi(false);
  };
  return (
    <div className="fieldPop-main-container">
      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
       className="fieldPop-Dialog"
      >
         <div className="popupheader field-header">    <Typography className="field-textfield" id="title" variant="h6" component="h2">
            create column
          </Typography><CloseIcon className="field-close-icon" onClick={handleClose}/></div>
        <CustomTextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Field Name"
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.target.value.length >= 1 && e.target.value.length <= 30 && !e.target.value.includes(" ")  ){
              if (e.key === "Enter") {
                handleClose();
                e.stopPropagation();
                e.preventDefault();
                // props?.submitData(false);
                createLeftorRightColumn();
              }
            }
          }}
          className="field-textfield2"
        />
        {errors.fieldName && (
          <Typography variant="body2" sx={{ml:2}} color="error" fontSize={12}>
            {errors.fieldName}
          </Typography>
        )}
        <DialogContent
          className="fieldDialogcontent"
        >
          <Select
            labelId="select-label"
            id="select"
            value={selectValue}
            onChange={handleSelectChange}
            defaultValue="longtext"
            displayEmpty
           className="field-select"
          >
            <MenuItem value="attachment"><InsertDriveFileIcon  fontSize={variables.iconfontsize1}  className="field-select-option" /> Attachment</MenuItem>
            <MenuItem value="checkbox"> <CheckIcon  fontSize={variables.iconfontsize1}   className="field-select-option" />Checkbox</MenuItem>
            <MenuItem value="datetime"><DateRangeIcon  fontSize={variables.iconfontsize1}   className="field-select-option" /> Datetime </MenuItem>
            <MenuItem value="email"><EmailIcon  fontSize={variables.iconfontsize1}   className="field-select-option" />Email</MenuItem>
            <MenuItem value="formula"><FunctionsIcon  fontSize={variables.iconfontsize1}   className="field-select-option" />Formula  </MenuItem>
            <MenuItem value="link"><ArrowForwardIcon  fontSize={variables.iconfontsize1}  className="field-select-option" /> Link </MenuItem>
            <MenuItem value="longtext" defaultValue="longtext"><NotesIcon  fontSize={variables.iconfontsize1}  className="field-select-option" /> Long text </MenuItem>
            <MenuItem value="lookup"><ManageSearchOutlinedIcon  fontSize={variables.iconfontsize1}  className="field-select-option" />Lookup</MenuItem>
            <MenuItem value="multipleselect"><DoneAllIcon  fontSize={variables.iconfontsize1}  className="field-select-option" />Multiple select</MenuItem>
            <MenuItem value="numeric"><NumbersIcon  fontSize={variables.iconfontsize1} className="field-select-option" /> Number</MenuItem>
            <MenuItem value="phone"><LocalPhoneIcon  fontSize={variables.iconfontsize1}  className="field-select-option" />Phone number</MenuItem>
            <MenuItem value="singlelinetext"><TextFormatIcon  fontSize={variables.iconfontsize1} className="field-select-option" />Single line text</MenuItem>
            <MenuItem value="singleselect"><ArrowDropDownCircleIcon  fontSize={variables.iconfontsize1} className="field-select-option" />Single select</MenuItem>
            <MenuItem value="Url"><LinkIcon  fontSize={variables.iconfontsize1}  className="field-select-option" /> URL</MenuItem> 
          </Select>
          <NumberDataType selectValue={selectValue} handleSelectChange={handleSelectChange} metaData={props?.metaData} showNumericOptions={showNumericOptions} showDecimalOptions={showDecimalOptions} />
          {showFormulaField && <FormulaDataType setQueryByAi={setQueryByAi} queryByAi={queryByAi} submitData={createLeftorRightColumn}
          />}
          {showLinkField && <LinkDataType selectedFieldName={selectedFieldName} setSelectedFieldName={setSelectedFieldName} setSelectedTable={setSelectedTable} selectedTable={selectedTable} />}
          {showLookupField && <LoookupDataType linkedValueName={linkedValueName} setLinkedValueName={setLinkedValueName} selectedFieldName={selectedFieldName} setSelectedFieldName={setSelectedFieldName} setSelectedTable={setSelectedTable} selectedTable={selectedTable} key={selectedTable} tableId={props?.tableId} />}
          {showSwitch && (
          <FormGroup className="field-textfield">
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
        <Box className='fieldPop-Dialog '>
            <Box >
        {selectValue !== "formula" || queryByAi ? (
          <Button
            sx={{ textTransform: "none" }}
            className="mui-button"
          
            disabled={
              errors.fieldName ||
              textValue?.length < 1 ||
              textValue?.length > 30 ||
              textValue?.includes(" ")
            }
            onClick={() => {
              handleClose();
              createLeftorRightColumn();
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
  selectValue: PropTypes.any,
  submitData: PropTypes.func,
  setMetaData: PropTypes.func,
  metaData: PropTypes.any,
  setSelectedTable: PropTypes.func,
  selectedTable: PropTypes.any,
  tableId: PropTypes.any,
  directionAndId: PropTypes.any,  
  setDirectionAndId: PropTypes.any 
};