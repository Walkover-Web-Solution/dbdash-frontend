import React from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, } from "react-router-dom";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import "./authKeyPage.scss";
import PropTypes from "prop-types";


export default function AuthKeyPage(props) {
  return (
    <>
      <Box>
        <MainNavbar dbtoredirect={props.dbtoredirect} tabletoredirect={props.tabletoredirect} className="auth-key-page-navbar" />
      </Box>
    
      <Box className="auth-key-page-container">
        <Link to={`/authKeyCreate/${props.dbId}`} state={[props.selectedOption,props.dbtoredirect,props.tabletoredirect]} className="auth-key-page-button">
          <Button className="mui-button" variant="contained" endIcon={<AddIcon />}>
            Create Authkey
          </Button>
        </Link> 
        
      </Box>

      <Box className="auth-key-page-content">
        <AuthKey dbId={props.dbId} />
      </Box>
    </>
  );
}

AuthKeyPage.propTypes={
  dbId:PropTypes.any,
  dbtoredirect:PropTypes.any,
  selectedOption:PropTypes.any,
  tabletoredirect:PropTypes.any
}