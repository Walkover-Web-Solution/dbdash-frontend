import React, { memo, useState, useEffect,useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import './createTemplatePopup.scss';

import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  Autocomplete,
} from '@mui/material';
import { toast } from 'react-toastify';
import { createTemplate, getAllCategoryName } from '../../../api/templateApi';

const CreateTemplatePopup = (props) => {
   console.log("inside CreateTemplatePopup")
  // const [name, setName] = useState('');
  const nameRef = useRef("")
  // const [categoryName, setCategoryName] = useState('');
  const categoryNameRef = useRef("");
  // const [description, setDescription] = useState('');
  const descriptionRef = useRef("");
  const [allCategory, setAllCategory] = useState([]);
  const [disabled,setDisabled]=useState(true);
  // const disabled = !nameRef?.current || !categoryNameRef?.current;

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
      name: nameRef?.current,
      categoryName: categoryNameRef?.current,
      description: descriptionRef?.current,
    };

    if (Array.isArray(allCategory)) {
      data.newCategory = !allCategory.includes(categoryNameRef?.current);
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

  const memoizedButton = useMemo(() => (
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
  ), [disabled]);

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
                    // value={categoryName}
                    onChange={(e, value) => {
                      categoryNameRef.current = value;
                      setDisabled(!categoryNameRef.current)
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
                      categoryNameRef.current = e.target.value;
                      setDisabled(!categoryNameRef.current)
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
              <Box className="create-auth-key-row createTemp-container">
                <Typography className="create-auth-key-label createTemp-typo">Template Name</Typography>
                <TextField
                  id="standard-basic"
                  label="Template Name"
                  variant="standard"
                  className="createTemp-textField"
                  // value={name}
                  onChange={(e) => {
                    nameRef.current = e.target.value;
                    setDisabled(!nameRef.current)
                  }}
                />
              </Box>
              <Box className="create-auth-key-row createTemp-container">
                <Typography className="create-auth-key-label">Description</Typography>
                <textarea
                  id="standard-basic"
                  label="Description"
                  placeholder="Give a brief description..."
                  // value={description}
                  rows={10}
                  className="createTemp-textField"
                  onChange={(e) => {
                    descriptionRef.current = e.target.value;
                    setDisabled(!descriptionRef.current)
                  }}
                />
              </Box>
            </Box>
            <Box className="createTemp-boxx3">
              {memoizedButton}
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
