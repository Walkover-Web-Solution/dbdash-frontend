import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell, Tooltip } from "@mui/material";
import { PropTypes } from 'prop-types';
import { getAuthkey, deleteAuthkey } from "../../api/authkeyApi";
import TableMenuDropdown from "./../../component/authKeyComponents/tableMenuDropdown";
import { useSelector } from "react-redux";
import { allOrg } from "../../store/database/databaseSelector";
import { getWebhook } from "../../api/webhookApi";

export default function Webhooktable(props) {
  const adminId = localStorage.getItem("userid");
  const [authKeys, setAuthKeys] = useState(null);
  const user = useSelector((state) => allOrg(state));
const [tabledata,setTabledata]=useState({})
  useEffect(async () => {

    const data= await getWebhook(props.dbId);
    setTabledata(data.data.data);
  }, []);

  useEffect(()=>{
    console.log("dataaa",tabledata);
  },[tabledata])
  

  async function deleteAuthkeyFun(authKey) {
    const data = await deleteAuthkey(props.dbId, adminId, authKey);
    const dataa = await getAuthkey(props.dbId, adminId);
    setAuthKeys(dataa?.data?.data);
    return data;
  }

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
                <TableCell>Last Used</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {Object.entries(tabledata).map(([condition, webhooks]) => (
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
      <TableCell>{webhook.isActive}</TableCell>
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
  scope: PropTypes.any,
  selected: PropTypes.any
};
