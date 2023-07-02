import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../pages/Webhookpage/Webhookpage.scss";
import {
    Box,
    TextField,
    Typography,
    Button,
    Modal,
} from '@mui/material';
import { toast } from "react-toastify";
import { createTemplate } from '../../api/templateApi';

const CreateTemplatePopup = (props) => {
    const [name, setName] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState(null);
  const handleClose = () => {
    props?.setOpen(false);
  };

  const handleCreateTemplate = async () =>  {
    // const userId = localStorage.getItem("userid");
    const data = {
        name : name,
        categoryName:categoryName,
        description: description,
        newCategory: true
    };
     await createTemplate(props?.dbId,data);
    toast.success('Template created successfully!');
    handleClose();
  };

//   const handleChange = (event) => {
//     setDatabaseName(event.target.value);
//   };

  return (
    <div onClick={(e)=>{
      e.preventDefault();
      e.stopPropagation();
    }}>
      
       <>
      <Modal open={props?.open} onClose={handleClose}>
        <Box
          className="create-auth-key-main-container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Box className="create-auth-key-content-container">

          <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">Category Name</Typography>
              <TextField
                id="standard-basic"
                label="Category Name"
                variant="standard"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
            </Box>
           
              {/* <Box className="create-auth-key-row">
              <Typography className="create-webhook-label">Category name</Typography>
              <FormControl
                variant="standard"
                className="create-auth-key-dropdown"
              >
                <TextField
                  id="tables"
                  select
                  label="Action"
                  value={categoryName}
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
            </Box> */}
            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">Template Name</Typography>
              <TextField
                id="standard-basic"
                label="Template Name"
                variant="standard"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Box>
           
            <Box className="create-auth-key-row">
              <Typography className="create-auth-key-label">Description</Typography>
              <TextField
                id="standard-basic"
                label="Description"
                variant="standard"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Box>
          </Box>
          <Box className="create-auth-key-actions">
            <Button
              variant="contained"
              className="create-auth-key-button mui-button"
              onClick={() => {
                handleCreateTemplate();
                handleClose();
              }}
            >
             Create Template
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
    </div>
  );
};

export default CreateTemplatePopup;
CreateTemplatePopup.propTypes={
  open:PropTypes.any,
  setOpen:PropTypes.any,
  dbId:PropTypes.any,
  db:PropTypes.any

}