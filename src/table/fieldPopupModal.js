import React,{useState} from 'react';
import  PropTypes  from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/system';
export default function FieldPopupModal(props)  {
  const [openn,setOpenn] = useState(false);
const handleTextChange = (event) => {
    props?.setTextValue(event.target.value);
  };
  const handleSelectChange = (event) => {
    if(event.target.value == "generatedcolumn")
    {
      setOpenn(true)
      props?.setSelectValue(event.target.value);
    }else
    {
      props?.setSelectValue(event.target.value);
      setOpenn(false)
    }
  };
  const handleClose = () => {
    props?.setOpen(false);
    setOpenn(false);
    props?.setSelectValue("Text");
  };


  return (
    <div>
      
      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx ={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}
      >
        <DialogTitle id="form-dialog-title">Create Column</DialogTitle>
        <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Field Name"
            type="text"
            // value={props?.textValue}
            onChange={handleTextChange}
            fullWidth
          />
        <DialogContent sx={{width: 400,
    padding: 2}}>
          
          <Select
            labelId="select-label"
            id="select"
            value={props.selectValue}
            onChange={handleSelectChange}
            defaultValue	 ="text"
            displayEmpty
            sx={{margin:1,
              minWidth: 120,}}
          >
            <MenuItem value="Text" >text</MenuItem>
            <MenuItem value="varchar">varchar</MenuItem>
            <MenuItem value="integer">integer</MenuItem>
            <MenuItem value="checkbox">checkbox</MenuItem>
            <MenuItem value="datetime">datetime</MenuItem>
            <MenuItem value="createdby">created By</MenuItem>
            <MenuItem value="createdat">created At</MenuItem>
            <MenuItem value="generatedcolumn">generated column</MenuItem>
            <MenuItem value="attachment">attachment</MenuItem>
          </Select>

         {  openn && 

         (
          <Box>
            <Box>write query in human friendly way to manupulate the column and resultand query will be give to you !!!  and vie versa</Box>
               <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Enter the query"
            type="text"
            // value={props?.textValue}
            placeholder={"multiply column speed and distance"}
           onChange={(e)=>{
            props?.setQuery(e.target.value)
           }}
            fullWidth
          />
          <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Text Field"
          type="text"
          placeholder={"resultant query"}
          // value={props?.textValue}
          // onChange={handleTextChange}
         onChange={(e)=>{
          props?.setQuery(e.target.value)
         }}
          fullWidth
        /> 
          </Box>
        
        )
          }

        </DialogContent>
        <Button onClick={props?.submitData} color="primary" >Submit</Button>
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
    setQuery:PropTypes.func
}

