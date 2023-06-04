import { Box } from "@mui/material";
import React,{useState} from "react";
// import PropTypes from "prop-types";
import Navbar from "../component/apiDoc/navbarApi/navbarApi";
import MainNavbar from "../component/mainNavbar/mainNavbar";
import {  useLocation, useParams } from "react-router";

function ApiDocPage() {
  const params=useParams();
  const[dbtoredirect,setDbtoredirect]=useState(params.dbId);
  
  const[tabletoredirect,setTabletoredirect]=useState(useLocation().state);
    return (
        <>
        <Box>
      <MainNavbar dbtoredirect={dbtoredirect} tabletoredirect={tabletoredirect}/>
    </Box>
    <Box sx={{mt:"8vh"}}>
        <Navbar setDbtoredirect={setDbtoredirect} setTabletoredirect={setTabletoredirect} />
        </Box>
   </>
    );
}

export default ApiDocPage;

