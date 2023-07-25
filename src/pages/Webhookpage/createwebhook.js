import React, { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [url, setUrl] = useState("");
  const [selectedtable,setSelectedTable]=useState(props?.tableId || "");
 
  const createWebHook = async () => {
    
    const data = {
      name: name,
      url: url,
      isActive: true,
      condition: action,
    };

    if (props?.webhookid) {
      if (props?.condition !== action) {
        data.newCondition = action;
        data.condition = props?.condition;
      }
      await updateWebhook(props?.dbId, props?.tableId, props?.webhookid, data);
    } else {
      await createWebhook(props.dbId, selectedtable, data);
    }
    handleClose();
    setName(null);
    setAction(null);
    setUrl(null);
    props.setNewcreated(props.newcreated + 1);
  };

  const handleClose = () => {
    if (props.webhookid) {
      props?.closeDropdown();
    }
    props.handleClose();
    setName("");
    setAction("");
    setUrl("");
  };

  useEffect(() => {
    if (props.webhookid) {
      setName(props.webhookname);
      setAction(props.condition);
      setSelectedTable(props?.tableId)
      setUrl(props.weburl);
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
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
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
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
                  value={selectedtable}
                  onChange={(e) => {
                    setSelectedTable(e.target.value)}}
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
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
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
