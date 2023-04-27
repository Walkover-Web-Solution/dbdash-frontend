import React from "react";
import AuthKey from "../../component/authKeyComponents/authKeyTable/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AuthKeyHeader from "../../component/authKeyComponents/authKeyHeader/authKeyHeader";
import { Link,useParams } from "react-router-dom";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import './authKeyPage.css'
export default function AuthKeyPage() {
  // const location = useLocation();
//the data here will be an object since an object was
// const dbId = location.state;
  const { id } = useParams();
  return (
    <>
    <Box>
      <MainNavbar/>
    </Box>
    
     <Box>
     <AuthKeyHeader id ={ id}/>
     </Box>

      <Box className="boxone" >
        <Link to ={`/authKeyCreate/${id}`}  className="dontdecorate" >
        <Button variant="contained" startIcon={<AddIcon/>}>
          Create Authkey
        </Button>
        </Link>
      </Box>

      <Box className="mt2" >
        <AuthKey dbId={id}/>
      </Box>
    </>
  );
}
