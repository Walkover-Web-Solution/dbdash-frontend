import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';

import {
  
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Typography
} from '@mui/material';
import { duplicateDb } from '../../api/dbApi';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import {createDbThunk} from "../../store/database/databaseThunk";
import { makeStyles } from '@mui/styles';
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
  const useStyles = makeStyles({
    dialogPaper: {
      borderRadius: 0,
    },
  });
  const classes = useStyles();

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
      <div className="popupheader"  style={{marginBottom:'5%'}}>    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
      duplicate <strong>{props?.db}</strong>
          </Typography><CloseIcon sx={{'&:hover': { cursor: 'pointer' }}} onClick={handleClose}/></div>

        <DialogContent sx={{display:'flex',flexDirection:'column',justifyContent:'left',p:0,pl:2,pr:1,py:1}} >
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
           {/* <Typography sx={{display:"flex", alignItems:"center", justifyContent:"center"}}onClick={()=>{setDuplicateRecords(!duplicateRecords)}} variant="contained" color="primary">
              Duplicate records {duplicateRecords ? <CheckBoxIcon fontSize='small'/> : <CheckBoxOutlineBlankIcon fontSize='small'/>}
            </Typography> */}
        </DialogContent>
        <Box sx={{ display: "flex", m:2,mt:0,justifyContent: "space-between" }}>

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