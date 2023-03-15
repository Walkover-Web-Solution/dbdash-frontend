import React,{useState} from "react";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
// import { Snackbar } from '@material-ui/core';
// import { Alert } from '@material-ui/lab';
// import { FileCopy } from '@mui/icons-material';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height:175,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function AuthKeyPopup(props) {
  // console.log(p)
  // const [copySuccess, setCopySuccess] = useState(false);
  
  const [copyText, setCopyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  console.log(copyText);
  const handleClose = () => props.setOpen(false);
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
          <Box sx={{ my: 2 , display:'flex'}}>
            <Box sx={{mr:4}}>
            <TextField disabled  label="Auth Key"  variant="standard" value={props?.title} onChange={handleCopyText} />
            </Box>
        {/* <IconButton onClick={handleCopyClick}>
                  <FileCopy />
                </IconButton> */}
        <Box>
        <Button variant="contained" onClick={handleCopyClick} disabled={isCopied}> {isCopied ? "Copied" : "Copy"}</Button>
        </Box>
        {/* <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
          <Alert onClose={() => setCopySuccess(false)} severity="success">
            Auth Key copied to clipboard!
          </Alert>
        </Snackbar> */}
          </Box>
          <Box sx={{mt:3}}>
          {/* <Button variant="contained" onClick={handleClose}>Cancel</Button> */}
          <Link to={`/authkeypage/${props?.dbId}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    </Link>
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
  label: PropTypes.string,
  saveFunction:PropTypes.func,
  setVariable:PropTypes.func,
  id: PropTypes.string,
  authkey:PropTypes.any,
  dbId:PropTypes.any
};