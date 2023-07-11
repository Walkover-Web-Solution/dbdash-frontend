import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./Webhookpage.scss";
import Webhooktable from "./Webhooktable";
import Createwebhook from "./createwebhook";
import PropTypes from "prop-types";
export default function Webhookpage(props) {

  const [addWebhook, setAddWebhook] = useState(false);
  const [newcreated, setNewcreated] = useState(0);

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
          newcreated={newcreated}
          tables={props?.tables}
          setNewcreated={setNewcreated}
          dbId={props.dbId}
          tableId={props.table} 
          dataforwebhook={props?.dataforwebhook}
          heading={'create webhook'}
          open={addWebhook}
          setOpen={setAddWebhook}
          handleClose={handleAddWebhook}
        />
      </Box>

      <Box className="auth-key-page-content">
        <Webhooktable     dataforwebhook={props?.dataforwebhook}  setNewcreated={setNewcreated} newcreated={newcreated} dbId={props.dbId} tableId={props.table} />
      </Box>
    </>
  );
}
Webhookpage.propTypes = {
  dataforwebhook: PropTypes.any,
  table: PropTypes.any,
  dbId: PropTypes.any,
  tables:PropTypes.any,
}