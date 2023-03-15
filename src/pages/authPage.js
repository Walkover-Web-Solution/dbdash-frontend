import React from 'react'
import Box from '@mui/material/Box';
import { useState } from 'react';
import { UserAuth } from '../context/authContext.js'
import GoogleAuth from '../component/auth/googleAuth';
import SignupInput from '../component/auth/signupInput';
import LoginInput from '../component/auth/loginInput';
import {Container} from '@mui/material';

export default function Authpage() {

  const [isLogin, setIsLogin] = useState(true)

  const usera = UserAuth();
  const signUp = usera?.signUp;
  const signIn = usera?.signIn;

  const signupHandleSubmit = async (userdata) => {
    const email = userdata.email;
    const password = userdata.password;
    const firstName = userdata.firstName;
    const lastName = userdata.lastName;

    await signUp(email, password, firstName, lastName);
  }
  const loginHandleSubmit = async (userdata) => {
    const email = userdata.email;
    const password = userdata.password;
    await signIn(email, password);

  }
  return (
    <Container sx={{display: 'flex',  justifyContent: 'center', backgroundColor: "rgb(211, 211, 211,0.3)", padding:0 }}>
    
      <Box sx={{backgroundColor: "white", width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3, borderRadius: 4, mt:2, mb:2,height:510 }}>

        <Box sx={{m:2}}>
          {/* <img style={{ width: "100px"}}
            src="https://uploads-ssl.webflow.com/63403f10e7b52a177fd0c2ac/634934b92269c62bb6cf2e0a_Logo.png"
            alt="Via Socket"
          /> */}

          <h3>DB DASH</h3>
        </Box>

        <h2 style={{marginBottom:'15px'}}>
          {isLogin === false ? "Create Your Account!" : "Welcome Back!"}
        </h2>

        <Box>
          <GoogleAuth />
        </Box>

        <p  style={{marginTop:'15px'}}>or</p>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* condition to show login page or signup page */}
          {isLogin === true ? <LoginInput loginHandleSubmit={loginHandleSubmit} /> : <SignupInput signupHandleSubmit={signupHandleSubmit} />}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {isLogin === true ? <h4>No account? <span onClick={() => { setIsLogin(false) }} style={{ color: "blueviolet", cursor: 'pointer', textDecoration: 'underline' }}>Create an account!</span> </h4> : <h4>Already a User? <span onClick={() => { setIsLogin(true) }} style={{ color: "blueviolet", cursor: 'pointer', textDecoration: 'underline' }} >Login</span> </h4>}

        </Box>

      </Box>
    </Container>
  )
}