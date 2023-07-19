import React from 'react';
import {Box, Button,Dialog,DialogContent, Typography} from '@mui/material';
import { PropTypes } from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import "./alerPopup.scss"

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
        <div className="popupheader alert-popup-head" >    <Typography className="alerttext" id="title" variant="h6" component="h2">
        {props.title}
          </Typography><CloseIcon
          autoFocus onClick={(e)=>{handleClose(e);e.preventDefault(); e.stopPropagation()}}
          className="aler-close-icon" /></div>
        <DialogContent className='dialogContent'>
          { 
          <div >
            Are you sure you want to delete the {props.title}?
          </div>
}
        </DialogContent>
        <Box className='alert-filter-actions'>
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