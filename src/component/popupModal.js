import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useValidator from "react-joi";
import Joi from "joi";

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

export default function PopupModal(props) {
  // const [org, setOrg] = React.useState();
  
  const handleClose = () => props.setOpen(false);

  const [textFieldValue, setTextFieldValue] = useState("");


  const { state, setData, setExplicitField,validate} = useValidator({
    initialData: {
      [props?.id]: null,
    },
    schema: Joi.object({
      [props?.id]: Joi.string().min(3).max(15).required(),
    }),
    explicitCheck: {
      [props?.id]: false,
    },
    validationOptions: {
      abortEarly: true,
    },
  });

const createProjectJoi = (e) => {
    
    e.persist();
    const value = e.target.value;
    setTextFieldValue(value);

    setData((old) => ({
        ...old,
        [props?.id]: value,
    }));
    validate();
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
          <Typography id="title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Box sx={{ my: 2 }}>
            <TextField
             error={
              state?.$errors?.[props?.id].length === 0
                  ? false
                  : state.$errors?.[props?.id]
                      ? true
                      : false
          }
             autoFocus
              id={props?.id}
              name={props?.id}
              label={props.label}
              variant="standard"
              onChange={(e) => {
                props.setVariable(e.target.value);
                createProjectJoi(e);
              }}
              onBlur={() => setExplicitField(`${props?.id}`, true)}
              onKeyDown={(e) => {
                if(textFieldValue.length >= 3 && textFieldValue.length <= 15){
                  if (e.key === 'Enter') {
                    props.submitData(e);
                    handleClose();
                  }
                }               
              }}
            />
             <div style={{ color: "red", fontSize: "12px" }}>
                    {state.$errors?.[props?.id].map((data) => data.$message).join(",")}
                </div>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Button variant="contained" disabled={textFieldValue.length < 3 || textFieldValue.length >15} onClick={()=>{
                validate();
                  props?.submitData();
              }}>
                Create
              </Button>
            </Box>
            <Box>
              <Button variant="outlined" onClick={(e)=>handleClose(e)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

PopupModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  label: PropTypes.string,
  submitData:PropTypes.func,
  setVariable:PropTypes.func,
  id: PropTypes.string,
};
