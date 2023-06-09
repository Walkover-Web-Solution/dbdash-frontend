import React from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AuthKeyHeader from "../../component/authKeyComponents/authKeyHeader";
import { Link, useParams ,useLocation} from "react-router-dom";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import "./authKeyPage.scss";


export default function authKeyPage() {
  const { id } = useParams();
  return (
    <>
      <Box>
        <MainNavbar dbtoredirect={useLocation().state[1]} tabletoredirect={useLocation().state[2]} className="auth-key-page-navbar" />
      </Box>
    
      <Box className="auth-key-page-container">
        <Link to={`/authKeyCreate/${id}`} state={useLocation().state} className="auth-key-page-button">
          <Button className="mui-button" variant="contained" endIcon={<AddIcon />}>
            Create Authkey
          </Button>
        </Link>
        
        <AuthKeyHeader  tabletoredirect={useLocation().state[2]} id={id} />
      </Box>

      <Box className="auth-key-page-content">
        <AuthKey dbId={id} />
      </Box>
    </>
  );
}
