import React ,{useState} from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./Webhookpage.scss";
import Webhooktable from "./Webhooktable";
import Createwebhook from "./createwebhook";
import PropTypes from "prop-types";


export default function Webhookpage(props) {
    const[addWebhook,setAddWebhook]=useState(false);
 

    const handleAddWebhook = () => {
        setAddWebhook(!addWebhook);
      };
      
  return (
    <>

    
      <Box className="auth-key-page-container">
          <Button className="mui-button" variant="contained" onClick={handleAddWebhook} endIcon={<AddIcon />}>
            Add Webhook
          </Button>
          <Createwebhook
  filters={props?.dataforwebhook[props?.table].filters}
  open={addWebhook}
  setOpen={setAddWebhook}
  handleClose={handleAddWebhook}
/>

      </Box>

      <Box className="auth-key-page-content">
        <Webhooktable dbId={'64802bf50b74cfa18e9f4132'}/>
      </Box>
    </>
  );
}
Webhookpage.propTypes={
    dataforwebhook:PropTypes.any,
    table:PropTypes.any
}