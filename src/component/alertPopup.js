import React from 'react';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@mui/material';
import { PropTypes } from 'prop-types';
export default function AlertPopup(props) {

  const handleClose = () => {
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
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the {props.title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); props?.deleteFunction(props?.tableId); handleClose(); }}>Delete</Button>
          <Button onClick={(e)=>{handleClose(e);e.preventDefault(); e.stopPropagation()}} autoFocus>Cancel </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


AlertPopup.propTypes = {
  setOpen: PropTypes.func,
  open:PropTypes.bool,
  title: PropTypes.string,
  tableId : PropTypes.string,
  deleteFunction : PropTypes.func
}