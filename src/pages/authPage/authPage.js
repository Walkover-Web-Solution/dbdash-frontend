import React, { useState } from "react";
import Box from "@mui/material/Box";
import { UserAuth } from "../../context/authContext.js";
import SignupInput from "../../component/auth/signupInput/signupInput.js";
import LoginInput from "../../component/auth/loginInput/loginInput.js";
import { Container } from "@mui/material";
import GoogleAuth from "../../component/auth/googleAuth/googleAuth.js";
import "./authPage.scss";

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
    <Container className="authpage-container">
      <Box className="authpage-main-box">
        <Box className="authpage-box-2">
          <h3>DB DASH</h3>
        </Box>

        <h2 className="authpage-h2">
          {isLogin === false ? "Create Your Account!" : "Welcome Back!"}
        </h2>

        <Box>
          <GoogleAuth />
        </Box>

        <p className="authpage-p">or</p>
        <Box className="authpage-box-4">
          {/* condition to show login page or signup page */}
          {isLogin === true ? (
            <LoginInput loginHandleSubmit={loginHandleSubmit} />
          ) : (
            <SignupInput signupHandleSubmit={signupHandleSubmit} />
          )}
        </Box>

        <Box className="authpage-box-4">
          {isLogin === true ? (
            <h4>
              No account?{" "}
              <span
                onClick={() => {
                  setIsLogin(false);
                }}
                className="blueviolet"
              >
                Create an account!
              </span>{" "}
            </h4>
          ) : (
            <h4>
              Already a User?{" "}
              <span
                onClick={() => {
                  setIsLogin(true);
                }}
                className="blueviolet"
              >
                Login
              </span>{" "}
            </h4>
          )}
        </Box>
      </Box>
    </Container>
  );
}
