import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import { PropTypes } from 'prop-types';
import Switch from '@mui/material/Switch';
import { getWebhook, updateWebhook } from "../../api/webhookApi";

export default function Webhooktable(props) {
   
const [tabledata,setTabledata]=useState({})
  useEffect(async () => {

    console.log("dbId");
    const data= await getWebhook(props.dbId);
    setTabledata(data.data.data);
  }, [props.dbId]);

  useEffect(()=>{
    console.log("dataaa",tabledata);
  },[tabledata])
  

  const formatDateTime = (dateTime) => {
    const currentDate = new Date();
    const createdDate = new Date(dateTime);
    const diff = currentDate - createdDate;
  
    if (diff < 1000) {
      return "Just now";
    }
  
    if (diff < 60 * 1000) {
      const seconds = Math.floor(diff / 1000);
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
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
  const handleUpdateActive = (webhookId, active,condition) => {
    const data = {
condition:condition,
      isActive:!active,
    };
    updateWebhook(props.dbId, props.tableId, webhookId, data);
  };
  

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
            {tabledata && Object.entries(tabledata).map(([condition, webhooks]) => (
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
      <TableCell><Switch checked={webhook.isActive} onChange={()=>handleUpdateActive(webhookid,webhook.isActive,condition)}/></TableCell>
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
  tableId:PropTypes.any,
 
};
