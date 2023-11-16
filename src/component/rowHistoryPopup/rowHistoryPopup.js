import React from "react";
import { Box,  } from "@mui/material";
import Modal from "@mui/material/Modal";
// import CloseIcon from '@mui/icons-material/Close';
import { getRowHistory } from "../../api/rowApi";
import { useParams } from "react-router";
import PropTypes from "prop-types";
import { useState } from "react";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline:'none',
  boxShadow: 24,
};
// import "./rowHistoryPopup.scss"

function RowHistoryPopup(props) {
  const [history, setHistory] = useState([]);
  const params = useParams();
  const {dbId, tableName} = params;
  const {open, setShowHistory, index} = props;
  console.log(index);
//   getRowHistory(dbId, tableName).then()
  
  function handleClose(){
    setShowHistory(false)
  }
  return (
    <Box>
      <Modal
        disableRestoreFocus
        open = {open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
      </Modal>
    </Box>
  );
}

RowHistoryPopup.propTypes = {
    open: PropTypes.bool,
    setShowHistory : PropTypes.func,
    index : PropTypes.number
};
export default RowHistoryPopup;