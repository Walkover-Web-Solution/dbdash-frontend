import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import  PropTypes  from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';




const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    width: 400,
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));


export default function FieldPopupModal(props)  {
    // console.log("popup",props)
  const classes = useStyles();
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
        className={classes.modal}
      >
        <DialogTitle id="form-dialog-title">Create Column</DialogTitle>
        <DialogContent className={classes.dialog}>
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
            className={classes.formControl}
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

