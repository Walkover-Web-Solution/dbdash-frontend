import React, {  useEffect, useRef } from "react";
import "./Webhookpage.scss";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Modal,
} from "@mui/material";
import { PropTypes } from "prop-types";
import { createWebhook, updateWebhook } from "../../api/webhookApi";
import CloseIcon from '@mui/icons-material/Close';

function Createwebhook(props) {
  let nameRef = useRef("");
  let actionRef = useRef("");
  let urlRef = useRef("");
  let selectedTableRef = useRef(props?.tableId || "");

  const createWebHook = async () => {
    const data = {
      name: nameRef.current,
      url: urlRef.current,
      isActive: true,
      condition: actionRef.current,
    };

    if (props?.webhookid) {
      if (props?.condition !== actionRef.current) {
        data.newCondition = actionRef.current;
        data.condition = props?.condition;
      }
      await updateWebhook(props?.dbId, props?.tableId, props?.webhookid, data);
    } else {
      await createWebhook(props.dbId, selectedTableRef.current, data);
    }
    handleClose();
    nameRef.current = "";
    actionRef.current = "";
    urlRef.current = "";
    props.setNewcreated(props.newcreated + 1);
  };

  const handleClose = () => {
    if (props.webhookid) {
      props?.closeDropdown();
    }
    props.handleClose();
    nameRef.current = "";
    actionRef.current = "";
    urlRef.current = "";
  };

  useEffect(() => {
    if (props.webhookid) {
      nameRef.current = props.webhookname;
      actionRef.current = props.condition;
      selectedTableRef.current = props?.tableId;
      urlRef.current = props.weburl;
    }
  }, [props.webhookid]);

  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
        <Box
          className="create-webhook-key-main-container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Box className="create-webhook-key-content-container" >
          <div className="create-webhook-popupheader popupheader" >    <Typography className="create-webhook-popupheader-heading"  id="title" variant="h6" component="h2">
            {props?.heading}
          </Typography><CloseIcon className="create_webhook-close-icon"  onClick={props?.handleClose}/></div>

            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-key-label">Name</Typography>
              <TextField
                id="standard-basic"
                label="Name"
                variant="standard"
                onChange={(e) => {
                  nameRef.current = e.target.value;
                }}
              />
            </Box>
            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-label">Action</Typography>
              <FormControl
                variant="standard"
                className="create-webhook-key-dropdown"
              >
                <TextField
                  id="action"
                  select
                  label="Action"
                  
                  className="create-webhook-action-text-field"
                  onChange={(e) => {

                    actionRef.current = e.target.value;
                  }}
                >
                  <MenuItem value="createRow">Create Row</MenuItem>
                  <MenuItem value="deleteRow">Delete Row</MenuItem>
                  <MenuItem value="updateRow">Update Row</MenuItem>
                </TextField>
              </FormControl>
            </Box>
            { props?.tables && <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-label">Tables</Typography>
              <FormControl
                variant="standard"
                className="create-webhook-key-dropdown"
              >
                <TextField
                  id="tables"
                  select
                  label="Action"
                  className="create-webhook-table-text-field"
                  onChange={(e) => {
                    selectedTableRef.current = e.target.value;
                  }}
                >
                  {props?.tables && 
                    Object.entries(props?.tables).map(([key, value]) => {
                      return (
                        <MenuItem key={key} value={key}>
                          {value?.tableName}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </FormControl>
            </Box>}

            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-key-label">URL</Typography>
              <TextField
                id="standard-basic"
                label="Url"
                variant="standard"
                onChange={(e) => {
                  urlRef.current = e.target.value;
                }}
              />
            </Box>
          </Box>
          <Box className="create-webhook-button-box">
            <Button
              variant="contained"
              className="create-webhook-key-button mui-button"
              onClick={() => {
                createWebHook();
                handleClose();
              }}
            >
              {props.webhookid ? "Update" : "Create"}
            </Button>
          
          </Box>
        </Box>
      </Modal>
    </>
  );
}

Createwebhook.propTypes = {
  senddataa1: PropTypes.any,
  open: PropTypes.any,
  condition: PropTypes.any,
  dataforwebhook: PropTypes.any,
  tables: PropTypes.any,
  setOpen: PropTypes.any,
  handleClose: PropTypes.any,
  dbId: PropTypes.any,
  tableId: PropTypes.any,
  setNewcreated: PropTypes.any,
  newcreated: PropTypes.any,
  heading:PropTypes.any,
  webhookid: PropTypes.any,
  webhookname: PropTypes.any,
  weburl: PropTypes.any,
  filterId: PropTypes.any,
  closeDropdown: PropTypes.any,
};

export default Createwebhook;
