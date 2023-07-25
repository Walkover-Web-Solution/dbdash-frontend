import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';

export default function DisplayAuthKeyPopup({ setDisplay, display, title }) {
  const handleClose = () => {
    setDisplay(false);
  };
  
  const [isCopied, setIsCopied] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(title);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <Dialog
      open={display}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard() }}>
          {isCopied ? "Copied!" : "Copy"}
        </Button>
        <Button onClick={handleClose} autoFocus>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

DisplayAuthKeyPopup.propTypes = {
  setDisplay: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};
