import React, { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: 175,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function AuthKeyPopup(props) {

  const [, setCopyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const handleClose = () =>{ 
    props.handleClose();
    props.setOpen(false)};
  const handleCopyText = () => {
    setCopyText(props?.title);
  }
  const handleCopyClick = () => {
    navigator.clipboard.writeText(props?.title);
    // setCopySuccess(true);
    setIsCopied(true)
  };
  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ my: 2, display: 'flex' }}>
            <Box sx={{ mr: 4 }}>
              <TextField disabled label="Auth Key" variant="standard" value={props?.title} onChange={handleCopyText} />
            </Box>
            <Box>
              <Button variant="contained"  className="mui-button" onClick={handleCopyClick} disabled={isCopied}> {isCopied ? "Copied" : "Copy"}</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
              <Button variant="outlined" className="mui-button-outlined" onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
AuthKeyPopup.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
 
  authkey: PropTypes.any,
  handleClose:PropTypes.any,
};