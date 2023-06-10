import React from 'react';

import {Button,Dialog,DialogActions,DialogTitle} from '@mui/material';
import { PropTypes } from 'prop-types';
//import { string } from 'joi';
export default function DisplayAuthKeyPopup(props) {
  const handleClose = () => {
    props.setDisplay(false);
  };
  const [isCopied, setIsCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props?.title);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  
  return (  
    <>
      <Dialog
        open={props.display}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{ props.title}</DialogTitle>

        <DialogActions>
          <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard() }}>
          {isCopied ? "Copied!" : "copy"}
          </Button>
          <Button onClick={handleClose} autoFocus>Cancel </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


DisplayAuthKeyPopup.propTypes = {
  setDisplay: PropTypes.func,
  display:PropTypes.bool,
  title: PropTypes.string
}
