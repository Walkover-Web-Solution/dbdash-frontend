import { Box } from "@mui/material";
import React from "react";
// import PropTypes from "prop-types";
import Navbar from "../component/apiDoc/navbarApi";
import MainNavbar from "../component/mainNavbar";

function ApiDocPage() {

    return (
        <>
        <Box>
      <MainNavbar/>
    </Box>
        <Navbar/>
   </>
    );
}

export default ApiDocPage;

