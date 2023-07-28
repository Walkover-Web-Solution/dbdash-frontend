import React, { useState } from "react";
import Box from "@mui/material/Box";
import { UserAuth } from "../../context/authContext.js";
import SignupInput from "../../component/auth/signupInput/signupInput.js";
import LoginInput from "../../component/auth/loginInput/loginInput.js";
import GoogleAuth from "../../component/auth/googleAuth/googleAuth.js";
import "./authPage.scss";
import { Typography } from "@mui/material";

export default function Authpage() {
  const [isLogin, setIsLogin] = useState(true);
  const usera = UserAuth();
  const signUp = usera?.signUp;
  const signIn = usera?.signIn;

  const signupHandleSubmit = async (userdata) => {
    const email = userdata.email;
    const password = userdata.password;
    const firstName = userdata.firstName;
    const lastName = userdata.lastName;

    await signUp(email, password, firstName, lastName);
  };
  const loginHandleSubmit = async (userdata) => {
    const email = userdata.email;
    const password = userdata.password;
    await signIn(email, password);
  };
  return (
    <Box className="flex-center-center authPageMainContainer">
      <Box className="flex-col-center-center authContainer2">
        <Box className='socketAuthPageLogo'>
          <h3>DB DASH</h3>
        </Box>

        <Typography align="center" className="headingAuthPage" variant="h1" fontSize={33}>
          {isLogin == false ? "Create Your Account!" : "Welcome Back!"}
        </Typography>

          <GoogleAuth />

          <p className="orText">or</p>
          {/* condition to show login page or signup page */}
          {isLogin === true ? (
            <LoginInput loginHandleSubmit={loginHandleSubmit} />
          ) : (
            <SignupInput signupHandleSubmit={signupHandleSubmit} />
          )}

        {
          isLogin == true
            ?
            <h4> No account?{" "} <span className="bottomLine" onClick={() => { setIsLogin(false); }}> Create an account!</span>{" "}</h4>
            :
            <h4> Already a User?{" "} <span className="bottomLine" onClick={() => { setIsLogin(true); }}>Login</span>{" "}</h4>
        }
      </Box>
    </Box>
  );
}
