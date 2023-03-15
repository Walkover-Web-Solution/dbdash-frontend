import React from 'react';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@mui/material';
import { PropTypes } from 'prop-types';
export default function DeleteAuthKeyPopup(props) {

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
          <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); props?.deleteFunction(props?.title)      ; handleClose(); }}>Delete</Button>

          <Button onClick={handleClose} autoFocus>Cancel </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


DeleteAuthKeyPopup.propTypes = {
  setOpen: PropTypes.func,
  open:PropTypes.bool,
  title: PropTypes.string,
  deleteFunction : PropTypes.func
}