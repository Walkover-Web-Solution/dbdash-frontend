import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import './createTemplatePopup.scss';

import {
  Box,
  Typography,
  Button,
  Modal,
  Autocomplete,
} from '@mui/material';
import { toast } from 'react-toastify';
import { createTemplate, getAllCategoryName } from '../../../api/templateApi';
import CustomTextField from '../../../muiStyles/customTextfield';

const CreateTemplatePopup = (props) => {

  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [allCategory, setAllCategory] = useState([]);
  const disabled = !name || !categoryName;

  const handleClose = () => {
    props?.setOpen(false);
  };

  useEffect(() => {
    const fetchAllCategory = async () => {
      const allCategoryResponse = await getAllCategoryName();
      const allCategoryData = allCategoryResponse?.data?.data || [];
      const values = allCategoryData
        .map((obj) => obj?.fld1yhgjz9fg)
        .filter((obj) => obj !== null && obj !== '');
      setAllCategory(values);
    };
    fetchAllCategory();
  }, []);

  const handleCreateTemplate = async () => {
    const data = {
      name: name,
      categoryName: categoryName,
      description: description,
    };

    if (Array.isArray(allCategory)) {
      data.newCategory = !allCategory.includes(categoryName);
    }
    try {
      await createTemplate(props?.dbId, data);
      toast.success('Template created successfully!');
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to create template.');
    }
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
            <div className="popupheader">
              <Typography className="createTemp-typography" id="title" variant="h6" component="h2">
                create template
              </Typography>
              <CloseIcon className="createTemp-close-icon" onClick={handleClose} />
            </div>
            <Box className="create-auth-key-content-container">
              <Box className="create-auth-key-row createTemp-box2">
                <div className="createTemp-div">
                  <Typography className="create-auth-key-label createTemp-catagory">Category Name</Typography>

                  <Autocomplete
                    id="country-select-demo"
                    value={categoryName}
                    onChange={(e, value) => {
                      setCategoryName(value);
                    }}
                    className="createTemp-autocomplete"
                    options={allCategory || []}
                    freeSolo={true}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option}
                      </Box>
                    )}
                    onInputChange={(e) => {
                      setCategoryName(e.target.value);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
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
              <Box className="create-auth-key-row createTemp-container">
                <Typography className="create-auth-key-label createTemp-typo">Template Name</Typography>
                <CustomTextField
                  id="standard-basic"
                  label="Template Name"
                  variant="standard"
                  className="createTemp-textField"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Box>
              <Box className="create-auth-key-row createTemp-container">
                <Typography className="create-auth-key-label">Description</Typography>
                <textarea
                  id="standard-basic"
                  label="Description"
                  placeholder="Give a brief description..."
                  value={description}
                  rows={10}
                  className="createTemp-textField"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Box>
            </Box>
            <Box className="createTemp-boxx3">
              <Button
                variant="contained"
                className={`create-auth-key-button ${disabled ? 'mui-button-disabled' : 'mui-button'}`}
                onClick={() => {
                  handleCreateTemplate();
                  handleClose();
                }}
                disabled={disabled}
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

export default memo(CreateTemplatePopup);

CreateTemplatePopup.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.any,
  dbId: PropTypes.any,
  db: PropTypes.any,
};
