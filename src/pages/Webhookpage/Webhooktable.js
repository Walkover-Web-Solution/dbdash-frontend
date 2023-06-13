import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell,  } from "@mui/material";
import { PropTypes } from 'prop-types';
import {  deleteWebhook, getWebhook, updateWebhook } from "../../api/webhookApi";
import MenuIcon from '@mui/icons-material/MoreHoriz';
// import { useSelector } from "react-redux";


import Webhooktablemenu from "./Webhooktablemenu";
// import { allOrg } from "../../store/database/databaseSelector";
export default function Webhooktable(props) {


  const [anchorEl, setAnchorEl] = useState(null);
  const[wbhookid,setWbhookid]=useState('');
  const[wbhookcondition,setWbhookcondition]=useState('');
  const[wbhookactive,setWbhookactive]=useState('');
  const[name,setName]=useState('');
  const[url,setUrl]=useState('');
  const[filters,setFilters]=useState('')

  useEffect(async () => {

    const data= await getWebhook(props.dbId);
    props.setTabledata(data?.data?.data);
    
  }, [props.dbId,props.newcreated]);

  useEffect(()=>{
  },[props.tabledata])

  const toggleDropdown = (event) => {
  
    setAnchorEl(event.currentTarget);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };
  const handleDeleteWebhook = async () => {
    const data = { condition: wbhookcondition };
    const data1 = await deleteWebhook(props.dbId, props.tableId, wbhookid, data);
    closeDropdown();
    props.setTabledata(data1.data.data);

  };
  const handleUpdateActive = async () => {
    const data = {
      condition: wbhookcondition,
      isActive: wbhookactive === true ? false : true,
    };
    const data1 = await updateWebhook(props.dbId, props.tableId, wbhookid, data);
    setWbhookactive('');
    setWbhookcondition('');
    setWbhookid('');
    props.setTabledata(data1.data.data.webhook);
  };
console.log(props,"j")
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
 
//   const filterNames = Object.values(props.filters).map(filter => filter.filterName);
// console.log(filterNames,"filterNames")
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
                <TableCell>Filters</TableCell>
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
{/* 
      {filterNames.map((name, index) => (
      <TableCell component="th" scope="row" key={index}>
        {name}
      </TableCell>
  ))} */}

<TableCell>
        <span>{webhook.filterId}</span>
      </TableCell>


      <TableCell>
        <span>{formatDateTime(webhook.createdAt * 1000)}</span>
      </TableCell>

      <TableCell >
      
      <div>

        <MenuIcon onClick={(event)=>{
          setWbhookactive(webhook.isActive);
          setWbhookcondition(condition);
          setName(webhook.name);
          setWbhookid(webhookid);
          setUrl(webhook.url);
          setFilters(webhook.filterId)
          toggleDropdown(event)}}           
          />
          
        {anchorEl &&   <Webhooktablemenu newcreated={props.newcreated}
          setNewcreated={props.setNewcreated} filters={props.filters} tableId={props?.tableId} dbId={props?.dbId} filterId={filters} weburl={url} condition={ wbhookcondition}  webhookname={name} webhookid={wbhookid} handleDeleteWebhook={handleDeleteWebhook} handleUpdateActive={handleUpdateActive} anchorEl={anchorEl}  closeDropdown={closeDropdown}   isActive={wbhookactive}   />
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

  filters:PropTypes.any,
  dbId: PropTypes.string,
  tabledata:PropTypes.any,
  setTabledata:PropTypes.any,
  tableId:PropTypes.any,
  setNewcreated:PropTypes.any,
  newcreated:PropTypes.any
 
};

