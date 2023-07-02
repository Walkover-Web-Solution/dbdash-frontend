import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { duplicateDb } from '../../api/dbApi';
import { toast } from "react-toastify";

const DuplicateDbPopup = (props) => {
  const [databaseName, setDatabaseName] = useState('');
const [duplicateRecords,setDuplicateRecords]=useState(false);
  
  const handleClose = () => {
    props?.setOpen(false);
  };

  const handleDuplicate = async () =>  {
    const userId = localStorage.getItem("userid");
    const data = {
      user_id: userId,
      name: name,
    };
     await duplicateDb(props?.dbId,data);
    toast.success('Database created successfully!');
    handleClose();
  };

  const handleChange = (event) => {
    setDatabaseName(event.target.value);
  };

  return (
    <div onClick={(e)=>{
      e.preventDefault();
      e.stopPropagation();
    }}>
      
      <Dialog open={props?.open} onClose={handleClose}>
        <DialogTitle>Duplicate {props?.db}</DialogTitle>
        <DialogContent>
          <DialogContentText> 
            Enter the name for the duplicated database:
          </DialogContentText>
          <TextField
            autoFocus
            
            margin="dense"
            label="Database Name"
            type="text"
            value={databaseName}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <Box sx={{alignContent:'center'}}>
        <Typography  onClick={()=>{setDuplicateRecords(!duplicateRecords)}} variant="contained" color="primary">
            Duplicate records {duplicateRecords?<CheckBoxIcon fontSize='4px'/>:<CheckBoxOutlineBlankIcon fontSize='4px'/>}
          </Typography>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDuplicate} variant="contained" color="primary">
            Duplicate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DuplicateDbPopup;
DuplicateDbPopup.propTypes={
  open:PropTypes.any,
  setOpen:PropTypes.any,
  dbId:PropTypes.any,
  db:PropTypes.any

}