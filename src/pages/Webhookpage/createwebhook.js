import React, { useState } from 'react';
import './Webhookpage.scss';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Modal,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { createWebhook } from '../../api/webhookApi';

function Createwebhook(props) {
  const [name, setName] = useState(null);
  const [action, setAction] = useState('');
  const[filters,setFilters]=useState('all');
  const [url, setUrl] = useState(null);



  const createWebHook =  () => {

    const data={
        name:name,
        url:url,
filterId:filters,
isActive: true,
condition:action,

    }
    createWebhook(props.dbId,props.tableId,data);
    props.setNewcreated(props.newcreated+1);
    handleClose();
   
    setName(null);
    setAction(null);
    setUrl(null);
  };
  const handleClose = () => {
    setName('');
    setAction('');
    setUrl('');
    props.handleClose(); // Call the handleClose function from props to close the modal
  };
  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
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
            <Box className="create-auth-key-row">
              <Typography className="create-webhook-label">Action</Typography>
              <FormControl variant="standard" className="create-auth-key-dropdown">
                <TextField
                  id="action"
                  select
                  label="Action"
                  value={action}
                  style={{ minWidth: '210px' }}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <MenuItem value="createRow">Create Row</MenuItem>
                  <MenuItem value="deleteRow">Delete Row</MenuItem>
                  <MenuItem value="updateRow">Update Row</MenuItem>
                </TextField>
              </FormControl>
            </Box>

            {action !== 'deleteRow' ? (
              <Box className="create-auth-key-row">
                <Typography className="create-webhook-label">Filters</Typography>
                <FormControl variant="standard" className="create-auth-key-dropdown">
                  <TextField
                    id="filterColumn"
                    select
                    label="Filters"
                    value={filters}
                    style={{ minWidth: '210px' }}
                    onChange={(e) => setFilters(e.target.value)}
                  >
                    <MenuItem key={0} value={'all'}>
                      Anywhere in the table
                    </MenuItem>

                    {props.filters &&
                      Object.entries(props.filters).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value.filterName}
                        </MenuItem>
                      ))}
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
           
              <Button
                variant="contained"
                className="create-auth-key-button mui-button"
                onClick={createWebHook}
              >
                Create
              </Button>
              <Button onClick={handleClose} variant="outlined" className="create-auth-key-button mui-button-outlined">
                Cancel
              </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

Createwebhook.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.any,
  filters: PropTypes.any,
  handleClose: PropTypes.any,
  dbId:PropTypes.any,
  tableId:PropTypes.any,
  setNewcreated:PropTypes.any,
  newcreated:PropTypes.any
};

export default Createwebhook;
