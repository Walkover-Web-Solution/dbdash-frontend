import React from "react";
import AuthKey from "../component/authKeyComponents/authKeyTable";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AuthKeyHeader from "../component/authKeyComponents/authKeyHeader";
import { Link,useParams } from "react-router-dom";
import MainNavbar from "../component/mainNavbar";

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
     
     </Box>

     <Box sx={{ display: "flex", justifyContent: "space-between", m: 1.3, mt: 1.7 }}>
  <Link to={`/authKeyCreate/${id}`} style={{ textDecoration: 'none' }}>
    <Button variant="contained" style={{borderRadius:0}} endIcon={<AddIcon />}>
      Create Authkey
    </Button>
  </Link>
  <AuthKeyHeader id={id} />
</Box>


      <Box sx={{ mt: 2 }}>
        <AuthKey dbId={id}/>
      </Box>
    </>
  );
}
