import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from "prop-types";


const Protected = ({ children }) => {
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