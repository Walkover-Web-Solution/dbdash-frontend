import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from "prop-types";

const Protected = ({ children }) => {
  if(!sessionStorage.getItem('sessionId')){
    let sessionId = `${Math.floor(Math.random()*1000)}${new Date().getTime()}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to='/' />;

  }
  return children;
};

export default Protected;

Protected.propTypes = {
  children: PropTypes.node
};