import React from 'react';
import {Box, Button,Dialog,DialogContent, Typography} from '@mui/material';
import { PropTypes } from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

export default function AlertPopup(props) {

  const handleClose = (e) => {
    e.stopPropagation()
    props.setOpen(false);
  };

  return (  
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="popupheader" style={{marginBottom:'5%'}}>    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
        {props.title}
          </Typography><CloseIcon
          autoFocus onClick={(e)=>{handleClose(e);e.preventDefault(); e.stopPropagation()}}
          sx={{'&:hover': { cursor: 'pointer' }}} /></div>
        <DialogContent sx={{pl:2}}>
          { 
          <div >
            Are you sure you want to delete the {props.title}?
          </div>
}
        </DialogContent>
        <Box sx={{ display: "flex", m:2,justifyContent: "space-between" }}>
          <Button className="mui-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); props?.deleteFunction(props?.tableId); handleClose(e); }}>Delete</Button>
          
        </Box>
      </Dialog>
    </>
  );
}


AlertPopup.propTypes = {
  setOpen: PropTypes.func,
  open:PropTypes.bool,
  title: PropTypes.string,
  tableId : PropTypes.string,
  deleteFunction : PropTypes.func,
  tables:PropTypes.any
}