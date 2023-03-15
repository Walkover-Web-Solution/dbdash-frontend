import React from 'react';
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







export default function FieldPopupModal(props)  {
    // console.log("popup",props)
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

const handleTextChange = (event) => {
    props?.setTextValue(event.target.value);
  };
  const handleSelectChange = (event) => {
    props?.setSelectValue(event.target.value);
  };
  const handleClose = () => {
    props?.setOpen(false);
  };
 

//   const handlesubmit =()=>{
   

//     props?.setOpen(false)
//   }
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
        <DialogContent sx={{width: 400,
    padding: 2}}>
          <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Text Field"
            type="text"
            value={props.textValue}
            onChange={handleTextChange}
            fullWidth
          />
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
            {/* <MenuItem value="">Select an option</MenuItem> */}
            <MenuItem value="text" >text</MenuItem>
            <MenuItem value="varchar">varchar</MenuItem>
            <MenuItem value="integer">integer</MenuItem>
          </Select>

        </DialogContent>
        <Button onClick={props?.submitData} color="primary">Submit</Button>
      </Dialog>
    </div>
  );
}
FieldPopupModal.propTypes ={
    setOpen:PropTypes.func,
    open:PropTypes.func,
    textValue:PropTypes.any,
    selectValue:PropTypes.any,
    setTextValue:PropTypes.func,
    setSelectValue:PropTypes.func,
    submitData:PropTypes.func
}

