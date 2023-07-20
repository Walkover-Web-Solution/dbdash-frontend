import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../../pages/Webhookpage/Webhookpage";
import CloseIcon from '@mui/icons-material/Close';
import './createTemplatePopup.scss'

import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  Autocomplete,
} from '@mui/material';
import { toast } from "react-toastify";
import { createTemplate, getAllCategoryName } from '../../../api/templateApi';
import { useEffect } from 'react';

const CreateTemplatePopup = (props) => {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [allCategory, setAllCategory] = useState(false);

  const handleClose = () => {
    props?.setOpen(false);
  };

  useEffect(async()=>{
   const allcategory = await getAllCategoryName();
  const allCategory = allcategory?.data?.data || [];
  const values = allCategory?.map(obj => obj?.fld1yhgjz9fg)?.filter(obj=>obj!=null && obj!='');
   setAllCategory(values);
  },[])

  const handleCreateTemplate = async () => {
    let data = {
      name: name,
      categoryName: categoryName,
      description: description,
    };
    
    if (Array.isArray(allCategory)) {
      data.newCategory = !allCategory.includes(categoryName) ;
    }
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
            className="create-auth-key-main-container createTemp-box"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}  
            
          >
               <div className="popupheader">    <Typography className='createTemp-typography' id="title" variant="h6" component="h2">
            create template
          </Typography><CloseIcon className='createTemp-close-icon' onClick={handleClose}/></div>
            <Box className="create-auth-key-content-container">
              <Box className="create-auth-key-row createTemp-box2" >
                <div className='createTemp-div  '>
              <Typography className="create-auth-key-label createTemp-catagory" >Category Name</Typography>

              <Autocomplete
      id="country-select-demo"
      value={categoryName}
      onChange={(e, value) => {
        setCategoryName(value);
      }}

      className='createTemp-autocomplete'

      options={allCategory || []}
      freeSolo={true} 
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option}
        </Box>
      )}
      onInputChange={(e)=>{
        setCategoryName(e.target.value);
      }}
      renderInput={(params) => (
        <TextField
      label={'Category Name   '}

          {...params}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
               </div>
              </Box>
              <Box className="create-auth-key-row createTemp-container" >
                <Typography className="create-auth-key-label createTemp-typo" >Template Name</Typography>
                <TextField
                  id="standard-basic"
                  label="Template Name"
                  variant="standard"
                  className='createTemp-textField'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Box>
              <Box className="create-auth-key-row createTemp-container" >
                <Typography className="create-auth-key-label">Description</Typography>
                <textarea
  id="standard-basic"
  label="Description"
  placeholder="Give a brief description..."
  value={description}
  rows={10}
  className='createTemp-textField'

  onChange={(e) => {
    setDescription(e.target.value);
  }}
/>

              </Box>
            </Box>
            <Box className="createTemp-boxx3">
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
