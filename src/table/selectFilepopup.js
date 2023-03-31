import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

// import { createOrg } from "../api/orgApi";

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
  // const [org, setOrg] = React.useState();
  
  const handleClose = () =>{ props.setOpen(false);};

  

  
  

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
           
          
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
          <input
        style={{
          width: "500%",
          height: "100%",
          marginRight: "2px",
          margin: "0",
          padding: "0",
          paddingBottom: "2px",
        }}
        type="file"
        id="attachmentInput"
        
        onChange={(e) => {
          props?.onChangeFile(e, "file");
        }}
      /> 
            </Box>
            <Box>
              <Button variant="outlined" onClick={handleClose}>
                cancel
              </Button>
            </Box>
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
