import React, { useState } from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./authKeyPage.scss";
import PropTypes from "prop-types";
import CreateAuthKey from "../createAuth/createAuth";

export default function AuthKeyPage(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const [authKeys, setAuthKeys] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);

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
      {open && (
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
      )}

      <Box className="auth-key-page-content">
        <AuthKey
          authKeys={authKeys}
          createdBy={createdBy}
          alltabledata={props?.alltabledata}
          setCreatedBy={setCreatedBy}
          setAuthKeys={setAuthKeys}
          dbId={props.dbtoredirect}
        />
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
