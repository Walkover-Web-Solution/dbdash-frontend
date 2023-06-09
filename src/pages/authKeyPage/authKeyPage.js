import React,{useState} from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./authKeyPage.scss";
import PropTypes from "prop-types";
import CreateAuthKey from "../createAuth/createAuth";


export default function AuthKeyPage(props) {
  console.log("props AuthKeyPAge",props)
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
 

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
        <CreateAuthKey open={open} handleClose={handleClose}  id={props.dbtoredirect} />
      )}
      <Box className="auth-key-page-content">
        <AuthKey dbId={props.dbtoredirect} />
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