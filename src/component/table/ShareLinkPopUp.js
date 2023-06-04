import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ShareLinkPopUp(props) {
  const handleClose = () => props.setOpen(false);
  // const [textFieldValue, setTextFieldValue] = useState("");

  const handleCopy = () => {
    const textFieldValue = props.textvalue;
    
    navigator.clipboard.writeText(textFieldValue)
      .then(() => {
        console.log("Text copied to clipboard:", textFieldValue);
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
  };
  
  

  // const handleChange = () => {
  //   setTextFieldValue(props.textvalue);
  // };

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
          <Typography id="title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Box sx={{ my: 2 }}>
            <TextField
              autoFocus
              id={props?.id}
              name={props?.id}
              label={props.label}
              variant="standard"
              value={props.textvalue}
              // onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            
            <Box>
              <CopyToClipboard text={props.textvalue}>
                <Button variant="contained" onClick={handleCopy}>
                  Copy
                </Button>
              </CopyToClipboard>
            </Box>
            <Box>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

ShareLinkPopUp.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  label: PropTypes.string,
  submitData: PropTypes.func,
  setVariable: PropTypes.func,
  id: PropTypes.string,
  joiMessage: PropTypes.string,
  textvalue:PropTypes.string
};
