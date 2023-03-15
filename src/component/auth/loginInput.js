import React from 'react'
import Joi from "joi"
import { useValidator } from "react-joi"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function LoginInput(props) {

    // Joi implementation
    const { state, setData, setExplicitField, validate } = useValidator({
        initialData: {
            email: null,
            password: null,
        },
        schema: Joi.object({
            password: Joi.string().min(8).required(),
            email: Joi.string()
                .email({
                    tlds: { allow: false },
                })
                .required(),
        }),
        explicitCheck: {
            email: false,
            password: false,
        },
        validationOptions: {
            abortEarly: true,
        },
    })
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


    const onSubmitLogin = (e)=>{
        e.preventDefault();
        const userdata = {
            email : e.target.email.value,
            password : e.target.password.value
        }
        props?.loginHandleSubmit(userdata);
    }


  return (
    
        <Box onSubmit={onSubmitLogin} component="form"  sx={{width:'auto', height:'auto', display: 'flex',flexDirection: 'column',alignItems: 'center' }}>

        <Box sx={{m:2}}>

        <TextField error={state?.$errors?.email.length === 0 ?false:state.$errors.email?true:false} required id="email" name='email' label="Email" type="email" variant="outlined" onChange={updateEmail} onBlur={() => setExplicitField("email", true)}/>

         {/* error display */}
        <Box style={{color:'red', fontSize:'12px', margin:'2px'}}>
        {state.$errors.email.map((data) => data.$message).join(",")}
        </Box>

        </Box>

        <Box sx={{m:1}}>

        <TextField error={state?.$errors?.password.length === 0 ?false:state.$errors.password?true:false} required id="password" name='password' label="Password" type="password" variant="outlined" onChange={updatePassword} onBlur={() => setExplicitField("password", true)}/>

        {/* error display */}
        <Box style={{color:'red', fontSize:'12px'}}>
        {state.$errors.password.map((data) => data.$message).join(",")}
        </Box>

        </Box>

         <Button onClick={validate} type='submit' sx={{bgcolor: 'text.primary', width:"50%", my:2}} variant="contained">Login</Button>
         
    </Box>
    
  )
}
LoginInput.propTypes = {
    loginHandleSubmit: PropTypes.func
}






