import { Box } from "@mui/material";
import React from "react";
// import PropTypes from "prop-types";
import Navbar from "../component/apiDoc/navbarApi/navbarApi";
import MainNavbar from "../component/mainNavbar/mainNavbar";

function ApiDocPage() {

    return (
        <>
        <Box>
      <MainNavbar/>
    </Box>
    <Box sx={{mt:"8vh"}}>
        <Navbar/>
        </Box>
   </>
    );
}

export default ApiDocPage;

