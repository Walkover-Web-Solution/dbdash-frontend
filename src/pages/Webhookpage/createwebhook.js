import React,{useState} from 'react'
import './Webhookpage.scss'
import { Box, TextField, Typography, Button, FormControl, MenuItem, Modal } from "@mui/material";
import { Link } from 'react-router-dom';
import { PropTypes } from "prop-types";


function Createwebhook(props) {
    const [name, setName] = useState("");
    const [action, setAction] = useState("");
    const [url, setUrl] = useState("");
    const [webHooks, setWebHooks] = useState([]);
  
    const isDisabled = !name || !action || !url;
  
    const createWebHook = () => {
      const newWebHook = {
        name: name,
        action: action,
        url: url
      };
      setWebHooks([...webHooks, newWebHook]);
      setName("");
      setAction("");
      setUrl("");
    };
  
    return (
      <>
       <Modal open={props.open} >
        <Box className="create-auth-key-main-container">
          <Box className="create-auth-key-content-container">
            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">Name</Typography>
              <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box className="create-auth-key-row" >
              <Typography className="create-webhook-label">Action</Typography>
              <FormControl variant="standard" className="create-auth-key-dropdown">
                <TextField
                  id="action"
                  select
                  label="Action"
                  value={action}
                  style={{minWidth:'210px'}}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <MenuItem value="create_row">Create Row</MenuItem>
                  <MenuItem value="delete_row">Delete Row</MenuItem>
                  <MenuItem value="update_row">Update Row</MenuItem>
                 
                </TextField>
              </FormControl>
            </Box>
  
          { action!=='Delete Row' ? <Box className="create-auth-key-row">
              <Typography className="create-webhook-label">Anywhere in Table Name</Typography>
              <FormControl variant="standard" className="create-auth-key-dropdown">
                <TextField
                  id="filterColumn"
                  select
                  label="Anywhere in Table Name"
                  value={action}
                  style={{minWidth:'210px'}}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <MenuItem value="view1">view 1</MenuItem>
                  <MenuItem value="view2">view 2</MenuItem>
                  {/* <MenuItem value="update_row">Update Row</MenuItem> */}
                 
                </TextField>
              </FormControl>
            </Box>:<></>}
  
  
            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">URL</Typography>
              <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </Box>
          </Box>
          <Box className="create-auth-key-actions">
            <Link
              to={{
                pathname: "/webHookTable",
                state: {
                  webHooks: webHooks
                }
              }}
              className="create-auth-key-link"
            >
              <Button variant="contained" disabled={isDisabled} className="create-auth-key-button mui-button" onClick={createWebHook}>
                Create
              </Button>
            </Link>
            <Link className="create-auth-key-link">
              <Button variant="outlined" className="create-auth-key-button mui-button-outlined">
                Cancel
              </Button>
            </Link>
          </Box>
        </Box>
        </Modal>
      </>
    );
}

Createwebhook.propTypes={
    open:PropTypes.any,
    setOpen:PropTypes.any
}
export default Createwebhook