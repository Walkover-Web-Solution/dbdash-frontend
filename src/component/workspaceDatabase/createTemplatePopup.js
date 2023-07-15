import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../pages/Webhookpage/Webhookpage.scss";
import CloseIcon from '@mui/icons-material/Close';

import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  Autocomplete,
} from '@mui/material';
import { toast } from "react-toastify";
import { createTemplate, getAllCategoryName } from '../../api/templateApi';
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
            className="create-auth-key-main-container"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}  
            sx={{p:0,border:'none',width:'50vw'}}
          >
               <div className="popupheader">    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
            create template
          </Typography><CloseIcon sx={{  '&:hover': { cursor: 'pointer' } }} onClick={handleClose}/></div>
            <Box className="create-auth-key-content-container">
              <Box className="create-auth-key-row" sx={{display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',justifyContent:'space-between ',width:'100%',alignItems:'center'}}>
              <Typography className="create-auth-key-label" sx={{width:'fit-content',paddingLeft:2,paddingBottom:0}}>Category Name</Typography>

              <Autocomplete
      id="country-select-demo"
      value={categoryName}
      onChange={(e, value) => {
        setCategoryName(value);
      }}
      sx={{width:'68%',m:2,mb:0}}
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
              <Box className="create-auth-key-row" sx={{m:2}} >
                <Typography className="create-auth-key-label" sx={{width:'fit-content',paddingRight:'10px'}}>Template Name</Typography>
                <TextField
                  id="standard-basic"
                  label="Template Name"
                  variant="standard"
                  sx={{width:'70%'}}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Box>
              <Box className="create-auth-key-row" sx={{m:2}}>
                <Typography className="create-auth-key-label">Description</Typography>
                <textarea
  id="standard-basic"
  label="Description"
  placeholder="Give a brief description..."
  value={description}
  rows={10}
  style={{width:'70%'}}

  onChange={(e) => {
    setDescription(e.target.value);
  }}
/>

              </Box>
            </Box>
            <Box sx={{ display: "flex", m:2,justifyContent: "space-between" }}>
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
