import React ,{useState} from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./Webhookpage.scss";
import Webhooktable from "./Webhooktable";
import Createwebhook from "./createwebhook";


export default function Webhookpage() {
    const[addwebhook,setAddwebhook]=useState(false);

  return (
    <>
    
      <Box className="auth-key-page-container">
          <Button className="mui-button" variant="contained" onClick={()=>setAddwebhook(!addwebhook)} endIcon={<AddIcon />}>
            Add Webhook
          </Button>
       
        <Createwebhook open={addwebhook} setOpen={setAddwebhook}/>
      </Box>

      <Box className="auth-key-page-content">
        <Webhooktable dbId={'64802bf50b74cfa18e9f4132'}/>
      </Box>
    </>
  );
}
