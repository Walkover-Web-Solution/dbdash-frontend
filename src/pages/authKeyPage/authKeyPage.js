import React, { useState, useMemo } from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./authKeyPage.scss";
import PropTypes from "prop-types";
import CreateAuthKey from "../createAuth/createAuth";

export default function AuthKeyPage(props) {

  const [open, setOpen] = useState(false);
  
  const [createdBy, setCreatedBy] = useState(null);

 
  const handleClose = () => {
    setOpen(false);
  }

  
  const createAuthKeyComponent = useMemo(
    () => (
      <CreateAuthKey
        createdBy={createdBy}
        setCreatedBy={setCreatedBy}
        heading={"create authkey"}
        alltabledata={props?.alltabledata}
        setAuthKeys={props?.setAuthKeys}
        open={open}
        handleClose={handleClose}
        id={props.dbtoredirect}
      />
    ),
    [open, createdBy, props.alltabledata, props.dbtoredirect, handleClose]
  );

 

  return (
    <>
      <Box className="auth-key-page-container">
        
        <Button
          className="mui-button"
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
          endIcon={<AddIcon />}
        >
          Create Authkey
        </Button>
      </Box>
     
      {open && createAuthKeyComponent}
      <Box className="auth-key-page-content">
   
      <AuthKey
        authKeys={props?.authKeys}
        createdBy={createdBy}
        alltabledata={props?.alltabledata}
        setCreatedBy={setCreatedBy}
        dbId={props.dbtoredirect}
        setAuthKeys={props?.setAuthKeys}
      />
      </Box>
    </>
  );
}

AuthKeyPage.propTypes = {
  authKeys:PropTypes.any,
  setAuthKeys:PropTypes.any,
  dbId: PropTypes.any,
  dbtoredirect: PropTypes.any,
  selectedOption: PropTypes.any,
  tabletoredirect: PropTypes.any,
  alltabledata: PropTypes.any,

};
