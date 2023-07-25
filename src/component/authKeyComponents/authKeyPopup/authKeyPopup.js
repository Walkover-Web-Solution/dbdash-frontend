import React, { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import PropTypes from "prop-types";
import "./authKeyPopup.scss";


export default function AuthKeyPopup(props) {
  const [, setCopyText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const handleClose = () => {
    props.handleClose();
    props.setOpen(false);
  };
  const handleCopyText = () => {
    setCopyText(props?.title);
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(props?.title);
    setIsCopied(true);
  };

  const handleButtonClick = () => {
    handleCopyClick();

    handleClose();
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
        <Box className="authKeyPopUp-b2">
          <Box className="create-auth-key">
            <Box className="copy-auto-key">
              <TextField
                disabled
                label="Auth Key"
                variant="standard"
                value={props?.title}
                onChange={handleCopyText}
                
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                className="mui-button"
                onClick={handleButtonClick}
                disabled={isCopied}
              >
                {" "}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              className="mui-button-outlined"
              onClick={handleClose}
            >
              Cancel
            </Button>
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
  handleClose: PropTypes.any,
};
