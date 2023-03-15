import React from 'react';

import {Button,Dialog,DialogActions,DialogTitle} from '@mui/material';
import { PropTypes } from 'prop-types';
import { Link, useParams } from 'react-router-dom';
export default function DisplayAuthKeyPopup(props) {
  const { id } = useParams();
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
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>

        <DialogActions>
          <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard() }}>
          {isCopied ? "Copied!" : "copy"}
          </Button>
          <Link to={`/authkeypage/${id}`} style={{ textDecoration: 'none' }}>
          <Button onClick={handleClose} autoFocus>Cancel </Button>
          </Link>
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