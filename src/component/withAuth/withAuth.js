import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from "prop-types";

const WithAuth = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        return <Navigate to='/dashboard' />;
    }
    return children;
};

WithAuth.propTypes = {
    children: PropTypes.element,
}

export default WithAuth;