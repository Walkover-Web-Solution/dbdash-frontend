import React, { useState, useMemo } from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./authKeyPage.scss";
import PropTypes from "prop-types";
import CreateAuthKey from "../createAuth/createAuth";

export default function AuthKeyPage(props) {
  const [open, setOpen] = useState(false);
  const [authKeys, setAuthKeys] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);

  const handleClose = useMemo(() => {
    return () => {
      setOpen(false);
    };
  }, [setOpen]);

  console.log(props,"props")
  const createAuthKeyComponent = useMemo(
    () => (
      <CreateAuthKey
        createdBy={createdBy}
        setCreatedBy={setCreatedBy}
        heading={"create authkey"}
        alltabledata={props?.alltabledata}
        setAuthKeys={setAuthKeys}
        open={open}
        handleClose={handleClose}
        id={props.dbtoredirect}
      />
    ),
    [open, props.dbtoredirect, handleClose]
  );

 
 const authKeyComponent = useMemo(
   () => (
       <AuthKey
         authKeys={authKeys}
         createdBy={createdBy}
         alltabledata={props?.alltabledata}
         setCreatedBy={setCreatedBy}
         setAuthKeys={setAuthKeys}
         dbId={props.dbtoredirect}
       />
     ),
    [authKeys, createdBy, props.alltabledata, props.dbtoredirect]
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
     
      {open &&   createAuthKeyComponent}
      {/* <CreateAuthKey
        createdBy={createdBy}
        setCreatedBy={setCreatedBy}
        heading={"create authkey"}
        alltabledata={props?.alltabledata}
        setAuthKeys={setAuthKeys}
        open={open}
        handleClose={handleClose}
        id={props.dbtoredirect}
      /> */}
      
      
      <Box className="auth-key-page-content">
   
      {/* <AuthKey
        authKeys={authKeys}
        createdBy={createdBy}
        alltabledata={props?.alltabledata}
        setCreatedBy={setCreatedBy}
        setAuthKeys={setAuthKeys}
        dbId={props.dbtoredirect}
      /> */}
      {authKeyComponent}
      </Box>
    </>
  );
}

AuthKeyPage.propTypes = {
  dbId: PropTypes.any,
  dbtoredirect: PropTypes.any,
  selectedOption: PropTypes.any,
  tabletoredirect: PropTypes.any,
  alltabledata: PropTypes.any,
};
