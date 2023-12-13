import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  Box,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  Tooltip,
} from "@mui/material";
import { PropTypes } from "prop-types";
import {  deleteAuthkey } from "../../../api/authkeyApi";
import TableMenuDropdown from "../tableMenuDropdown/tableMenuDropdown.js";
import { allOrg } from "../../../store/database/databaseSelector";
import "./authKeyTable.scss";
import  { customUseSelector } from "../../../store/customUseSelector";

export const formatDateTime = (dateTime) => {
  const currentDate = new Date();
  const createdDate = new Date(dateTime);
  const timeDifference = currentDate - createdDate;

  if (timeDifference < 1000) {
    return "Just now";
  }

  if (timeDifference < 60 * 1000) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  if (timeDifference < 60 * 60 * 1000) {
    const minutes = Math.floor(timeDifference / (60 * 1000));
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  if (timeDifference < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    if (days === 1) {
      return "Yesterday";
    } else {
      const sameYear = currentDate.getFullYear() === createdDate.getFullYear();
      const monthName = createdDate.toLocaleString("default", { month: "long" });
      if (sameYear) {
        const date = createdDate.getDate();
        return `${date} ${monthName}`;
      } else {
        const year = createdDate.getFullYear();
        return `${monthName} ${year}`;
      }
    }
  }

  if (timeDifference < 12 * 30 * 24 * 60 * 60 * 1000) {
    const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }

  const year = createdDate.getFullYear();
  const monthName = createdDate.toLocaleString("default", { month: "long" });
  return `${monthName} ${year}`;
};

export default function AuthKey(props) {
  const adminId = localStorage.getItem("userid");

  const user = customUseSelector((state) => allOrg(state));
 
  
  

  function getCreatedByName(data) {
    var array = [];
    if (data ) {
      Object.entries(data)?.map((key) => {
        if (key[1]?.user && Array.isArray(user)) {
          user?.map((user) => {
            if (user.users && Array.isArray(user.users)) {
              user.users?.map((id) => {
                if (id?.user_id?._id == key[1]?.user) {
                  array.push(
                    id?.user_id?.first_name + " " + id?.user_id?.last_name
                  );
                }
              });
            }
          });
        }
      });
    }
    props?.setCreatedBy(array);
  }
  useEffect(()=>{
    getCreatedByName(props?.authKeys);

  },[props?.authKeys])

  

  async function deleteAuthkeyFun(authKey) {
    const data = await deleteAuthkey(props?.dbId, adminId, authKey);
    props?.setAuthKeys(data?.data?.data?.auth_keys);
    return data?.data?.data?.auth_keys;
  }

  
  return (
    <>
      <Box className="authKey-container">
        <TableContainer component={Paper} className="authkey-table-container">
          <Table
            stickyHeader
            aria-label="sticky table"
            className="auth-key-table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Auth Key</TableCell>
                <TableCell>Table Access</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.authKeys &&
                Object.keys(props?.authKeys)?.map((keys, index) => (
                  !props.authKeys[keys]?.appKey && 
                  <TableRow
                    key={keys}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {props.authKeys[keys].name}
                    </TableCell>
                    <TableCell>
                      {props?.createdBy && props?.createdBy[index]}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={props.authKeys[keys].createDate}
                        placement="top"
                      >
                        <span>
                          {formatDateTime(props.authKeys[keys].createDate)}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {keys.substring(0, 3) +
                        "*".repeat(keys.length - 6) +
                        keys.substring(keys.length - 3)}
                    </TableCell>
                    <TableCell>
                      {props.authKeys[keys].access === "1" ||
                      props.authKeys[keys].access === "11" ? (
                        <div>all</div>
                      ) : (
                        Object.keys(props?.authKeys[keys]?.access)?.map(
                          (key) => <div key={key}>{key}</div>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {props.authKeys[keys].access === "1" ||
                      props.authKeys[keys].access === "11" ? (
                        <div>{props?.authKeys[keys]?.scope}</div>
                      ) : (
                        Object.entries(props.authKeys[keys].access).map(
                          ([key, value]) => <div key={key}>{value?.scope}</div>
                        )
                      )}
                    </TableCell>

                    <TableCell>
                      <TableMenuDropdown
                        authData={props?.authKeys?.[keys]}
                        getCreatedByName={getCreatedByName}
                        first={"Edit"}
                        second={"Delete"}
                        third={"Show AuthKey"}
                        title={keys}
                        alltabledata={props?.alltabledata}
                        dbId={props.dbId}
                        setAuthKeys={props?.setAuthKeys}
                        deleteFunction={deleteAuthkeyFun}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

AuthKey.propTypes = {
  dbId: PropTypes.string,
  scope: PropTypes.any,
  authKeys: PropTypes.any,
  setAuthKeys: PropTypes.any,
  selected: PropTypes.any,
  setCreatedBy: PropTypes.any,
  createdBy: PropTypes.any,
  alltabledata: PropTypes.any,
};
