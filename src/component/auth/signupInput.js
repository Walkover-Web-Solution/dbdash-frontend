import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Joi  from "joi"
import { useValidator } from "react-joi"
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function SignupInput(props) {
    // Joi implementation
    const { state, setData, setExplicitField, validate } = useValidator({
      
        initialData: {
          firstName: null,
          lastName: null,
          email:null,
          password:null,
          confirmPassword:null
        },
        schema: Joi.object({
          firstName: Joi.string().min(3).required(),
          lastName: Joi.string().min(4).required(),
            email: Joi.string()
                .email({
                    tlds: { allow: false },
                })
                .required(),
          password: Joi.string().min(8).required(),
          confirmPassword: Joi.string().min(8).required(),
        }),
        explicitCheck: {
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false
        },
        validationOptions: {
            abortEarly: true,
        },
    })
    const updateFirstName = (e) => {
        // react < v17
        e.persist()
        setData((old) => ({
            ...old,
            firstName: e.target.value,
        }))
    }
    const updateLastName = (e) => {
      // react < v17
      e.persist()
      setData((old) => ({
          ...old,
          lastName: e.target.value,
      }))
    }
    const updateEmail = (e) => {
        // react < v17
        e.persist()
        setData((old) => ({
            ...old,
            email: e.target.value,
        }))
    }
    const updatePassword = (e) => {
      // react < v17
      e.persist()
      setData((old) => ({
          ...old,
          password: e.target.value,
      }))
    }
    const updateConfirmPassword = (e) => {
        // react < v17
        e.persist()
        setData((old) => ({
            ...old,
            confirmPassword: e.target.value,
        }))
      }

    const onSubmitSignup = (e)=>{
      e.preventDefault();

      const userdata = {
        firstName : e.target.firstName.value,
        lastName : e.target.lastName.value,
        email : e.target.email.value,
        password : e.target.password.value,
        confirmPassword : e.target.confirmPassword.value,
      }
      if(userdata.password === userdata.confirmPassword)
      {
        props?.signupHandleSubmit(userdata);
      }
    }
  return (
    <Box>
        <Box onSubmit={onSubmitSignup} component="form" sx={{display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',backgroundColor:"white"}}>

        {/* First name and last name */}
        <Box sx={{ display: 'flex',flexDirection: 'row',justifyContent: 'center',alignItems: 'center',  px:2}} >
          <Box sx={{m:1}}>
            <TextField error={state?.$errors?.firstName.length === 0 ?false:state.$errors.firstName?true:false} required id="firstName" name='firstName' type="text" label="First Name" variant="outlined" onChange={updateFirstName}  onBlur={() => setExplicitField("firstName", true)}/>

            <Box sx={{color:'red', fontSize:'14px', padding:'3px'}}>
                {state.$errors.firstName.map((data) =>data.$message).join(",")}
            </Box>
          </Box>

          <Box sx={{m:1}}>
            <TextField error={state?.$errors?.lastName.length === 0 ?false:state.$errors.lastName?true:false} required id="lastName" name='lastName' type="text" label="Last Name" variant="outlined" onChange={updateLastName}  onBlur={() => setExplicitField("lastName", true)} />
            
            <Box sx={{color:'red', fontSize:'14px',padding:'3px'}}>
             {state.$errors.lastName.map((data) => data.$message).join(",")}
            </Box>
          </Box>
        </Box>

        {/* Email */}
        <Box sx={{width:'100%', height:'100%',display: 'flex',flexDirection: 'row',justifyContent: '',alignItems: 'center',px:2}}>
          <TextField error={state?.$errors?.email.length === 0 ?false:state.$errors.email?true:false} sx={{mx:3,width:"100%", height:"auto"}} required id="email" name='email' type="email" label="Email" variant="outlined" onChange={updateEmail}  onBlur={() => setExplicitField("email", true)} />
        </Box>
            <Box sx={{color:'red', fontSize:'14px',padding:'3px'}}>
                {state.$errors.email.map((data) => data.$message).join(",")}
            </Box>

        {/* Password and confirm Password */}
        <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'center',alignItems: 'center',px:2 }}>
          <Box sx={{m:1}}>
            <TextField error={state?.$errors?.password.length === 0 ?false:state.$errors.password?true:false} required sx={{width:"auto", height:"auto"}}  id="password" name='password' type="password" label="Password" variant="outlined" onChange={updatePassword}  onBlur={() => setExplicitField("password", true)}/>
              <Box style={{color:'red', fontSize:'14px',padding:'3px'}}>
                {state.$errors.password.map((data) => data.$message).join(",")}
              </Box>
          </Box>

          <Box sx={{m:1}}>
            <TextField error={state?.$errors?.confirmPassword.length === 0 ?false:state.$errors.confirmPassword?true:false} required id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" variant="outlined" onChange={updateConfirmPassword}  onBlur={() => setExplicitField("confirmPassword", true)}/>

            <Box style={{color:'red', fontSize:'14px',padding:'3px'}}>
                {state.$errors.confirmPassword.map((data) => data.$message).join(",")}
            </Box>

          </Box>
        </Box>

        <Button type='submit' onClick={validate} sx={{bgcolor: 'text.primary', width:"50%", my:1}} variant="contained">Signup</Button>
        </Box>
    </Box>
  )
}
SignupInput.propTypes = {
  signupHandleSubmit: PropTypes.func
}