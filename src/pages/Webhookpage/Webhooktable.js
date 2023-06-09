import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell, Button, Popover } from "@mui/material";
import { PropTypes } from 'prop-types';
import Switch from '@mui/material/Switch';
import { deleteWebhook, getWebhook, updateWebhook } from "../../api/webhookApi";
import MenuIcon from '@mui/icons-material/Menu';
export default function Webhooktable(props) {
    console.log("propssss",props);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  useEffect(async () => {

    const data= await getWebhook(props.dbId);
    props.setTabledata(data?.data?.data);
    
  }, [props.dbId,props.newcreated]);

  useEffect(()=>{
    console.log("dataaa",props.tabledata);
  },[props.tabledata])

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };


  const formatDateTime = (dateTime) => {
    const currentDate = new Date();
    const createdDate = new Date(dateTime);
    const diff = currentDate - createdDate;
 
    if (diff < 1000) {
      return "Just now";
    }
 
    if (diff < 60 * 1000) {
      const seconds = Math.floor(diff / 1000);
      return` ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
 
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
 
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour ${hours !== 1 ? "s" : ""} ago`;
    }
 
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      if (days === 1) {
        return "Yesterday";
      } else {
        const sameYear = currentDate.getFullYear() === createdDate.getFullYear();
        if (sameYear) {
          const monthName = createdDate.toLocaleString("default", { month: "long" });
          const date = createdDate.getDate();
          return `${date} ${monthName}`;
        } else {
          const year = createdDate.getFullYear();
          const monthName = createdDate.toLocaleString("default ", { month: "long" });
          return `${monthName} ${year}`;
        }
      }
    }
 
    if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
     
    }
    const year = createdDate.getFullYear();
    const monthName = createdDate.toLocaleString("default", { month: "long" });
    return `${monthName} ${year}`;
 
  };
  const handleUpdateActive =async (webhookId, active,condition) => {
    const data = {
condition:condition,
      isActive:active==true ?false:true,
    };
    const data1=await updateWebhook(props.dbId, props.tableId, webhookId, data);
    console.log("update",data1);
    props.setTabledata(data1.data.data.webhook);

  };
  
const handleDeleteWebhook=async (webhookId,condition)=>{
    console.log("condition",condition)
const data={condition:condition};
   const data1=await deleteWebhook(props.dbId,props.tableId,webhookId,data);
   console.log("delete",data1);
   setAnchorEl(null);

   props.setTabledata(data1.data.data.webhook);

}
  return (
    <>
      <Box sx={{ border: 1, m: 1 }}>
        <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 533 }}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {props.tabledata && Object.entries(props.tabledata).map(([condition, webhooks]) => (
  Object.entries(webhooks).map(([webhookid, webhook]) => (
    <TableRow key={webhookid} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {webhook.name}
       
      </TableCell>
      <TableCell component="th" scope="row">
        {webhook.url}
      </TableCell>
      <TableCell>{condition}</TableCell>
      <TableCell>
        <span>{formatDateTime(webhook.createdAt)}</span>
      </TableCell>
      <TableCell>
      <div>
        <MenuIcon onClick={toggleDropdown} />
        {isOpen && anchorEl && <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={closeDropdown}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div style={{ padding: '8px' }}>
            <Switch
              checked={webhook.isActive}
              onChange={() => handleUpdateActive(webhookid, webhook.isActive, condition)}
            />
          </div>
          <div style={{ padding: '8px' }}>
            <Button variant="outlined" onClick={() => handleDeleteWebhook(webhookid, condition)}>
              Delete
            </Button>
          </div>
        </Popover>
      }</div>
    </TableCell>
    </TableRow>
  ))
))}

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

Webhooktable.propTypes = {
  dbId: PropTypes.string,
  tabledata:PropTypes.any,
  setTabledata:PropTypes.any,
  tableId:PropTypes.any,
  newcreated:PropTypes.any
 
};