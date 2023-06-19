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

function Createwebhook(props) {
  const [name, setName] = useState(null);
  const [action, setAction] = useState("");
  const [url, setUrl] = useState(null);
  const [filterid, setFilterid] = useState(props?.filterId || "all");
  const [selectedtable,setSelectedTable]=useState(props?.tableId || null);
  const [filtersbytable, setFiltersbytable] = useState(
    
    props?.dataforwebhook[props?.tableId]?.filters
  );

  const createWebHook = async () => {
    const data = {
      name: name,
      url: url,
      filterId: filterid,
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
      setFilterid(props.filterId);
    }
  }, [props.webhookid]);

  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
        <Box
          className="create-auth-key-main-container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Box className="create-auth-key-content-container">
            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">Name</Typography>
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
            <Box className="create-auth-key-row">
              <Typography className="create-webhook-label">Action</Typography>
              <FormControl
                variant="standard"
                className="create-auth-key-dropdown"
              >
                <TextField
                  id="action"
                  select
                  label="Action"
                  value={action}
                  style={{ minWidth: "210px" }}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <MenuItem value="createRow">Create Row</MenuItem>
                  <MenuItem value="deleteRow">Delete Row</MenuItem>
                  <MenuItem value="updateRow">Update Row</MenuItem>
                </TextField>
              </FormControl>
            </Box>
            { props?.tables && <Box className="create-auth-key-row">
              <Typography className="create-webhook-label">Tables</Typography>
              <FormControl
                variant="standard"
                className="create-auth-key-dropdown"
              >
                <TextField
                  id="tables"
                  select
                  label="Action"
                  value={selectedtable}
                  style={{ minWidth: "210px" }}
                  onChange={(e) => {
                    setFiltersbytable(props?.dataforwebhook[e.target.value]?.filters);
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

            {action !== "deleteRow" ? (
              <Box className="create-auth-key-row">
                <Typography className="create-webhook-label">
                  Filters
                </Typography>
                <FormControl
                  variant="standard"
                  className="create-auth-key-dropdown"
                >
                  <TextField
                    id="filterColumn"
                    select
                    label="Filters"
                    value={filterid}
                    style={{ minWidth: "210px" }}
                    onChange={(e) => setFilterid(e.target.value)}
                    defaultValue={props.filterId}
                  >
                    {filtersbytable &&
                      Object.entries(filtersbytable).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value.filterName}
                        </MenuItem>
                      ))}
                    <MenuItem key={0} value={"all"}>
                      Anywhere in the table
                    </MenuItem>
                  </TextField>
                </FormControl>
              </Box>
            ) : (
              <></>
            )}

            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">URL</Typography>
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
          <Box className="create-auth-key-actions">
            <Button
              variant="contained"
              className="create-auth-key-button mui-button"
              onClick={() => {
                createWebHook();
                handleClose();
              }}
            >
              {props.webhookid ? "Update" : "Create"}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              className="create-auth-key-button mui-button-outlined"
            >
              Cancel
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
  webhookid: PropTypes.any,
  webhookname: PropTypes.any,
  weburl: PropTypes.any,
  filterId: PropTypes.any,
  closeDropdown: PropTypes.any,
};

export default Createwebhook;
