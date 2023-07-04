import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../pages/Webhookpage/Webhookpage.scss";
import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  FormControl,
  MenuItem,
  FormControlLabel,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { toast } from "react-toastify";
import { createTemplate, getAllCategoryName } from '../../api/templateApi';
import { useEffect } from 'react';

const CreateTemplatePopup = (props) => {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState(false);
  const [allCategory, setAllCategory] = useState(false);
  const handleClose = () => {
    props?.setOpen(false);
  };

  useEffect(async()=>{
   const allcategory = await getAllCategoryName();
  const allCategory = allcategory.data.data
  const values = allCategory.map(obj => obj.fldy3uvsooap);
   setAllCategory(values);
  },[])

  const handleCreateTemplate = async () => {
    const data = {
      name: name,
      categoryName: categoryName,
      description: description,
      newCategory: newCategory,
    };
    await createTemplate(props?.dbId, data);
    toast.success('Template created successfully!');
    handleClose();
  };

  return (
    <div onClick={(e) => {
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
              <Box className="create-auth-key-row" sx={{display:'flex',flexDirection:'column'}}>
                <FormControlLabel
                  label="New Category"
                  control={
                    <Typography sx={{display:"flex", alignItems:"center", justifyContent:"center",color:'black'}}onClick={()=>{setNewCategory(!newCategory)}} variant="contained" color="primary">
              {newCategory ? <CheckBoxIcon fontSize='small'/> : <CheckBoxOutlineBlankIcon fontSize='small'/>}
            </Typography>
                  }
                />
                {newCategory ? (
                  <TextField
                    id="standard-basic"
                    label="Category Name"
                    variant="standard"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                    }}
                  />
                ) : (
                  <FormControl variant="standard" className="create-auth-key-dropdown">
                    <TextField
                      id="category"
                      select
                      label="Category"
                      value={categoryName}
                      style={{ minWidth: "210px" }}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                      }}
                    >
                      {allCategory &&
                        Object.entries(allCategory).map(([key, value]) => {
                          return (
                            <MenuItem key={key} value={value}>
                              {value}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </FormControl>
                )}
              </Box>
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

CreateTemplatePopup.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.any,
  dbId: PropTypes.any,
  db: PropTypes.any,
};
