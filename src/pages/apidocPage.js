import { Box } from "@mui/material";
import React,{useState} from "react";
// import PropTypes from "prop-types";
import Navbar from "../component/apiDoc/navbarApi/navbarApi";
import MainNavbar from "../component/mainNavbar/mainNavbar";
import {  useLocation, useParams } from "react-router-dom";

function ApiDocPage() {
  const params=useParams();
  const location = useLocation();
  const[dbtoredirect,setDbtoredirect]=useState(params.dbId || params.id);
  
  const[tabletoredirect,setTabletoredirect]=useState(location.state);
    return (
        <>
        <Box>
      <MainNavbar dbtoredirect={dbtoredirect} tabletoredirect={tabletoredirect}/>
    </Box>
    <Box sx={{mt:"8vh"}}>
        <Navbar dbtoredirect={dbtoredirect} tabletoredirect={tabletoredirect} setDbtoredirect={setDbtoredirect} setTabletoredirect={setTabletoredirect} />
        </Box>
   </>
    );
}

export default ApiDocPage;

