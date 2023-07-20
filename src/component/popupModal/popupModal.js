import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import useValidator from "react-joi";
import Joi from "joi";
import CloseIcon from '@mui/icons-material/Close';
import variables from '../../assets/styling.scss';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};
import "./popupModal.scss"

export default function PopupModal(props) {
  const handleClose = () => props.setOpen(false);
  const [textFieldValue, setTextFieldValue] = useState("");

  const { state, setData, setExplicitField, validate } = useValidator({
    initialData: {
      [props?.id]: null,
    },
    schema: Joi.object({
      [props?.id]: Joi.string().min(3).max(30).pattern(/^[^\s]+$/).required()
        .messages({
          "string.min": `${props?.joiMessage} must be at least {#limit} characters long`,
          "string.max": `${props?.joiMessage} must not exceed {#limit} characters`,
          "string.empty": `${props?.joiMessage} is required`,
          "string.pattern.base": `${props?.joiMessage} must not contain spaces`,
        }),
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
        <div className="popupheader">    
        <Typography className="popupModalTitle" id="title" variant="h6" component="h2">
              {props.title}
            </Typography>
            <CloseIcon className="closeIcon" onClick={handleClose} />
          </div>

       
          <Box className='popupModalContent'>
            <TextField
              error={
                state?.$errors?.[props?.id].length === 0 || textFieldValue.includes(" ")
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
                if (
                  textFieldValue.length >= 3 &&
                  textFieldValue.length <= 30 &&
                  !textFieldValue.includes(" ")
                ) {
                  if (e.key === "Enter") {
                    props.submitData(e);
                    handleClose();
                  }
                }
              }}
            />
            <div  className="errorcolor" style={{ fontSize: variables.editfilterbutttonsfontsize }}>
              {state.$errors?.[props?.id].map((data) => data.$message).join(",")}
            </div>
          </Box>
         {props?.templateoption && <Box className="templateOption"><Typography>To create a base using template <a  rel="noreferrer" href='http://localhost:5000/64a806e049f009459a84201b'> click here</a></Typography></Box>
         } <Box className="buttonContainer">
            <Box >
              <Button
              className="mui-button"
                variant="contained"
                disabled={
                  textFieldValue.length < 3 ||
                  textFieldValue.length > 30 ||
                  textFieldValue.includes(" ")
                }
                onClick={() => {
                  validate();
                  props?.submitData();
                }}
              >
                Create
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
  templateoption:PropTypes.any,
  submitData: PropTypes.func,
  setVariable: PropTypes.func,
  id: PropTypes.string,
  joiMessage: PropTypes.string,
};