import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import './duplicateDbPopup.scss'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Typography
} from '@mui/material';
import { duplicateDb } from '../../../api/dbApi';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import {createDbThunk} from "../../../store/database/databaseThunk";
import { dublicateDbPopupStyle } from '../../../muiStyles/muiStyles';
import CustomTextField from '../../../muiStyles/customTextfield';
const DuplicateDbPopup = (props) => {
  const [databaseName, setDatabaseName] = useState(props?.db+"_copy");
  // const [duplicateRecords,setDuplicateRecords]=useState(false);
  const dispatch = useDispatch()
  const handleClose = () => {
    props?.setOpen(false);
  };

  const handleDuplicate = async () =>  {
    const data = {
      name: databaseName,
    };
    handleClose();
    const duplicatedb =  await duplicateDb(props?.dbId,data);
     dispatch(createDbThunk({
      data: duplicatedb?.data?.data
    })).then(() => {
    });
    toast.success('Database created successfully!');
  };
  
  const classes = dublicateDbPopupStyle();

  const handleChange = (event) => {
    setDatabaseName(event.target.value);
  };

  return (
    <div onClick={(e)=>{
      e.preventDefault();
      e.stopPropagation();
    }}>
      
      <Dialog 
       classes={{
        paper: classes.dialogPaper, // Apply custom styles to the dialog paper
      }}
      open={props?.open} onClose={handleClose}>
      <div className="popupheader dbduplicate-container">    <Typography className="dbduplicate-typography" id="title" variant="h6" component="h2">
      duplicate <strong>{props?.db}</strong>
          </Typography><CloseIcon className='dbduplicate-close-icon' onClick={handleClose}/></div>

        <DialogContent className='dbduplicate-dailog-text' >
          <DialogContentText> 
            Enter the name for the duplicated database:
          </DialogContentText>
          <CustomTextField
            autoFocus
            
            margin="dense"
            label="Database Name"
            type="text"
            value={databaseName}
            onChange={handleChange}
            fullWidth
          />
           {/* <Typography sx={{display:"flex", alignItems:"center", justifyContent:"center"}}onClick={()=>{setDuplicateRecords(!duplicateRecords)}} variant="contained" color="primary">
              Duplicate records {duplicateRecords ? <CheckBoxIcon fontSize='small'/> : <CheckBoxOutlineBlankIcon fontSize='small'/>}
            </Typography> */}
        </DialogContent>
        <Box className='duplicat-button'>

          <Button onClick={handleDuplicate} variant="contained" className="mui-button">
            Duplicate
          </Button>
        </Box>
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