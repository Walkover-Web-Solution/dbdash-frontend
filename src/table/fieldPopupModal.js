import React, { useState } from 'react';
  import  PropTypes  from 'prop-types';
  import {Button,Dialog,DialogTitle,DialogContent,TextField,Select,MenuItem} from '@mui/material';
// import { log } from 'console';
  export default function FieldPopupModal(props) {
    // console.log("props.numericSelectValue",props.numericSelectValue)
    // console.log("props.fdds",props.setNumericSelectValue)
    console.log("first", props?.selectValue)
    const handleTextChange = (event) => {
      props?.setTextValue(event.target.value);
    };
    // const[showDecimalOptions,setShowDecimalOptions] = useState(false)
  
    const [showNumericOptions, setShowNumericOptions] = useState(false);
    const [showDecimalOptions , setShowDecimalOptions] = useState(false);
    const handleSelectChange = (event) => {
      props?.setSelectValue(event.target.value);
      // props?.setSelectDecimal(event.target.value);
      if (event.target.value === 'numeric') {
        setShowNumericOptions(true);
      } else {
        setShowNumericOptions(false);
      }
      if (event.target.value === 'decimal') {
        setShowNumericOptions(true);
        setShowDecimalOptions(true);
      } else {
        setShowDecimalOptions(false);
      }
    };
  
    const handleClose = () => {
      props?.setOpen(false);
    };
  
    const isInputEmpty = props?.textValue.trim() === '';
  
    return (
      <div>
        <Dialog
          open={props?.open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DialogTitle id="form-dialog-title">Create Column</DialogTitle>
          <DialogContent sx={{ width: 400, padding: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="text-field"
              label="Text Field"
              type="text"
              onChange={handleTextChange}
              fullWidth
            />
            <Select
              labelId="select-label"
              id="select"
              value={props.selectValue}
              onChange={handleSelectChange}
              defaultValue="text"
              displayEmpty
              sx={{ margin: 1, minWidth: 120 }}
            >
              <MenuItem value="text">text</MenuItem>
              <MenuItem value="varchar">varchar</MenuItem>
              <MenuItem value="numeric">number</MenuItem>
              <MenuItem value="checkbox">checkbox</MenuItem>
              <MenuItem value="datetime">datetime</MenuItem>
              <MenuItem value="createdby">created By</MenuItem>
              <MenuItem value="createdat">created At</MenuItem>
              <MenuItem value="attachment">attachment</MenuItem>
            </Select>
            {showNumericOptions && (
              <Select
                labelId="numeric-select-label"
                id="numeric-select"
                value={props.selectValue}
                onChange={handleSelectChange}
                defaultValue="integer"
                displayEmpty
                sx={{ margin: 1, minWidth: 120 }}
              >
                <MenuItem value="integer">integer</MenuItem>
                <MenuItem value="decimal">decimal</MenuItem>
              </Select>
            )}
      {showDecimalOptions && (
        <Select
          labelId="decimal-select-label"
          id="decimal-select"
          value={props.decimalSelectValue}
          onChange={props.setDecimalSelectValue}
          defaultValue="1"
          displayEmpty
          sx={{ margin: 1, minWidth: 120 }}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
        </Select>
      )}
            
          </DialogContent>
          <Button onClick={props?.submitData} color="primary" disabled={isInputEmpty}>
            Submit
          </Button>
        </Dialog>
      </div>
    );
  }
  
  FieldPopupModal.propTypes ={
      setOpen:PropTypes.func,
      open:PropTypes.bool,
      setOpenPopup:PropTypes.func,
      openPopup:PropTypes.bool,
      textValue:PropTypes.any,
      selectValue:PropTypes.any,
      setTextValue:PropTypes.func,
      setSelectValue:PropTypes.func,
      submitData:PropTypes.func,
      setNumericSelectValue:PropTypes.any,
      numericSelectValue:PropTypes.any,
      decimalSelectValue:PropTypes.any,
      setDecimalSelectValue:PropTypes.func
  }