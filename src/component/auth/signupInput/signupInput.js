import React from 'react';
import Button from '@mui/material/Button';
import Joi from 'joi';
import { useValidator } from 'react-joi';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import './signupInput.scss'; // Import the CSS file
import { TextField } from '@mui/material';

export default function SignupInput(props) {
  // Joi implementation
  const { state, setData, setExplicitField, validate } = useValidator({
    initialData: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
    schema: Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(4).required(),
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().min(8).required(),
    }),
    explicitCheck: {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    },
    validationOptions: {
      abortEarly: true,
    },
  });

  const updateFirstName = (e) => {
    e.persist();
    setData((old) => ({
      ...old,
      firstName: e.target.value,
    }));
  };

  const updateLastName = (e) => {
    e.persist();
    setData((old) => ({
      ...old,
      lastName: e.target.value,
    }));
  };

  const updateEmail = (e) => {
    e.persist();
    setData((old) => ({
      ...old,
      email: e.target.value,
    }));
  };

  const updatePassword = (e) => {
    e.persist();
    setData((old) => ({
      ...old,
      password: e.target.value,
    }));
  };

  const updateConfirmPassword = (e) => {
    e.persist();
    setData((old) => ({
      ...old,
      confirmPassword: e.target.value,
    }));
  };

  const onSubmitSignup = (e) => {
    e.preventDefault();
    const userdata = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };
    if (userdata.password === userdata.confirmPassword) {
      props?.signupHandleSubmit(userdata);
    } else {
      toast.error("confirmed password doesn't match");
    }
  };

  return (
    <Box>
    <Box className='flex-col-center-center w-100per h-100per' onSubmit={onSubmitSignup} component="form">
      <Box className="flex-center-center h-100per p-1" >
        <Box className="p-1">
          <TextField size='small' error={state?.$errors?.firstName.length === 0 ? false : state.$errors.firstName ? true : false} required id="firstName" name='firstName' type="text" label="First Name" variant="outlined" onChange={updateFirstName} onBlur={() => setExplicitField("firstName", true)} />
          <Box className='errorContainer'>
            {state.$errors.firstName.map((data) => data.$message).join(",")}
          </Box>
        </Box>
        <Box className="p-1" >
          <TextField size='small' error={state?.$errors?.lastName.length === 0 ? false : state.$errors.lastName ? true : false} required id="lastName" name='lastName' type="text" label="Last Name" variant="outlined" onChange={updateLastName} onBlur={() => setExplicitField("lastName", true)} />
          <Box className='errorContainer'>
            {state.$errors.lastName.map((data) => data.$message).join(",")}
          </Box>
        </Box>
      </Box>

      <Box className="flex-center-center w-100per h-100per ">

        <TextField size='small' className='w-100per m-2 ' error={state?.$errors?.email.length === 0 ? false : state.$errors.email ? true : false} required id="email" name='email' type="email" label="Email" variant="outlined" onChange={updateEmail} onBlur={() => setExplicitField("email", true)} />
      </Box>

      <Box className='errorContainer'>
        {state.$errors.email.map((data) => data.$message).join(",")}
      </Box>

      {/* Password and confirm Password */}
      <Box className="flex-center-center w-100per h-100per">
        <Box className="p-1">
          <TextField size='small' error={state?.$errors?.password.length === 0 ? false : state.$errors.password ? true : false} required id="password" name='password' type="password" label="Password" variant="outlined" onChange={updatePassword} onBlur={() => setExplicitField("password", true)} />
          <Box className='errorContainer'>
            {state.$errors.password.map((data) => data.$message).join(",")}
          </Box>
        </Box>
        <Box className="p-1">
          <TextField size='small' error={state?.$errors?.confirmPassword.length === 0 ? false : state.$errors.confirmPassword ? true : false} required id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" variant="outlined" onChange={updateConfirmPassword} onBlur={() => setExplicitField("confirmPassword", true)} />
          <Box className='errorContainer'>
            {state.$errors.confirmPassword.map((data) => data.$message).join(",")}
          </Box>
        </Box>
      </Box>

      <Button className='primary-btn mt-2' type='submit' onClick={validate} variant="contained">Sign up</Button>
    
    </Box>
  </Box>
  );
}

SignupInput.propTypes = {
  signupHandleSubmit: PropTypes.func,
};
