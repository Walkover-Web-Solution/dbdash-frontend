import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {  toast } from 'react-toastify';
import CustomTextField from '../../muiStyles/customTextfield';

const Msg91bi_id_page = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (value.length > 3) {
      navigate(`/chat/${value}`);
      const notify = () => toast.success('Successfully entered');
      notify()
    } else {
      // Show an error message or handle the case when the value is not valid
      const notify = () => toast.error('Textarea value must be more than three characters.');
      notify()
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box width={"100vw"} height={"100vh"} bgcolor={"#dadada"} >
      <Box width={"40vw"} height={"70vh"} sx={{position : "absolute" , left: "50%" , top : "50%" , transform : "translate(-50% , -50%)" , display : "flex" , justifyContent : "center" , alignItems : "center" , flexDirection : "column" }}>
        <br/>
        <Typography variant="h3">
          Enter your Id Here                 
        </Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <form onSubmit={handleSubmit} style={{display : "flex"}}>
          <CustomTextField
            label="Enter a value"
            value={value}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Msg91bi_id_page;
