import React from "react";
import {Box,Modal,Button} from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  input: {
    display: 'none', // hides the default file input
  },
  label: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
});


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

export default function selectFilepopup(props) {
  const classes = useStyles();
  const handleClose = () => { props.setOpen(false); };

  const handleFileSelection = (e) => {
    props.onChangeFile(e, "file");
    handleClose();
  }

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="file"
              id="my-file-input"
              className={classes.input}
              onChange={(e)=>{
                handleFileSelection(e)}}
            />
            <label htmlFor="my-file-input" className={classes.label}>Choose a file
            </label>
            <Button variant="outlined" onClick={handleClose}>
              cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

selectFilepopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
