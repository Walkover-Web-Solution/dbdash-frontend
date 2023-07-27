import React, { memo, useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import useValidator from "react-joi";
import Joi from "joi";
import CloseIcon from "@mui/icons-material/Close";
import variables from "../../assets/styling.scss";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};
import "./popupModal.scss";
import { createTable } from "../../api/tableApi";
import { createTable1 } from "../../store/allTable/allTableThunk";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

function PopupModal(props) {
  const handleClose = () => setOpen(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const { setOpen, open, dbData } = props;
  const createTableName = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state, setData, setExplicitField, validate } = useValidator({
    initialData: {
      [props?.id]: null,
    },
    schema: Joi.object({
      [props?.id]: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^[^\s]+$/)
        .required()
        .messages({
          "string.min": `Table name must be at least {#limit} characters long`,
          "string.max": `Table name must not exceed {#limit} characters`,
          "string.empty": `Table name is required`,
          "string.pattern.base": `Table name must not contain spaces`,
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

  const saveTable = async () => {
    const data = {
      tableName: createTableName.current,
    };
    setOpen(false);
    const apiCreate = await createTable(dbData?.db?._id, data);
    await dispatch(createTable1({ tables: apiCreate.data.tables }));
    const matchedKey = Object.keys(apiCreate?.data?.tables).find((key) => {
      return apiCreate?.data?.tables[key].tableName === createTableName.current;
    });
    if (matchedKey) {
      navigate(`/db/${dbData?.db?._id}/table/${matchedKey}`);
    }
  };

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="popupheader">
            <Typography
              className="popupModalTitle"
              id="title"
              variant="h6"
              component="h2"
            >
              Create Table
            </Typography>
            <CloseIcon className="closeIcon" onClick={handleClose} />
          </div>
          <Box className="popupModalContent">
            <TextField
              error={
                state?.$errors?.[props?.id].length === 0 ||
                textFieldValue.includes(" ")
                  ? false
                  : state.$errors?.[props?.id]
                  ? true
                  : false
              }
              autoFocus
              id={props?.id}
              name={props?.id}
              ref={createTableName}
              label="Table Name"
              variant="standard"
              onChange={(e) => {
                createTableName.current = e.target.value;
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
                    saveTable(e);
                    handleClose();
                  }
                }
              }}
            />
            <div
              className="errorcolor"
              style={{ fontSize: variables.editfilterbutttonsfontsize }}
            >
              {state.$errors?.[props?.id]
                .map((data) => data.$message)
                .join(",")}
            </div>
          </Box>
          {props?.templateoption && (
            <Box className="templateOption">
              <Typography>
                To create a base using template{" "}
                <a
                  rel="noreferrer"
                  href="http://localhost:5000/64a806e049f009459a84201b"
                >
                  {" "}
                  click here
                </a>
              </Typography>
            </Box>
          )}{" "}
          <Box className="buttonContainer">
            <Box>
              <Button
                className={
                  textFieldValue.length < 3 ||
                  textFieldValue.length > 30 ||
                  textFieldValue.includes(" ")
                    ? "mui-button mui-button-disabled"
                    : "mui-button"
                }
                variant="contained"
                disabled={
                  textFieldValue.length < 3 ||
                  textFieldValue.length > 30 ||
                  textFieldValue.includes(" ")
                }
                onClick={() => {
                  validate();
                  saveTable();
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
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  templateoption: PropTypes.any,
  id: PropTypes.string,
  dbData: PropTypes.any,
};

export default memo(PopupModal);
