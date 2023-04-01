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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function FieldPopupModal(props)  {
  console.log(props)
  const [openn,setOpenn] = useState(false);
  const [userQuery,setUserQuery] = useState(false);
  const handleSwitchChange = (event) => {
    props?.setUnique(event.target.checked);
  };
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
            <MenuItem value="numeric">number</MenuItem>
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
            <Box>write query in human friendly way to manupulate the column and resultant query will be give to you !!!  and vie versa</Box>
               <TextField
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
          />
          <Button onClick={()=>{props?.submitData(userQuery)}} color="primary" >next</Button>

          { props?.queryByAi && <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Query by Ai"
          type="text"
          onChange={(e)=>{
            props?.setQueryByAi(e.target.value)
           }}
          placeholder={"resultant query"}
          value={props?.queryByAi && props?.queryByAi?.split("(")[1].split(")")[0]}
          fullWidth
        /> }
          </Box>
        
        )
          }

          <FormGroup>
            <FormControlLabel control={<Switch checked={props?.unique}  onClick={(e)=>{handleSwitchChange(e)}}/>} label="Unique" />
          </FormGroup>
        </DialogContent>
        <Button onClick={()=>{props?.submitData(false)}}color="primary" >Submit</Button>
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
    queryByAi:PropTypes.any,
    setQueryByAi:PropTypes.func,
    setUnique:PropTypes.func,
    unique:PropTypes.any
}

