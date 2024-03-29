import React, {  useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell, } from "@mui/material";
import { PropTypes } from 'prop-types';
import { deleteWebhook, updateWebhook } from "../../api/webhookApi";
import MenuIcon from '@mui/icons-material/MoreHoriz';
import Webhooktablemenu from "./Webhooktablemenu";
import './Webhookpage.scss';

export default function Webhooktable(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [wbhookid, setWbhookid] = useState('');
  const [wbhookcondition, setWbhookcondition] = useState('');
  const [wbhookactive, setWbhookactive] = useState('');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [filters, setFilters] = useState('')
 
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
  };

  const handleDeleteWebhook = async () => {
    const data = { webhookEvent: wbhookcondition };
    await deleteWebhook(props.dbId, wbhookid, data);
    closeDropdown();
    props?.setTabledata((currentState) => {
      let newState = {...currentState};
      delete newState[wbhookcondition][wbhookid];
      return newState;
    });

  };
  const handleUpdateActive = async () => {
    const data = {
      currentWebhookEvent: wbhookcondition,
      isActive: wbhookactive === true ? false : true,
    };
    const {updatedWebhook} = await updateWebhook(props.dbId, wbhookid, data).then(res => res.data.data);
    props?.setTabledata((currentWebhooks) => {
      currentWebhooks[wbhookcondition][wbhookid] = updatedWebhook;
      return currentWebhooks;
    });
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
      <Box className="webhook-table-main-container">
        <TableContainer className="webhook-table-container" component={Paper} >
          <Table  className="webhook-table"  stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Table</TableCell>

                <TableCell>Created On</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.tabledata && Object.entries(props?.tabledata).map(([condition, webhooks]) => (
                Object.entries(webhooks).map(([webhookid, webhook]) => (

                  <TableRow className="webhook-table-body-table-row" key={webhookid} >

                    <TableCell component="th" scope="row">
                      {webhook.name}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {webhook.url}
                    </TableCell>



                    <TableCell>{condition}</TableCell>
                    
                    <TableCell>{ props?.dataforwebhook[webhook.tableId]?.tableName}</TableCell>



                    <TableCell>
                      <span>{formatDateTime(webhook.createdAt * 1000)}</span>
                    </TableCell>

                    <TableCell >

                      <div>

                        <MenuIcon onClick={(event) => {
                          setWbhookactive(webhook.isActive);
                          setWbhookcondition(condition);
                          setName(webhook.name);
                          setWbhookid(webhookid);
                          setUrl(webhook.url);
                          setFilters(webhook.filterId)
                          toggleDropdown(event)
                        }}
                        />

                        {anchorEl && <Webhooktablemenu
                        dataforwebhook={props?.dataforwebhook}
                         newcreated={props.newcreated}
                         setTabledata={props?.setTabledata}
                         tabledata={props?.tabledata} setNewcreated={props.setNewcreated} tableId={webhook.tableId} dbId={props?.dbId} filterId={filters} weburl={url} condition={wbhookcondition} webhookname={name} webhookid={wbhookid} handleDeleteWebhook={handleDeleteWebhook} handleUpdateActive={handleUpdateActive} anchorEl={anchorEl} closeDropdown={closeDropdown} isActive={wbhookactive} />
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
  filters: PropTypes.any,
  dbId: PropTypes.string,
  tabledata: PropTypes.any,
  dataforwebhook:PropTypes.any,
  setTabledata: PropTypes.any,
  tableId: PropTypes.any,
  setNewcreated: PropTypes.any,
  newcreated: PropTypes.any
};

